import { GoogleGenAI } from "@google/genai";
import { CurriculumData, UserInput, Semester, Course, Project, Risk, Comparison, ProgramType, UserRole } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

// --- DYNAMIC CHART DATA GENERATORS ---

const getBloomDistribution = (type: ProgramType) => {
  const base = [
    { subject: 'Remember', A: 0, B: 100, fullMark: 150 },
    { subject: 'Understand', A: 0, B: 100, fullMark: 150 },
    { subject: 'Apply', A: 0, B: 100, fullMark: 150 },
    { subject: 'Analyze', A: 0, B: 100, fullMark: 150 },
    { subject: 'Evaluate', A: 0, B: 100, fullMark: 150 },
    { subject: 'Create', A: 0, B: 100, fullMark: 150 },
  ];

  if (type === 'University') {
    return base.map(b => ({
      ...b,
      A: b.subject === 'Analyze' || b.subject === 'Understand' || b.subject === 'Evaluate' 
         ? 130 + Math.random() * 20 
         : 80 + Math.random() * 20
    }));
  } else if (type === 'Startup') {
    return base.map(b => ({
      ...b,
      A: b.subject === 'Create' || b.subject === 'Apply' 
         ? 145 + Math.random() * 5 
         : 60 + Math.random() * 30
    }));
  } else if (type === 'Corporate') {
    return base.map(b => ({
      ...b,
      A: b.subject === 'Evaluate' || b.subject === 'Apply' 
         ? 130 + Math.random() * 20 
         : 90 + Math.random() * 20
    }));
  } else {
    return base.map(b => ({ ...b, A: 100 + Math.random() * 30 }));
  }
};

const getDifficultyCurve = (type: ProgramType, duration: number) => {
  return Array.from({ length: duration }).map((_, i) => {
    let level = 0;
    if (type === 'University') {
        level = 20 + (i * (80 / duration)); 
    } else if (type === 'Startup') {
        level = 40 + (Math.log(i + 1) * 30);
    } else if (type === 'Corporate') {
        level = 30 + (Math.floor(i / 2) * 20);
    } else {
        level = 10 + (i * (60 / duration));
    }
    return { name: `Sem ${i + 1}`, level: Math.min(100, level) };
  });
};

const generateAuxiliaryData = (duration: number, programType: ProgramType, role: UserRole) => {
  let baseRelevance = 85;
  let baseReadiness = 80;
  let baseLoad = 80;
  let baseCoverage = 80;

  if (programType === 'Corporate') {
    baseRelevance = 96;
    baseReadiness = 92;
    baseLoad = 75;
  } else if (programType === 'Startup') {
    baseReadiness = 98;
    baseLoad = 40;
    baseCoverage = 60;
  } else if (programType === 'University') {
    baseCoverage = 98;
    baseReadiness = 70;
  }

  return {
    metrics: {
        relevanceScore: Math.min(100, baseRelevance + Math.floor(Math.random() * 10 - 5)),
        readinessIndex: Math.min(100, baseReadiness + Math.floor(Math.random() * 10 - 5)),
        loadBalanceScore: Math.min(100, baseLoad + Math.floor(Math.random() * 10 - 5)),
        skillCoverage: Math.min(100, baseCoverage + Math.floor(Math.random() * 10 - 5)),
    },
    bloomMapping: getBloomDistribution(programType),
    skillGaps: [
      { skill: "Emerging Tech Integration", status: "On Track", relevance: 95 },
      { skill: "Legacy Maintenance", status: "Missing", relevance: 40 },
      { skill: "Cross-functional Comms", status: "Overloaded", relevance: 85 }
    ] as any[],
    careerOutcomes: [
      { role: role === 'Founder' ? "CTO / Co-Founder" : "Senior Engineer", match: 92, salaryRange: "$120k - $180k", growth: 15 },
      { role: "Technical Lead", match: 88, salaryRange: "$150k - $220k", growth: 10 },
      { role: "R&D Researcher", match: 85, salaryRange: "$110k - $160k", growth: 8 }
    ] as any[],
    comparisons: [
      { institution: "MIT", matchRate: 82, missingTopics: ["Advanced Theoretical Math"] },
      { institution: "Stanford", matchRate: 88, missingTopics: ["Niche Electives"] },
      { institution: "Industry Standard", matchRate: 95, missingTopics: [] }
    ] as Comparison[]
  };
};

export const generateCurriculumAI = async (input: UserInput): Promise<CurriculumData> => {
  let prompt = "";
  let syllabusContext = "";

  if (input.syllabusContent) {
    syllabusContext = `
    ------------------------------------------------
    USER PROVIDED SYLLABUS / CONTEXT
    ------------------------------------------------
    SYLLABUS CONTENT:
    """
    ${input.syllabusContent.substring(0, 10000)}
    """
    INSTRUCTION: Align the plan with the topics found above.
    `;
  }

  if (input.programType === 'University') {
    prompt = `
    You are a university academic planning system.
    Generate a curriculum for:
    Program Type: University
    User Role: ${input.role}
    Topic: "${input.topic}"
    Duration: ${input.duration} semesters
    Level: ${input.level}

    ${syllabusContext}

    Time Rules:
    - If Academic Administrator: Semester level only (Overview, Month ranges).
    - If Faculty: Week level (Teaching schedule, Exam phases).
    - If Student: Month + Day level (Study plan, Revision).

    Output JSON Format:
    {
      "title": "String",
      "description": "String",
      "semesters": [
        {
          "title": "String",
          "theme": "String",
          "totalCredits": 20,
          "weeklyHours": 20,
          "courses": [
            {
              "title": "String",
              "code": "String",
              "description": "String",
              "credits": 3,
              "topics": ["String"],
              "learningObjectives": ["String"],
              "projects": ["String"]
            }
          ]
        }
      ],
      "projects": [
        {
          "title": "String",
          "type": "String",
          "description": "String",
          "techStack": ["String"],
          "difficulty": "String"
        }
      ],
      "risks": [
        {
          "type": "String",
          "message": "String",
          "severity": "High" | "Medium" | "Low",
          "suggestion": "String"
        }
      ]
    }
    `;
  } else {
    prompt = `
      You are an expert curriculum architect.
      Generate a curriculum for: ${input.programType} - ${input.role}
      Topic: "${input.topic}"
      Duration: ${input.duration} units
      Level: ${input.level}

      ${syllabusContext}

      Style Guide:
      - Startup: Aggressive sprints, practical, no theory.
      - Corporate: Training modules, ROI focus.
      - Self-Paced: Milestones, balanced.

      Output JSON Format:
      {
        "title": "String",
        "description": "String",
        "semesters": [
          {
            "title": "String",
            "theme": "String",
            "totalCredits": 10,
            "weeklyHours": 10,
            "courses": [
              {
                "title": "String",
                "code": "String",
                "description": "String",
                "credits": 1,
                "topics": ["String"],
                "learningObjectives": ["String"],
                "projects": ["String"]
              }
            ]
          }
        ],
        "projects": [
           {
            "title": "String",
            "type": "String",
            "description": "String",
            "techStack": ["String"],
            "difficulty": "String"
          }
        ],
        "risks": [
           {
            "type": "String",
            "message": "String",
            "severity": "High" | "Medium" | "Low",
            "suggestion": "String"
          }
        ]
      }
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const jsonText = response.text || "{}";
    let parsed;
    try {
        parsed = JSON.parse(jsonText);
    } catch (e) {
        console.error("JSON parse error", e);
        parsed = {};
    }
    
    // Ensure data integrity by filling in missing fields or auxiliary data
    const auxData = generateAuxiliaryData(input.duration, input.programType, input.role);

    // Map parsed data to match CurriculumData interface completely
    const curriculum: CurriculumData = {
        id: generateRandomId(),
        title: parsed.title || `${input.topic} Curriculum`,
        description: parsed.description || "AI Generated Curriculum",
        programType: input.programType,
        role: input.role,
        semesters: (parsed.semesters || []).map((s: any, i: number) => ({
            id: i + 1,
            title: s.title || `Unit ${i+1}`,
            theme: s.theme || "Core Concepts",
            totalCredits: s.totalCredits || 10,
            weeklyHours: s.weeklyHours || 10,
            courses: (s.courses || []).map((c: any, ci: number) => ({
                id: generateRandomId(),
                title: c.title || "Module",
                code: c.code || `MOD-${i+1}-${ci+1}`,
                description: c.description || "",
                credits: c.credits || 3,
                topics: c.topics || [],
                learningObjectives: c.learningObjectives || [],
                projects: c.projects || []
            }))
        })),
        projects: (parsed.projects || []).map((p: any) => ({
            id: generateRandomId(),
            title: p.title || "Project",
            type: p.type || "Assignment",
            description: p.description || "",
            techStack: p.techStack || [],
            difficulty: p.difficulty || "Intermediate"
        })),
        risks: (parsed.risks || []).map((r: any) => ({
            id: generateRandomId(),
            type: r.type || "General",
            message: r.message || "Potential risk",
            severity: r.severity || "Low",
            suggestion: r.suggestion
        })),
        // Merge auxiliary data
        metrics: auxData.metrics,
        bloomMapping: auxData.bloomMapping,
        difficultyCurve: getDifficultyCurve(input.programType, input.duration),
        skillGaps: auxData.skillGaps,
        careerOutcomes: auxData.careerOutcomes,
        comparisons: auxData.comparisons,
        generatedAt: new Date().toISOString(),
        industryAlignment: auxData.metrics.relevanceScore 
    };

    return curriculum;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};
