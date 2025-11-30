"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, ArrowRight, Droplet, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function ColorRemover() {
    const [file, setFile] = useState<File | null>(null);
    const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
    const [processedImageSrc, setProcessedImageSrc] = useState<string | null>(null);
    const [targetColor, setTargetColor] = useState("#ffffff");
    const [tolerance, setTolerance] = useState(20);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setOriginalImageSrc(e.target?.result as string);
                setProcessedImageSrc(null);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const processImage = () => {
        if (!originalImageSrc) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = originalImageSrc;
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const targetRgb = hexToRgb(targetColor);

            if (!targetRgb) return;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                const distance = Math.sqrt(
                    Math.pow(r - targetRgb.r, 2) +
                    Math.pow(g - targetRgb.g, 2) +
                    Math.pow(b - targetRgb.b, 2)
                );

                // If color is within tolerance, make it transparent
                // Tolerance is 0-100, mapped to distance 0-441 (max distance in RGB cube)
                const maxDist = 441;
                const threshold = (tolerance / 100) * maxDist;

                if (distance <= threshold) {
                    data[i + 3] = 0; // Alpha to 0
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setProcessedImageSrc(canvas.toDataURL("image/png"));
        };
    };

    // Auto-process when controls change
    useEffect(() => {
        if (originalImageSrc) {
            processImage();
        }
    }, [originalImageSrc, targetColor, tolerance]);

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
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Color <span className="text-purple-600">Remover</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Remove specific colors from your images instantly.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!originalImageSrc ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setOriginalImageSrc(null);
                                setProcessedImageSrc(null);
                            }}
                            title="Upload Image"
                            description="Drag & drop an image to remove color"
                        />
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Controls */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <RefreshCw className="w-5 h-5 text-purple-600" />
                                        Settings
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Target Color</label>
                                            <div className="flex gap-3">
                                                <input
                                                    type="color"
                                                    value={targetColor}
                                                    onChange={(e) => setTargetColor(e.target.value)}
                                                    className="h-10 w-20 rounded cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={targetColor}
                                                    onChange={(e) => setTargetColor(e.target.value)}
                                                    className="flex-1 px-3 py-2 border rounded-lg text-sm uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Tolerance: {tolerance}%
                                            </label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={tolerance}
                                                onChange={(e) => setTolerance(Number(e.target.value))}
                                                className="w-full accent-purple-600"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Higher tolerance removes more similar colors.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setOriginalImageSrc(null);
                                        setProcessedImageSrc(null);
                                    }}
                                    className="w-full py-3 rounded-xl border hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Upload New Image
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-center text-muted-foreground">Original</div>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border bg-gray-50">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={originalImageSrc}
                                                alt="Original"
                                                className="object-contain w-full h-full"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-center text-muted-foreground">Result</div>
                                        <div className="relative aspect-square rounded-xl overflow-hidden border bg-[url('/checkerboard.svg')] bg-repeat">
                                            <div className="absolute inset-0 opacity-20" style={{
                                                backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                                                backgroundSize: `20px 20px`,
                                                backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
                                            }} />
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            {processedImageSrc && (
                                                <img
                                                    src={processedImageSrc}
                                                    alt="Processed"
                                                    className="relative z-10 object-contain w-full h-full"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {processedImageSrc && (
                                    <div className="flex justify-center pt-4">
                                        <button
                                            onClick={downloadImage}
                                            className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        >
                                            <Download className="w-5 h-5" />
                                            Download Result
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
