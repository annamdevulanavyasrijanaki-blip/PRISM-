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

export interface CustomSection {
  id: string;
  title: string;
  content: string;
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
  template: string;
  settings?: {
    fontSize: number;
    sectionSpacing: number;
  };
}

export const INITIAL_RESUME_DATA: ResumeData = {
  // ... (existing John Doe data)
  personal: {
    fullName: "John Doe",
    jobTitle: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    leetcode: "https://leetcode.com/johndoe",
    hackathon: "https://devpost.com/johndoe",
    summary: "Dedicated software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, performance optimization, and mentoring junior developers.",
    profileImage: "",
  },
  experience: [
    {
      id: "1",
      company: "Tech Solutions Inc.",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "Present",
      current: true,
      description: "Led the development of a flagship SaaS product, resulting in a 40% increase in user engagement. Managed a team of 5 developers and implemented CI/CD pipelines.",
    },
    {
      id: "2",
      company: "Innovate Web",
      position: "Frontend Developer",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description: "Developed responsive UI components using React and Tailwind CSS. Optimized application performance, reducing page load times by 30%.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University of Technology",
      degree: "B.S. in Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      description: "GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Web Development.",
    },
  ],
  skills: [
    { id: "1", name: "React", level: "Expert" },
    { id: "2", name: "TypeScript", level: "Expert" },
    { id: "3", name: "Node.js", level: "Intermediate" },
    { id: "4", name: "Tailwind CSS", level: "Expert" },
    { id: "5", name: "PostgreSQL", level: "Intermediate" },
  ],
  projects: [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Built a full-stack e-commerce application with Stripe integration and user authentication.",
      link: "https://github.com/johndoe/shop",
    },
  ],
  certifications: [],
  awards: [],
  volunteer: [],
  languages: [],
  interests: [],
  customSections: [],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
  template: "modern",
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
  template: "modern",
  settings: {
    fontSize: 1,
    sectionSpacing: 1,
  },
};

export const SAMPLE_RESUME_DATA: ResumeData = {
  ...INITIAL_RESUME_DATA,
  personal: {
    ...INITIAL_RESUME_DATA.personal,
    fullName: "Alex Sterling",
    jobTitle: "Lead Systems Architect",
    summary: "Strategic technology leader with over 12 years of experience in distributed systems and cloud infrastructure. Expert in scaling engineering teams and implementing robust architecture for high-traffic global platforms.",
  },
  experience: [
    {
      id: "demo-1",
      company: "Quantum Dynamics",
      position: "Lead Systems Architect",
      startDate: "2021-03",
      endDate: "Present",
      current: true,
      description: "Architected a multi-region kubernetes cluster handling 500k+ concurrent requests. Reduced operational costs by 35% through infrastructure automation.",
    },
    {
      id: "demo-2",
      company: "Stellar Cloud",
      position: "Senior Infrastructure Engineer",
      startDate: "2018-01",
      endDate: "2021-02",
      current: false,
      description: "Deployed global edge computing network. Spearheaded migration from legacy monolith to serverless architecture.",
    }
  ],
  skills: [
    { id: "s1", name: "Kubernetes", level: "Expert" },
    { id: "s2", name: "Golang", level: "Expert" },
    { id: "s3", name: "Rust", level: "Intermediate" },
    { id: "s4", name: "AWS/GCP", level: "Expert" },
    { id: "s5", name: "Terraform", level: "Expert" }
  ],
  sectionOrder: ["summary", "experience", "education", "skills", "projects"],
};
