"use client";

import { useState, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Type } from "lucide-react";

export default function AddText() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState("Your Text Here");
    const [color, setColor] = useState("#ffffff");
    const [size, setSize] = useState(40);
    const [x, setX] = useState(50);
    const [y, setY] = useState(50);
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
    }, [imageSrc, text, color, size, x, y]);

    const renderPreview = () => {
        if (!imageSrc) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);

                ctx.font = `${size}px Arial`;
                ctx.fillStyle = color;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                // Calculate position based on percentage
                const posX = (x / 100) * canvas.width;
                const posY = (y / 100) * canvas.height;

                ctx.fillText(text, posX, posY);
                setPreviewSrc(canvas.toDataURL());
            }
        };
        img.src = imageSrc;
    };

    const downloadImage = () => {
        if (!previewSrc) return;
        const link = document.createElement("a");
        link.href = previewSrc;
        link.download = file ? `text-${file.name}` : "image-with-text.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Add <span className="text-pink-600">Text</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Add custom text overlays to your images.
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
                                        <Type className="w-5 h-5 text-pink-600" />
                                        Text Settings
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Text Content</label>
                                        <input
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Color</label>
                                            <input
                                                type="color"
                                                value={color}
                                                onChange={(e) => setColor(e.target.value)}
                                                className="w-full h-10 rounded cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Size</label>
                                            <input
                                                type="number"
                                                value={size}
                                                onChange={(e) => setSize(Number(e.target.value))}
                                                className="w-full px-3 py-2 border rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position X ({x}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={x}
                                            onChange={(e) => setX(Number(e.target.value))}
                                            className="w-full accent-pink-600"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position Y ({y}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={y}
                                            onChange={(e) => setY(Number(e.target.value))}
                                            className="w-full accent-pink-600"
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
                                        className="flex-1 bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
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
                                    className="max-w-full max-h-[500px] object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
