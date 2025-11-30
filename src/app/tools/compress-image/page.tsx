"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Minimize2 } from "lucide-react";

export default function CompressImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [quality, setQuality] = useState(80);
    const [compressedSize, setCompressedSize] = useState<number | null>(null);
    const [compressedSrc, setCompressedSrc] = useState<string | null>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setCompressedSrc(null);
                setCompressedSize(null);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const compress = () => {
        if (!imageSrc) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
                setCompressedSrc(dataUrl);

                // Calculate size
                const head = 'data:image/jpeg;base64,';
                const size = Math.round((dataUrl.length - head.length) * 3 / 4);
                setCompressedSize(size);
            }
        };
        img.src = imageSrc;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const downloadImage = () => {
        if (!compressedSrc) return;
        const link = document.createElement("a");
        link.href = compressedSrc;
        link.download = file ? `compressed-${file.name.replace(/\.[^/.]+$/, "")}.jpg` : "compressed.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Compress <span className="text-blue-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Reduce image file size while maintaining quality.
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
                                setCompressedSrc(null);
                            }}
                            title="Upload Image to Compress"
                        />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 rounded-2xl border space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <Minimize2 className="w-5 h-5 text-blue-600" />
                                        Compression Settings
                                    </h3>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Quality: {quality}%
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            value={quality}
                                            onChange={(e) => setQuality(Number(e.target.value))}
                                            className="w-full accent-blue-600"
                                        />
                                    </div>

                                    <div className="flex justify-between text-sm pt-4 border-t">
                                        <div>
                                            <span className="text-muted-foreground">Original:</span>
                                            <div className="font-medium">{file ? formatSize(file.size) : "Unknown"}</div>
                                        </div>
                                        {compressedSize !== null && (
                                            <div className="text-right">
                                                <span className="text-muted-foreground">Compressed:</span>
                                                <div className="font-medium text-green-600">{formatSize(compressedSize)}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                            setCompressedSrc(null);
                                        }}
                                        className="flex-1 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={compressedSrc ? downloadImage : compress}
                                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {compressedSrc ? (
                                            <>
                                                <Download className="w-4 h-4" />
                                                Download
                                            </>
                                        ) : (
                                            "Compress Now"
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-center bg-gray-50 rounded-xl border p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={compressedSrc || imageSrc}
                                    alt="Preview"
                                    className="max-w-full max-h-[400px] object-contain"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
