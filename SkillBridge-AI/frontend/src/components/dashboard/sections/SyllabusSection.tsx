"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface SyllabusSectionProps {
    onUpload: (file: File) => void;
    isLoading?: boolean;
}

export const SyllabusSection = ({ onUpload, isLoading = false }: SyllabusSectionProps) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [uploadStage, setUploadStage] = useState<"idle" | "uploading" | "extracting" | "mapping" | "finalizing">("idle");
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync local loading state if parent controls it (for mock flow we use parent)
    // but we can also manage local visual stages for effect.
    // When `isLoading` beomes true, we start the fake progress sequence if we haven't already.

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "application/pdf") {
                setError("Please upload a PDF file");
                return;
            }
            if (selectedFile.size > 10 * 1024 * 1024) {
                setError("File size exceeds 10MB limit");
                return;
            }
            setFile(selectedFile);
            setError("");
        }
    };

    const handleUploadClick = () => {
        if (file) {
            setUploadStage("uploading");
            // Simulate stage progression purely for visual feedback 
            // while the parent handles the "actual" (mock) logic
            setTimeout(() => setUploadStage("extracting"), 1500);
            setTimeout(() => setUploadStage("mapping"), 3500);
            setTimeout(() => setUploadStage("finalizing"), 5500);

            onUpload(file);
        }
    };

    const handleSkip = () => {
        // Create a dummy file or pass null if logic supports it
        // For compliance with type, let's create a dummy file
        const dummy = new File(["dummy content"], "standard-curriculum.pdf", { type: "application/pdf" });
        setUploadStage("uploading");
        setTimeout(() => setUploadStage("finalizing"), 2000);
        onUpload(dummy);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
                    Syllabus Integration
                </h1>
                <p className="text-zinc-500 font-medium">
                    Upload your curriculum to align your roadmap with your academic requirements.
                </p>
            </header>

            <div className="bg-white dark:bg-zinc-900 p-12 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    {uploadStage === "idle" ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center"
                        >
                            <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
                                📄
                            </div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                {file ? file.name : "Select your Syllabus PDF"}
                            </h2>
                            <p className="text-sm text-zinc-500 mb-10">
                                Max file size: 10MB • Format: PDF
                            </p>

                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />

                            <div className="flex flex-col gap-4 items-center">
                                {!file ? (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black cursor-pointer hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
                                    >
                                        Browse Files
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleUploadClick}
                                            disabled={isLoading}
                                            className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95"
                                        >
                                            {isLoading ? "Starting..." : "Analyze Syllabus →"}
                                        </button>
                                        <button
                                            onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                            className="px-8 py-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-2xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                                        >
                                            Change
                                        </button>
                                    </div>
                                )}

                                <button
                                    onClick={handleSkip}
                                    className="mt-6 text-sm font-bold text-zinc-400 hover:text-blue-600 transition-colors"
                                >
                                    Skip for now (Use industry standard) →
                                </button>
                            </div>

                            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-sm text-red-500 font-bold">❌ {error}</motion.p>}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-10"
                        >
                            <div className="w-full max-w-sm space-y-10">
                                <div className="relative h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                        initial={{ width: "0%" }}
                                        animate={{
                                            width:
                                                uploadStage === "uploading" ? "25%" :
                                                    uploadStage === "extracting" ? "50%" :
                                                        uploadStage === "mapping" ? "75%" : "100%"
                                        }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                    />
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: "uploading", label: "Uploading to secure storage" },
                                        { id: "extracting", label: "AI identifying key modules" },
                                        { id: "mapping", label: "Mapping to industry standards" },
                                        { id: "finalizing", label: "Finalizing your roadmap" }
                                    ].map((stage, idx) => {
                                        const stages = ["uploading", "extracting", "mapping", "finalizing"];
                                        const currentIdx = stages.indexOf(uploadStage);
                                        const isDone = currentIdx > idx;
                                        const isCurrent = currentIdx === idx;

                                        return (
                                            <motion.div
                                                key={stage.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.2 }}
                                                className={`flex items-center gap-4 ${isDone ? "text-green-500" : isCurrent ? "text-blue-600" : "text-zinc-300"}`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${isDone ? "bg-green-500 border-green-500" : isCurrent ? "border-blue-600 animate-pulse" : "border-zinc-200 dark:border-zinc-800"}`}>
                                                    {isDone ? <span className="text-white text-[10px]">✓</span> : <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-blue-600" : "bg-transparent"}`} />}
                                                </div>
                                                <span className={`text-sm font-black uppercase tracking-widest ${isCurrent ? "animate-pulse" : ""}`}>
                                                    {stage.label}
                                                </span>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                <p className="text-center text-xs text-zinc-400 font-medium italic">
                                    This usually takes about 10-15 seconds...
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
