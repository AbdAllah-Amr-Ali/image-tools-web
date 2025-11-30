"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Droplets } from "lucide-react";

export default function BlurImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [blurAmount, setBlurAmount] = useState(5);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
            setBlurAmount(5);
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
                // Scale blur amount relative to image size to make it consistent
                const scale = Math.max(img.width, img.height) / 1000;
                ctx.filter = `blur(${blurAmount * scale}px)`;
                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `blurred-${file.name}` : "blurred-image.jpg";
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
                        Blur <span className="text-cyan-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Add blur effect to your images.
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
                            title="Upload Image to Blur"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full max-w-md p-6 bg-gray-50 rounded-2xl border">
                                <label className="block text-sm font-medium mb-4 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-cyan-600" />
                                    Blur Intensity: {blurAmount}px
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={blurAmount}
                                    onChange={(e) => setBlurAmount(Number(e.target.value))}
                                    className="w-full accent-cyan-600"
                                />
                            </div>

                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-gray-50 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{
                                        filter: `blur(${blurAmount}px)`,
                                        transition: "filter 0.1s ease",
                                        maxHeight: "50vh"
                                    }}
                                    className="max-w-full object-contain"
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
                                    Cancel
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-cyan-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Blurred
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
