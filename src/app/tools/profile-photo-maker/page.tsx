"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download } from "lucide-react";

export default function ProfilePhotoMaker() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [borderColor, setBorderColor] = useState("#4F46E5");
    const [borderWidth, setBorderWidth] = useState(20);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setImageSrc(URL.createObjectURL(files[0]));
        }
    };

    useEffect(() => {
        if (!imageSrc || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            // Draw circle clip
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw image
            ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);

            // Draw border
            if (borderWidth > 0) {
                ctx.beginPath();
                ctx.arc(size / 2, size / 2, size / 2 - borderWidth / 2, 0, Math.PI * 2);
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = borderWidth;
                ctx.stroke();
            }
        };
        img.src = imageSrc;
    }, [imageSrc, borderColor, borderWidth]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/png");
        link.download = "profile-photo.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Profile Photo <span className="text-indigo-600">Maker</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create a professional profile picture with a custom border.
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
                            title="Upload Photo"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Border Color</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {["#4F46E5", "#EF4444", "#10B981", "#F59E0B", "#3B82F6", "#EC4899", "#FFFFFF", "#000000"].map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setBorderColor(color)}
                                                className={`w-8 h-8 rounded-full border-2 ${borderColor === color ? "border-gray-400 scale-110" : "border-transparent"}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        <input
                                            type="color"
                                            value={borderColor}
                                            onChange={(e) => setBorderColor(e.target.value)}
                                            className="w-8 h-8 rounded-full overflow-hidden cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Border Width</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={borderWidth}
                                        onChange={(e) => setBorderWidth(Number(e.target.value))}
                                        className="w-full"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors w-full"
                                >
                                    Start Over
                                </button>
                            </div>

                            <div className="flex flex-col gap-4 items-center">
                                <div className="relative rounded-xl border bg-[url('/transparent-bg.png')] bg-repeat p-4 flex items-center justify-center">
                                    <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                                </div>
                                <button
                                    onClick={downloadImage}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download PNG
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
