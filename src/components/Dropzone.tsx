"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File as FileIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropzoneProps {
    onDrop: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    files?: File[];
    onRemove?: (file: File) => void;
    title?: string;
    description?: string;
}

export default function Dropzone({
    onDrop,
    accept,
    maxFiles = 1,
    files = [],
    onRemove,
    title = "Upload Image",
    description = "Drag & drop an image here, or click to select",
}: DropzoneProps) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles,
    });

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-3xl cursor-pointer transition-colors",
                    isDragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-gray-50",
                    files.length > 0 && "h-auto py-8"
                )}
            >
                <input {...getInputProps()} />

                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <div className="mb-4 p-4 bg-blue-100 rounded-full text-blue-600">
                            <Upload className="w-8 h-8" />
                        </div>
                        <p className="mb-2 text-xl font-semibold text-gray-700">
                            {title}
                        </p>
                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    </div>
                ) : (
                    <div className="w-full px-4">
                        <AnimatePresence>
                            {files.map((file, index) => (
                                <motion.div
                                    key={file.name + index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex items-center justify-between p-4 mb-2 bg-white border rounded-xl shadow-sm"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <FileIcon className="w-6 h-6 text-gray-500" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-medium text-gray-900 truncate">
                                                {file.name}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </span>
                                        </div>
                                    </div>
                                    {onRemove && (
                                        <button
                                            onClick={() => onRemove(file)}
                                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <div className="mt-4 text-center">
                            <span className="text-sm text-blue-600 hover:underline">
                                Click to upload another file
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
