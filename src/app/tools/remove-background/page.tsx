"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";
import { removeBackground } from "@imgly/background-removal";

export default function RemoveBackground() {
    const [file, setFile] = useState<File | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState<string>("Initializing...");

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const src = URL.createObjectURL(files[0]);
            setOriginalImageSrc(src);
            setProcessedImageSrc(null);
            processImage(src);
        }
    };

    const processImage = async (src: string) => {
        setIsProcessing(true);
        setProgress("Loading AI models...");

        try {
            // @imgly/background-removal works entirely client-side
            const blob = await removeBackground(src, {
                progress: (key: string, current: number, total: number) => {
                    const percent = Math.round((current / total) * 100);
                    setProgress(`Processing: ${percent}%`);
                }
            });

            const url = URL.createObjectURL(blob);
            setProcessedImageSrc(url);
        } catch (error) {
            console.error("Background removal failed:", error);
            alert("Failed to remove background. Please try a different image.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = () => {
        if (processedImageSrc) {
            const link = document.createElement("a");
            link.href = processedImageSrc;
            link.download = file ? file.name.replace(/\.[^/.]+$/, "") + "-nobg.png" : "image-nobg.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Remove <span className="text-rose-600">Background</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Automatically remove image backgrounds using AI. 100% Free & Client-Side.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border">
                    {!originalImageSrc ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/*": [] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setOriginalImageSrc(null);
                                setProcessedImageSrc(null);
                            }}
                            title="Upload Image"
                            description="Drag & drop to remove background automatically"
                        />
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="text-center font-medium text-muted-foreground">Original</div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden border bg-gray-50 dark:bg-slate-800">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={originalImageSrc} alt="Original" className="object-contain w-full h-full" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-center font-medium text-muted-foreground">Result</div>
                                <div className="relative aspect-square rounded-2xl overflow-hidden border bg-[url('/checkerboard.svg')] bg-repeat flex items-center justify-center">
                                    {isProcessing ? (
                                        <div className="text-center p-6 bg-white/90 dark:bg-slate-900/90 rounded-xl backdrop-blur-sm shadow-lg">
                                            <Loader2 className="w-10 h-10 animate-spin text-rose-600 mx-auto mb-4" />
                                            <p className="font-medium text-lg">{progress}</p>
                                            <p className="text-sm text-muted-foreground mt-2">This runs in your browser.</p>
                                        </div>
                                    ) : processedImageSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={processedImageSrc} alt="Processed" className="relative z-10 object-contain w-full h-full" />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    )}

                    {processedImageSrc && !isProcessing && (
                        <div className="flex justify-center mt-8 gap-4">
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setOriginalImageSrc(null);
                                    setProcessedImageSrc(null);
                                }}
                                className="px-8 py-3 rounded-xl border hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Upload New
                            </button>
                            <button
                                onClick={downloadImage}
                                className="flex items-center gap-2 bg-rose-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-lg"
                            >
                                <Download className="w-5 h-5" />
                                Download HD Image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
