export interface SkillGap {
    fully_covered: string[];
    partially_covered: string[];
    missing: string[];
}

export interface Recommendation {
    domain: string;
    interest_score: number;
    readiness_score: number;
    final_score: number;
    skill_gap: SkillGap;
}

export interface Resource {
    title: string;
    type: 'video' | 'article' | 'book';
    url: string;
}

export interface WeeklyPlan {
    week: number;
    topic: string;
    skillsCovered: string[];
    deliverable: string;
    learning_resources: Resource[];
}

export interface Phase {
    phaseName: string;
    weeklyPlan: WeeklyPlan[];
}

export interface Roadmap {
    domain: string;
    totalDurationWeeks: number;
    weeklyHours: number;
    phases: Phase[];
    google_sheet_url: string;
    missing_skills: string[];
}
export interface UserOnboarding {
    skills: string[];
    interests: string[];
    goals: string;
    currentLevel: string;
    weekly_hours: number;
    duration_weeks: number;
    currentStage?: string;
    maxUnlockedStage?: number;
    selectedDomain?: string;
}
