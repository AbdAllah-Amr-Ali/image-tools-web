"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Sun, Contrast } from "lucide-react";

export default function BrightnessContrast() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
            setBrightness(100);
            setContrast(100);
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
                ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `edited-${file.name}` : "edited-image.jpg";
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
                        Adjust <span className="text-yellow-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Modify brightness and contrast levels.
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
                            title="Upload Image to Adjust"
                        />
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                            <Sun className="w-4 h-4 text-yellow-600" />
                                            Brightness: {brightness}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={brightness}
                                            onChange={(e) => setBrightness(Number(e.target.value))}
                                            className="w-full accent-yellow-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                            <Contrast className="w-4 h-4 text-gray-600" />
                                            Contrast: {contrast}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={contrast}
                                            onChange={(e) => setContrast(Number(e.target.value))}
                                            className="w-full accent-gray-600"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setBrightness(100);
                                            setContrast(100);
                                        }}
                                        className="text-sm text-blue-600 hover:underline w-full text-center"
                                    >
                                        Reset Values
                                    </button>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                        }}
                                        className="w-full py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={downloadImage}
                                        className="w-full bg-yellow-600 text-white py-3 rounded-xl font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-center bg-gray-50 rounded-xl border p-4 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{
                                        filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                                        maxHeight: "50vh"
                                    }}
                                    className="max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
