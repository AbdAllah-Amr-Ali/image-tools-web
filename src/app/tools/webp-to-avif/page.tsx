"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";

export default function WebpToAvif() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setIsProcessing(true);
            try {
                const url = URL.createObjectURL(files[0]);
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL("image/avif", 0.9);
                        if (dataUrl.startsWith("data:image/avif")) {
                            setImageSrc(dataUrl);
                        } else {
                            alert("Your browser does not support AVIF conversion.");
                            setImageSrc(null);
                        }
                    }
                    URL.revokeObjectURL(url);
                    setIsProcessing(false);
                };
                img.src = url;
            } catch (error) {
                console.error("AVIF conversion failed:", error);
                alert("Failed to convert to AVIF.");
                setIsProcessing(false);
            }
        }
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const link = document.createElement("a");
        link.href = imageSrc;
        link.download = file ? `${file.name.replace(/\.[^/.]+$/, "")}.avif` : "image.avif";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        WebP to <span className="text-indigo-600">AVIF</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert WebP images to AVIF format.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!imageSrc && !isProcessing ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/webp": [".webp"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImageSrc(null);
                            }}
                            title="Upload WebP Image"
                        />
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                            <p className="text-lg font-medium">Converting to AVIF...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-gray-50 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc!}
                                    alt="Preview"
                                    className="max-w-full max-h-[50vh] object-contain"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Convert Another
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download AVIF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
