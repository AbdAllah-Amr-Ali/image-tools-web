"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Layers } from "lucide-react";

export default function CombineImages() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
    const [combinedSrc, setCombinedSrc] = useState<string | null>(null);

    const handleDrop = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviews(prev => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const combine = async () => {
        if (previews.length < 2) return;

        const images = await Promise.all(previews.map(src => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = src;
            });
        }));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        if (direction === "horizontal") {
            const totalWidth = images.reduce((sum, img) => sum + img.width, 0);
            const maxHeight = Math.max(...images.map(img => img.height));
            canvas.width = totalWidth;
            canvas.height = maxHeight;

            let currentX = 0;
            images.forEach(img => {
                ctx.drawImage(img, currentX, 0);
                currentX += img.width;
            });
        } else {
            const maxWidth = Math.max(...images.map(img => img.width));
            const totalHeight = images.reduce((sum, img) => sum + img.height, 0);
            canvas.width = maxWidth;
            canvas.height = totalHeight;

            let currentY = 0;
            images.forEach(img => {
                ctx.drawImage(img, 0, currentY);
                currentY += img.height;
            });
        }

        setCombinedSrc(canvas.toDataURL("image/jpeg"));
    };

    const downloadImage = () => {
        if (!combinedSrc) return;
        const link = document.createElement("a");
        link.href = combinedSrc;
        link.download = "combined-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Combine <span className="text-indigo-600">Images</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Merge multiple images into one.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{ "image/*": [] }}
                        files={files}
                        onRemove={() => {
                            setFiles([]);
                            setPreviews([]);
                            setCombinedSrc(null);
                        }}
                        title="Upload Images"
                        description="Drag & drop multiple images"
                    />

                    {previews.length > 0 && (
                        <div className="mt-8 space-y-8">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3 space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-2xl border space-y-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-indigo-600" />
                                            Settings
                                        </h3>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setDirection("horizontal")}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "horizontal" ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50"}`}
                                            >
                                                Horizontal
                                            </button>
                                            <button
                                                onClick={() => setDirection("vertical")}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${direction === "vertical" ? "bg-indigo-600 text-white" : "bg-white border hover:bg-gray-50"}`}
                                            >
                                                Vertical
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setFiles([]);
                                                setPreviews([]);
                                                setCombinedSrc(null);
                                            }}
                                            className="flex-1 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                        >
                                            Clear All
                                        </button>
                                        <button
                                            onClick={combine}
                                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                                        >
                                            Combine
                                        </button>
                                    </div>
                                </div>

                                <div className="md:w-2/3">
                                    <h3 className="font-semibold mb-2">Preview</h3>
                                    <div className="bg-gray-50 rounded-xl border p-4 flex items-center justify-center overflow-auto max-h-[500px]">
                                        {combinedSrc ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={combinedSrc} alt="Combined" className="max-w-full" />
                                        ) : (
                                            <div className="flex gap-2 overflow-auto">
                                                {previews.map((src, i) => (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img key={i} src={src} alt={`Input ${i}`} className="h-20 w-20 object-cover rounded border" />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    {combinedSrc && (
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={downloadImage}
                                                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                <Download className="w-5 h-5" />
                                                Download Combined
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
