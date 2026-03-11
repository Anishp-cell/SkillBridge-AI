"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar, DashboardStage } from "@/components/dashboard/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

// Import existing sections
import { InputsSection } from "@/components/dashboard/sections/InputsSection";
import { RecommendationSection } from "@/components/dashboard/sections/RecommendationSection";
import { SyllabusSection } from "@/components/dashboard/sections/SyllabusSection";
import { RoadmapSection } from "@/components/dashboard/sections/RoadmapSection";
import { ExportSection } from "@/components/dashboard/sections/ExportSection";
import { StudentDashboard } from "@/components/dashboard/sections/StudentDashboard";

// --- Types ---
export interface PipelineData {
    inputs: {
        interests: string[];
        hoursPerWeek: number;
        durationWeeks: number;
        skills: string[]; // From InputsSection state
    };
    recommendation: {
        domain: string;
        matchScore: number; // mapped from readiness_score (0-1) -> 0-100
        skillGap: {
            missing: string[];
            partial: string[]; // Backend might need to provide this, currently missing_skills is provided
            covered: string[]; // Backend provides fully_covered
        };
    } | null;
    syllabusFile: File | null;
    roadmap: any | null;
    exportUrl: string | null;
}

const INITIAL_DATA: PipelineData = {
    inputs: {
        interests: [],
        hoursPerWeek: 10,
        durationWeeks: 16,
        skills: []
    },
    recommendation: null,
    syllabusFile: null,
    roadmap: null,
    exportUrl: null
};

export default function DashboardPage() {
    // 1. Core State
    const [currentStage, setCurrentStage] = useState<DashboardStage>("home");
    const [maxUnlockedStage, setMaxUnlockedStage] = useState(0);
    const [data, setData] = useState<PipelineData>(INITIAL_DATA);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Navigation Helper
    const advanceStage = (nextStage: DashboardStage) => {
        const stageOrder: DashboardStage[] = ["home", "inputs", "recommendation", "upload", "roadmap", "export"];
        const nextIndex = stageOrder.indexOf(nextStage);

        if (nextIndex > maxUnlockedStage) {
            setMaxUnlockedStage(nextIndex);
        }
        setCurrentStage(nextStage);
    };

    // 3. Stage Handlers

    // Stage 1: Inputs -> Recommendation (Interests Review)
    const handleInputsComplete = async (inputs: any) => {
        // Note: InputsSection returns { skills, interests, ... }
        // We update our local state to hold these preferences
        setData(prev => ({
            ...prev,
            inputs: {
                interests: inputs.interests,
                hoursPerWeek: inputs.weekly_hours,
                durationWeeks: inputs.duration_weeks,
                skills: inputs.skills
            }
        }));
        advanceStage("recommendation");
    };

    // Stage 2: Recommendation -> Upload
    const handleRecommendationComplete = () => {
        advanceStage("upload");
    };

    // Stage 3: Syllabus Upload -> Roadmap (REAL API CALL)
    const handleSyllabusUpload = async (file: File) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("syllabus", file);
            formData.append("weekly_hours", data.inputs.hoursPerWeek.toString());
            formData.append("duration_weeks", data.inputs.durationWeeks.toString());

            // Append interests individually for List[str] mapping in FastAPI
            data.inputs.interests.forEach(interest => {
                formData.append("interests", interest);
            });
            // If the user didn't select interests, we should at least send one or handle it.
            // But let's assume they did. Alternatively, we can append their skills as backup interests.
            if (data.inputs.interests.length === 0 && data.inputs.skills.length > 0) {
                data.inputs.skills.forEach(skill => {
                    formData.append("interests", skill);
                });
            }

            // Call Backend
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roadmap/generate`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Failed to generate roadmap");
            }

            const result = await response.json();

            // Map Backend Result to Frontend State
            // Backend returns:
            // {
            //   domain: str,
            //   readiness_score: float (0.0 - 1.0),
            //   missing_skills: list[str],
            //   roadmap: dict,
            //   google_sheet_url: str (might be 'skipped-due-to-error' or valid url)
            // }

            setData(prev => ({
                ...prev,
                syllabusFile: file,
                recommendation: {
                    domain: result.domain,
                    // Use backend-provided match_score (final_score) if available, else derive from readiness
                    matchScore: result.match_score ?? Math.round(result.readiness_score * 100),
                    skillGap: {
                        missing: result.missing_skills || [],
                        partial: [], // Backend doesn't explicitly return partial list in top-level yet, but it's in roadmap logic
                        covered: []  // similarly
                    }
                },
                roadmap: result.roadmap,
                exportUrl: result.google_sheet_url && result.google_sheet_url.startsWith("http")
                    ? result.google_sheet_url
                    : null
            }));

            setIsLoading(false);
            advanceStage("roadmap");

        } catch (error) {
            console.error("Roadmap generation error:", error);
            alert("Roadmap generation failed. Please try again or check console for details.");
            setIsLoading(false);
        }
    };

    // Stage 4: Roadmap Review -> Export
    const handleRoadmapConfirm = () => {
        advanceStage("export");
    };

    // Stage 5: Export Generator
    const handleExport = async () => {
        // If the URL was already generated during the main pipeline, we just use it.
        // If it failed then (url is null), we might want to re-trigger export here, 
        // but for now let's just show what we have.
        if (!data.exportUrl) {
            if (!data.roadmap) {
                alert("Please upload your syllabus first to generate a roadmap. The Google Sheets export will be created automatically during roadmap generation.");
            } else {
                alert("Google Sheets export failed during roadmap generation. The roadmap is available in the app, but the sheet couldn't be created. Please check your backend logs.");
            }
        }
    };

    // 4. Render Content Switcher
    const renderStageContent = () => {
        switch (currentStage) {
            case "home":
                return <StudentDashboard />;
            case "inputs":
                // InputsSection passes raw form state up
                return (
                    <InputsSection
                        initialData={null}
                        onComplete={handleInputsComplete}
                        isLoading={isLoading}
                    />
                );
            case "recommendation":
                return (
                    <RecommendationSection
                        onComplete={handleRecommendationComplete}
                        onBack={() => setCurrentStage("inputs")}
                        inputs={data.inputs}
                    />
                );
            case "upload":
                return (
                    <SyllabusSection
                        onUpload={handleSyllabusUpload}
                        isLoading={isLoading}
                    />
                );
            case "roadmap":
                return (
                    <RoadmapSection
                        onComplete={handleRoadmapConfirm}
                        onNext={handleRoadmapConfirm}
                        roadmapData={data.roadmap}
                        recommendation={data.recommendation}
                    />
                );
            case "export":
                return (
                    <ExportSection
                        exportUrl={data.exportUrl}
                        onExport={handleExport}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen bg-zinc-50 dark:bg-black">
                {/* Fixed Sidebar */}
                <Sidebar
                    currentStage={currentStage}
                    maxUnlockedStage={maxUnlockedStage}
                    onStageChange={setCurrentStage}
                />

                {/* Main Scrollable Content Area */}
                <DashboardContent currentStage={currentStage}>
                    {renderStageContent()}
                </DashboardContent>
            </div>
        </ProtectedRoute>
    );
}
