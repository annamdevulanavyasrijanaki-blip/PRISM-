import * as pdfjs from 'pdfjs-dist';
// @ts-ignore - pdfjs-dist doesn't provide types for the worker file itself
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Set worker source for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }

  return fullText;
}

/**
 * Improved parser to extract info from raw text using heuristics and regex.
 */
export function basicResumeParser(text: string) {
  const sections: Record<string, string[]> = {
    personal: [],
    experience: [],
    education: [],
    skills: [],
    projects: []
  };

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  let currentSection = 'personal';

  // Section Headers Keywords
  const headers = {
    experience: ['experience', 'work history', 'employment', 'background', 'career'],
    education: ['education', 'academic', 'studies', 'schooling', 'qualifications'],
    skills: ['skills', 'competencies', 'technologies', 'tools', 'stack', 'expertise'],
    projects: ['projects', 'key projects', 'assignments']
  };

  lines.forEach(line => {
    const lowerLine = line.toLowerCase();
    
    // Check if line is a section header (usually short and contains keywords)
    let foundHeader = false;
    for (const [key, keywords] of Object.entries(headers)) {
      if (keywords.some(h => lowerLine === h || lowerLine.startsWith(h + ':') || (lowerLine.includes(h) && line.length < 30))) {
        currentSection = key;
        foundHeader = true;
        break;
      }
    }

    if (!foundHeader) {
      sections[currentSection].push(line);
    }
  });

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const dateRangeRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2})\s*\d{2,4}\s*(?:-|–|to|until)\s*(?:Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2})\s*\d{2,4}/i;
  
  const email = text.match(emailRegex)?.[0] || "";
  const phone = text.match(phoneRegex)?.[0] || "";
  
  // Refined Experience Extraction
  const experience: any[] = [];
  let currentExp: any = null;

  sections.experience.forEach(line => {
    const dateMatch = line.match(dateRangeRegex);
    // If a line has a date range, it's likely a new experience entry or part of one
    if (dateMatch) {
      if (currentExp) experience.push(currentExp);
      
      const dates = dateMatch[0].split(/-|–|to/i).map(d => d.trim());
      currentExp = {
        id: `exp-${Date.now()}-${Math.random()}`,
        company: line.replace(dateMatch[0], '').trim() || "Company",
        position: "Job Title",
        startDate: dates[0] || "",
        endDate: dates[1] || "",
        current: dates[1].toLowerCase().includes('present') || dates[1].toLowerCase().includes('current'),
        description: ""
      };
    } else if (currentExp) {
      if (!currentExp.description) currentExp.description = line;
      else currentExp.description += '\n' + line;
    } else if (line.length > 5) {
      // Initialize first experience if skip dates
      currentExp = {
        id: `exp-init`,
        company: line,
        position: "Position",
        startDate: "",
        endDate: "",
        current: false,
        description: ""
      };
    }
  });
  if (currentExp) experience.push(currentExp);

  // Refined Education Extraction
  const education: any[] = [];
  let currentEdu: any = null;
  const eduKeywords = ['university', 'college', 'institute', 'school', 'bachleor', 'master', 'phd', 'degree'];

  sections.education.forEach(line => {
    if (eduKeywords.some(k => line.toLowerCase().includes(k))) {
      if (currentEdu) education.push(currentEdu);
      currentEdu = {
        id: `edu-${Date.now()}`,
        school: line,
        degree: "Field of Study",
        startDate: "",
        endDate: "",
        description: ""
      };
    } else if (currentEdu) {
      if (currentEdu.degree === "Field of Study") currentEdu.degree = line;
      else currentEdu.description += line + " ";
    }
  });
  if (currentEdu) education.push(currentEdu);

  const skills: any[] = [];
  sections.skills.forEach(line => {
    // Split by comma, pipe, or just individual lines
    const parts = line.split(/[,|•]/).map(p => p.trim()).filter(p => p.length > 0);
    parts.forEach(p => {
      if (skills.length < 15) {
        skills.push({
          id: `skill-${skills.length}`,
          name: p,
          level: "Intermediate"
        });
      }
    });
  });

  return {
    personal: {
      fullName: sections.personal[0] || "", 
      email,
      phone,
      location: "",
      jobTitle: sections.personal[1] || "",
      website: "",
      summary: sections.personal.slice(2, 6).join(' '),
      profileImage: "",
    },
    experience: experience.length > 0 ? experience : [],
    education: education.length > 0 ? education : [],
    skills: skills.length > 0 ? skills : [],
    projects: []
  };
}
