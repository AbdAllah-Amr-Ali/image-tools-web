"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download } from "lucide-react";

export default function MakeRoundImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
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
            // Make canvas square based on smallest dimension
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;

            // Calculate crop to center
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            // Draw circle clip
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw image
            ctx.drawImage(img, sx, sy, size, size, 0, 0, size, size);
        };
        img.src = imageSrc;
    }, [imageSrc]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/png"); // Must be PNG for transparency
        link.download = "round-image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Make <span className="text-indigo-600">Round Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Crop your image into a perfect circle with a transparent background.
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
                            title="Upload Image"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative rounded-xl border bg-[url('/transparent-bg.png')] bg-repeat p-4 flex items-center justify-center">
                                <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
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
