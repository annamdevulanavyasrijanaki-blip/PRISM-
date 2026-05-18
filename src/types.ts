/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  hackathon?: string;
  summary: string;
  jobTitle: string;
  profileImage?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string; // e.g., Beginner, Intermediate, Expert
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Volunteer {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: string; // e.g., Native, Fluent, Intermediate
}

export interface Interest {
  id: string;
  name: string;
}

export interface CustomItem {
  id: string;
  label: string;
  value: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomItem[];
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications?: Certification[];
  awards?: Award[];
  volunteer?: Volunteer[];
  languages?: Language[];
  interests?: Interest[];
  customSections?: CustomSection[];
  sectionOrder: string[]; 
  pages?: string[][];
  template: string;
  sectionLabels?: Record<string, string>;
  settings?: {
    fontSize: number;
    sectionSpacing: number;
    fontFamily?: 'sans' | 'serif' | 'mono' | 'display' | 'elegant';
  };
}

export const INITIAL_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    leetcode: "",
    hackathon: "",
    summary: "",
    profileImage: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  volunteer: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
  pages: [["summary", "experience", "education", "skills", "projects"]],
  template: "modern",
  sectionLabels: {
    summary: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Expertise",
    projects: "Featured Projects",
    certifications: "Certifications",
    awards: "Recognitions",
    languages: "Linguistics",
    volunteer: "Volunteer Work",
    interests: "Interests"
  },
  settings: {
    fontSize: 1,
    sectionSpacing: 1,
  },
};

export const EMPTY_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    leetcode: "",
    hackathon: "",
    summary: "",
    profileImage: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  awards: [],
  volunteer: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
  pages: [["summary", "experience", "education", "skills", "projects"]],
  template: "modern",
  sectionLabels: {
    summary: "Profile",
    experience: "Experience",
    education: "Education",
    skills: "Expertise",
    projects: "Featured Projects",
    certifications: "Certifications",
    awards: "Recognitions",
    languages: "Linguistics",
    volunteer: "Volunteer Work",
    interests: "Interests"
  },
  settings: {
    fontSize: 1,
    sectionSpacing: 1,
  },
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  ...INITIAL_RESUME_DATA,
  personal: {
    ...INITIAL_RESUME_DATA.personal,
    fullName: "Resume Preview",
    jobTitle: "Your Title Here",
    summary: "This is a preview of how your resume will look with actual data. All sections are dynamic and will only appear when populated.",
  },
  experience: [
    {
      id: "demo-1",
      company: "Previous Company",
      position: "Your Position",
      startDate: "2021",
      endDate: "Present",
      current: true,
      description: "Briefly describe your responsibilities and achievements in this role.",
    }
  ],
  skills: [
    { id: "s1", name: "Key Skill 1", level: "Expert" },
    { id: "s2", name: "Key Skill 2", level: "Intermediate" }
  ],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
  pages: [["summary", "experience", "education", "skills", "projects"]],
};
