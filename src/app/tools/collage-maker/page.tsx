"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2, LayoutGrid, X } from "lucide-react";

export default function CollageMaker() {
    const [images, setImages] = useState<string[]>([]);
    const [layout, setLayout] = useState<"2x2" | "3x3" | "row" | "col">("2x2");
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = (files: File[]) => {
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const loadImages = async () => {
            const loadedImages = await Promise.all(
                images.map(src => new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.src = src;
                }))
            );

            // Determine canvas size and layout
            // Simple logic: fixed width, dynamic height based on layout
            const maxWidth = 1200;
            let canvasWidth = maxWidth;
            let canvasHeight = maxWidth; // Default square

            if (layout === "2x2") {
                const cols = 2;
                const rows = Math.ceil(loadedImages.length / cols);
                const cellWidth = maxWidth / cols;
                const cellHeight = cellWidth; // Square cells
                canvasHeight = rows * cellHeight;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                loadedImages.forEach((img, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const x = col * cellWidth;
                    const y = row * cellHeight;

                    // Draw image centered and covered in cell
                    const scale = Math.max(cellWidth / img.width, cellHeight / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    const ox = x + (cellWidth - w) / 2;
                    const oy = y + (cellHeight - h) / 2;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.clip();
                    ctx.drawImage(img, ox, oy, w, h);
                    ctx.restore();
                });
            } else if (layout === "3x3") {
                const cols = 3;
                const rows = Math.ceil(loadedImages.length / cols);
                const cellWidth = maxWidth / cols;
                const cellHeight = cellWidth;
                canvasHeight = rows * cellHeight;
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;

                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                loadedImages.forEach((img, i) => {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    const x = col * cellWidth;
                    const y = row * cellHeight;

                    const scale = Math.max(cellWidth / img.width, cellHeight / img.height);
                    const w = img.width * scale;
                    const h = img.height * scale;
                    const ox = x + (cellWidth - w) / 2;
                    const oy = y + (cellHeight - h) / 2;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(x, y, cellWidth, cellHeight);
                    ctx.clip();
                    ctx.drawImage(img, ox, oy, w, h);
                    ctx.restore();
                });
            } else if (layout === "row") {
                // All in one row
                const totalWidth = loadedImages.reduce((sum, img) => sum + img.width, 0);
                const maxHeight = Math.max(...loadedImages.map(img => img.height));
                canvas.width = totalWidth;
                canvas.height = maxHeight;

                let x = 0;
                loadedImages.forEach(img => {
                    ctx.drawImage(img, x, 0);
                    x += img.width;
                });
            } else if (layout === "col") {
                // All in one column
                const maxWidthImg = Math.max(...loadedImages.map(img => img.width));
                const totalHeight = loadedImages.reduce((sum, img) => sum + img.height, 0);
                canvas.width = maxWidthImg;
                canvas.height = totalHeight;

                let y = 0;
                loadedImages.forEach(img => {
                    ctx.drawImage(img, 0, y);
                    y += img.height;
                });
            }
        };

        loadImages();
    }, [images, layout]);

    const downloadCollage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
        link.download = "collage.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Collage <span className="text-indigo-600">Maker</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create beautiful photo collages online.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <div className="mb-8">
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/*": [] }}
                            files={[]}
                            onRemove={() => { }}
                            title="Add Images to Collage"
                        />
                    </div>

                    {images.length > 0 && (
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={() => setLayout("2x2")}
                                    className={`px-4 py-2 rounded-lg border ${layout === "2x2" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    Grid (2 Columns)
                                </button>
                                <button
                                    onClick={() => setLayout("3x3")}
                                    className={`px-4 py-2 rounded-lg border ${layout === "3x3" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    Grid (3 Columns)
                                </button>
                                <button
                                    onClick={() => setLayout("row")}
                                    className={`px-4 py-2 rounded-lg border ${layout === "row" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    Horizontal Row
                                </button>
                                <button
                                    onClick={() => setLayout("col")}
                                    className={`px-4 py-2 rounded-lg border ${layout === "col" ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "hover:bg-gray-50"}`}
                                >
                                    Vertical Column
                                </button>
                            </div>

                            <div className="flex flex-wrap gap-2 justify-center">
                                {images.map((src, i) => (
                                    <div key={i} className="relative w-20 h-20 border rounded overflow-hidden group">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="border rounded-xl overflow-hidden bg-gray-50 flex justify-center p-4">
                                <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={downloadCollage}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Collage
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
