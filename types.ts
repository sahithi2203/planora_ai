import { GroundingChunk } from "@google/genai";

export enum Mode {
  PLAN = 'PLAN',
  EXPLORE = 'EXPLORE',
  RESEARCH = 'RESEARCH'
}

export interface Activity {
  time: string;
  activity: string;
  location?: string;
  description?: string;
  category: 'food' | 'sightseeing' | 'travel' | 'leisure' | 'other';
}

export interface DayPlan {
  day: string;
  theme?: string;
  activities: Activity[];
}

export interface Itinerary {
  title: string;
  summary: string;
  days: DayPlan[];
}

export type { GroundingChunk };

export interface Message {
  id: string;
  role: 'user' | 'model';
  content?: string;
  type: 'text' | 'itinerary' | 'map_results';
  itineraryData?: Itinerary;
  groundingData?: GroundingChunk[];
  timestamp: number;
}

// --- New Types added to fix errors ---

export type ProgramType = 'University' | 'Startup' | 'Corporate' | 'Self-Paced';

export type UserRole = 
  | 'Academic Administrator' | 'Faculty' | 'Student' 
  | 'Founder' | 'Mentor' | 'Learner' 
  | 'L&D Manager' | 'Team Lead' | 'Employee' 
  | 'Self-Learner' | 'Working Professional' | 'Career Switcher';

export interface UserInput {
  topic: string;
  level: string;
  duration: number;
  programType: ProgramType;
  role: UserRole;
  syllabusContent?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  description: string;
  techStack: string[];
  difficulty: string;
}

export interface Risk {
  id: string;
  type: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low';
  suggestion?: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  credits: number;
  topics: string[];
  learningObjectives: string[];
  projects: string[];
}

export interface Semester {
  id: number;
  title: string;
  theme: string;
  courses: Course[];
  totalCredits: number;
  weeklyHours: number;
}

export interface Comparison {
  institution: string;
  matchRate: number;
  missingTopics: string[];
}

export interface CurriculumData {
  id: string;
  title: string;
  description: string;
  programType: ProgramType;
  role: UserRole;
  semesters: Semester[];
  industryAlignment: number;
  metrics: {
    relevanceScore: number;
    readinessIndex: number;
    loadBalanceScore: number;
    skillCoverage: number;
  };
  bloomMapping: {
    subject: string;
    A: number;
    B: number;
    fullMark: number;
  }[];
  difficultyCurve: {
    name: string;
    level: number;
  }[];
  skillGaps: {
    skill: string;
    status: string;
    relevance: number;
  }[];
  careerOutcomes: {
    role: string;
    match: number;
    salaryRange: string;
    growth: number;
  }[];
  risks: Risk[];
  projects: Project[];
  comparisons: Comparison[];
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}