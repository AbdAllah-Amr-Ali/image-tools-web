"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, FileImage } from "lucide-react";

export default function PngToWebp() {
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
                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/webp", 0.9);
                link.download = file ? `${file.name.replace(/\.[^/.]+$/, "")}.webp` : "image.webp";
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
                        PNG to <span className="text-orange-600">WebP</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert PNG images to modern WebP format.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!imageSrc ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/png": [".png"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImageSrc(null);
                            }}
                            title="Upload PNG Image"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-[url('/checkerboard.svg')] bg-repeat p-4">
                                <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                                    backgroundSize: `20px 20px`,
                                    backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
                                }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    className="relative z-10 max-w-full max-h-[50vh] object-contain"
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
                                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download WebP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
