"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, ArrowRight, Scaling } from "lucide-react";
import { motion } from "framer-motion";

export default function ResizeImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [maintainAspect, setMaintainAspect] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                const src = e.target?.result as string;
                setImageSrc(src);
                const img = new Image();
                img.onload = () => {
                    setWidth(img.width);
                    setHeight(img.height);
                    setOriginalDimensions({ width: img.width, height: img.height });
                    setAspectRatio(img.width / img.height);
                };
                img.src = src;
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = Number(e.target.value);
        setWidth(newWidth);
        if (maintainAspect) {
            setHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = Number(e.target.value);
        setHeight(newHeight);
        if (maintainAspect) {
            setWidth(Math.round(newHeight * aspectRatio));
        }
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            if (ctx) {
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, width, height);
                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `resized-${file.name}` : "resized-image.jpg";
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
                        Resize <span className="text-blue-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Resize your images to exact pixel dimensions.
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
                            title="Upload Image to Resize"
                        />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Scaling className="w-5 h-5 text-blue-600" />
                                        Dimensions
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Width (px)</label>
                                            <input
                                                type="number"
                                                value={width}
                                                onChange={handleWidthChange}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Height (px)</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={handleHeightChange}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="aspect"
                                            checked={maintainAspect}
                                            onChange={(e) => setMaintainAspect(e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="aspect" className="text-sm">Maintain aspect ratio</label>
                                    </div>

                                    <div className="text-sm text-muted-foreground pt-2 border-t">
                                        Original: {originalDimensions.width} x {originalDimensions.height}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                        }}
                                        className="flex-1 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={downloadImage}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-center bg-gray-50 rounded-xl border p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    className="max-w-full max-h-[400px] object-contain"
                                    style={{
                                        aspectRatio: `${width}/${height}`
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
