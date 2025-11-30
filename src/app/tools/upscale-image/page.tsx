"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";

export default function UpscaleImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [scale, setScale] = useState(2);
    const [isProcessing, setIsProcessing] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setImageSrc(URL.createObjectURL(files[0]));
        }
    };

    const processImage = () => {
        if (!imageSrc || !canvasRef.current) return;
        setIsProcessing(true);

        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current!;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const width = img.width * scale;
            const height = img.height * scale;

            canvas.width = width;
            canvas.height = height;

            // Use bicubic interpolation (browser default usually)
            // For better upscaling, we'd need a neural net (e.g. upscalerjs), but that's heavy.
            // We'll stick to high-quality canvas scaling for now as a "basic" upscaler.
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            setIsProcessing(false);
        };
        img.src = imageSrc;
    };

    useEffect(() => {
        if (imageSrc) {
            processImage();
        }
    }, [imageSrc, scale]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/png");
        link.download = file ? `upscaled-${file.name.replace(/\.[^/.]+$/, "")}.png` : "upscaled.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Upscale <span className="text-indigo-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Increase image resolution using high-quality interpolation.
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
                            title="Upload Image to Upscale"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Scale Factor:</span>
                                {[2, 4, 8].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setScale(s)}
                                        className={`px-4 py-2 rounded-lg border transition-colors ${scale === s
                                                ? "bg-indigo-600 text-white border-indigo-600"
                                                : "hover:bg-gray-50"
                                            }`}
                                    >
                                        {s}x
                                    </button>
                                ))}
                            </div>

                            <div className="relative max-w-full overflow-auto rounded-xl border bg-gray-50 p-4 flex items-center justify-center min-h-[300px]">
                                {isProcessing ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                                        <p>Processing...</p>
                                    </div>
                                ) : (
                                    <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Start Over
                                </button>
                                <button
                                    onClick={downloadImage}
                                    disabled={isProcessing}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Upscaled
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
