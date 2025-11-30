"use client";

import { useState, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Grid } from "lucide-react";

export default function PixelateImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [blockSize, setBlockSize] = useState(10);
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
    }, [imageSrc, blockSize]);

    const renderPreview = () => {
        if (!imageSrc) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Disable smoothing for pixelation effect
                ctx.imageSmoothingEnabled = false;

                // Calculate scaled dimensions
                const w = Math.ceil(img.width / blockSize);
                const h = Math.ceil(img.height / blockSize);

                // Draw small image
                ctx.drawImage(img, 0, 0, w, h);

                // Draw back to full size
                ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);

                setPreviewSrc(canvas.toDataURL());
            }
        };
        img.src = imageSrc;
    };

    const downloadImage = () => {
        if (!previewSrc) return;
        const link = document.createElement("a");
        link.href = previewSrc;
        link.download = file ? `pixelated-${file.name}` : "pixelated-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Pixelate <span className="text-green-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Apply a pixelation effect to your images.
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
                                        <Grid className="w-5 h-5 text-green-600" />
                                        Pixel Size
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Block Size: {blockSize}px</label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={blockSize}
                                            onChange={(e) => setBlockSize(Number(e.target.value))}
                                            className="w-full accent-green-600"
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
                                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
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
                                    style={{ imageRendering: 'pixelated' }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
