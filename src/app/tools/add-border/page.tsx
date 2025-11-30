"use client";

import { useState, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Square } from "lucide-react";

export default function AddBorder() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [color, setColor] = useState("#000000");
    const [width, setWidth] = useState(20);
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    useEffect(() => {
        if (imageSrc) {
            renderPreview();
        }
    }, [imageSrc, color, width]);

    const renderPreview = () => {
        if (!imageSrc) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            // Add border width to canvas size
            canvas.width = img.width + (width * 2);
            canvas.height = img.height + (width * 2);
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Fill background with border color
                ctx.fillStyle = color;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw image centered
                ctx.drawImage(img, width, width);

                setPreviewSrc(canvas.toDataURL());
            }
        };
        img.src = imageSrc;
    };

    const downloadImage = () => {
        if (!previewSrc) return;
        const link = document.createElement("a");
        link.href = previewSrc;
        link.download = file ? `border-${file.name}` : "image-with-border.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Add <span className="text-gray-800">Border</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Add a colored border around your image.
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
                                setPreviewSrc(null);
                            }}
                            title="Upload Image"
                        />
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-1 space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Square className="w-5 h-5 text-gray-800" />
                                        Border Settings
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Color</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-10 h-10 rounded cursor-pointer border"
                                            />
                                            <input
                                                type="text"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="flex-1 px-3 py-2 border rounded-lg uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Width (px): {width}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            value={width}
                                            onChange={(e) => setWidth(Number(e.target.value))}
                                            className="w-full accent-gray-800"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                            setPreviewSrc(null);
                                        }}
                                        className="flex-1 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={downloadImage}
                                        className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex items-center justify-center bg-gray-50 rounded-xl border p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewSrc || imageSrc}
                                    alt="Preview"
                                    className="max-w-full max-h-[500px] object-contain shadow-lg"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
