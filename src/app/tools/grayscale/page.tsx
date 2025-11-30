"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Palette } from "lucide-react";

export default function GrayscaleImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
        }
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.filter = "grayscale(100%)";
                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `grayscale-${file.name}` : "grayscale-image.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        img.src = imageSrc;
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Grayscale <span className="text-gray-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert your images to black and white instantly.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!imageSrc ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/*": [] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImageSrc(null);
                            }}
                            title="Upload Image to Convert"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="grid md:grid-cols-2 gap-8 w-full">
                                <div className="space-y-2">
                                    <h3 className="text-center font-medium text-muted-foreground">Original</h3>
                                    <div className="relative rounded-xl overflow-hidden border bg-gray-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imageSrc}
                                            alt="Original"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-center font-medium text-muted-foreground">Grayscale</h3>
                                    <div className="relative rounded-xl overflow-hidden border bg-gray-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={imageSrc}
                                            alt="Grayscale"
                                            className="w-full h-auto object-contain grayscale"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Grayscale
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
