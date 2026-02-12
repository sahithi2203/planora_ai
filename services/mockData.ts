import { CurriculumData, ProgramType, UserRole, Semester, Course, Project, Risk, Comparison } from '../types';

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const MOCK_TOPICS_AI = [
  "Neural Networks & Deep Learning",
  "Natural Language Processing",
  "Computer Vision Fundamentals",
  "Ethics in AI & Governance",
  "Reinforcement Learning Systems",
  "MLOps & Deployment Pipelines"
];

const MOCK_TOPICS_WEB = [
  "Advanced React Patterns",
  "Server-Side Rendering with Next.js",
  "Web Assembly & Performance",
  "Scalable Backend Architecture",
  "Cloud Native DevOps",
  "Microservices Design"
];

const generateCourses = (topic: string, count: number, semesterIdx: number): Course[] => {
  const isAI = topic.toLowerCase().includes('ai') || topic.toLowerCase().includes('intelligence');
  const baseTopics = isAI ? MOCK_TOPICS_AI : MOCK_TOPICS_WEB;
  
  return Array.from({ length: count }).map((_, i) => ({
    id: generateRandomId(),
    title: baseTopics[(i + semesterIdx) % baseTopics.length] + ` ${semesterIdx + 1}.${i + 1}`,
    code: `CS-${200 + (semesterIdx * 100) + i}`,
    description: "An intensive module focusing on core principles and practical application in real-world scenarios.",
    credits: 3 + Math.floor(Math.random() * 2),
    topics: ["Key Concept 1", "Advanced Theory", "Practical Lab", "Case Study"],
    learningObjectives: [
      "Analyze core concepts and methodologies",
      "Apply theoretical knowledge to practical problems",
      "Evaluate performance and optimization strategies"
    ],
    projects: i % 2 === 0 ? ["Build a prototype", "Research Paper"] : []
  }));
};

const generateProjects = (topic: string): Project[] => [
  {
    id: generateRandomId(),
    title: `Autonomous ${topic} Agent System`,
    type: 'Capstone',
    description: "Build a fully autonomous agent capable of reasoning and executing complex tasks using LLMs and vector databases.",
    techStack: ["Python", "LangChain", "Pinecone", "React"],
    difficulty: 'Advanced'
  },
  {
    id: generateRandomId(),
    title: "Real-time Data Pipeline",
    type: 'Mini-Project',
    description: "Ingest and process high-throughput data streams for analytics.",
    techStack: ["Kafka", "Spark", "Node.js"],
    difficulty: 'Intermediate'
  },
  {
    id: generateRandomId(),
    title: "SaaS Dashboard Boilerplate",
    type: 'Mini-Project',
    description: "Create a reusable dashboard component library with authentication.",
    techStack: ["Next.js", "Tailwind", "Supabase"],
    difficulty: 'Beginner'
  }
];

const generateRisks = (duration: number): Risk[] => {
  const risks: Risk[] = [];
  if (duration < 3) {
    risks.push({
      id: generateRandomId(),
      type: 'Pacing',
      message: 'Curriculum is highly compressed. Weekly study hours may exceed 30h.',
      severity: 'High',
      suggestion: 'Extend duration by 1 semester or reduce elective count.'
    });
  }
  if (Math.random() > 0.5) {
    risks.push({
      id: generateRandomId(),
      type: 'Gap',
      message: 'Missing foundational statistics module required for Advanced ML.',
      severity: 'Medium',
      suggestion: 'Add "Statistical Methods for CS" in Semester 1.'
    });
  }
  return risks;
};

const generateComparisons = (): Comparison[] => [
  { institution: "MIT", matchRate: 85, missingTopics: ["Quantum Computing Basics", "Advanced Cryptography"] },
  { institution: "Stanford", matchRate: 78, missingTopics: ["Entrepreneurship in AI", "Distributed Systems"] },
  { institution: "IIT Bombay", matchRate: 92, missingTopics: ["Legacy System Migration"] }
];

export const generateMockCurriculum = (
  topic: string, 
  duration: number, 
  programType: ProgramType,
  role: UserRole
): CurriculumData => {
  
  const semesters: Semester[] = Array.from({ length: duration }).map((_, i) => ({
    id: i + 1,
    title: `Semester ${i + 1}`,
    theme: i === 0 ? "Foundations & Principles" : i === duration - 1 ? "Capstone & Specialization" : "Core Competencies",
    courses: generateCourses(topic, programType === 'Corporate' ? 2 : 4, i),
    totalCredits: programType === 'Corporate' ? 10 : 20,
    weeklyHours: programType === 'Corporate' ? 15 : 25
  }));

  const relevanceScore = 88 + Math.floor(Math.random() * 11);

  return {
    id: generateRandomId(),
    title: `${topic}`,
    description: `A comprehensive ${duration}-semester curriculum designed for ${programType} context (${role}), focusing on ${topic}. Optimized by Granite 3.3.`,
    programType,
    role,
    semesters,
    industryAlignment: relevanceScore,
    metrics: {
        relevanceScore: relevanceScore,
        readinessIndex: 85,
        loadBalanceScore: 90,
        skillCoverage: 92
    },
    bloomMapping: [
      { subject: 'Remember', A: 100, B: 80, fullMark: 150 },
      { subject: 'Understand', A: 90, B: 110, fullMark: 150 },
      { subject: 'Apply', A: 130, B: 90, fullMark: 150 },
      { subject: 'Analyze', A: 110, B: 120, fullMark: 150 },
      { subject: 'Evaluate', A: 95, B: 100, fullMark: 150 },
      { subject: 'Create', A: 140, B: 80, fullMark: 150 },
    ],
    difficultyCurve: semesters.map((s, i) => ({ name: `Sem ${s.id}`, level: (i + 1) * 15 + Math.random() * 10 })),
    skillGaps: [
      { skill: "Cloud Security", status: "Missing", relevance: 90 },
      { skill: "Legacy Systems", status: "Overloaded", relevance: 30 },
      { skill: "GenAI Integration", status: "On Track", relevance: 98 }
    ],
    careerOutcomes: [
      { role: "Senior Engineer", match: 94, salaryRange: "$140k - $220k", growth: 12 },
      { role: "Product Architect", match: 88, salaryRange: "$160k - $250k", growth: 8 },
      { role: "Technical Lead", match: 82, salaryRange: "$150k - $210k", growth: 15 }
    ],
    risks: generateRisks(duration),
    projects: generateProjects(topic),
    comparisons: generateComparisons(),
    generatedAt: new Date().toISOString()
  };
};