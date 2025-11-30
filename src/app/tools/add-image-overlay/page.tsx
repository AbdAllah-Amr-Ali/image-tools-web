"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";

export default function AddImageOverlay() {
    const [baseImage, setBaseImage] = useState<string | null>(null);
    const [overlayImage, setOverlayImage] = useState<string | null>(null);
    const [overlayPosition, setOverlayPosition] = useState({ x: 50, y: 50 });
    const [overlayScale, setOverlayScale] = useState(0.5);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleBaseDrop = (files: File[]) => {
        if (files.length > 0) setBaseImage(URL.createObjectURL(files[0]));
    };

    const handleOverlayDrop = (files: File[]) => {
        if (files.length > 0) setOverlayImage(URL.createObjectURL(files[0]));
    };

    useEffect(() => {
        if (!baseImage || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            if (overlayImage) {
                const overlay = new Image();
                overlay.onload = () => {
                    const w = overlay.width * overlayScale;
                    const h = overlay.height * overlayScale;
                    const x = (canvas.width - w) * (overlayPosition.x / 100);
                    const y = (canvas.height - h) * (overlayPosition.y / 100);
                    ctx.drawImage(overlay, x, y, w, h);
                };
                overlay.src = overlayImage;
            }
        };
        img.src = baseImage;
    }, [baseImage, overlayImage, overlayPosition, overlayScale]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
        link.download = "overlay-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Add Image <span className="text-indigo-600">Overlay</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Overlay an image onto another (e.g., watermark, logo).
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">1. Base Image</h3>
                            <Dropzone
                                onDrop={handleBaseDrop}
                                accept={{ "image/*": [] }}
                                files={[]}
                                onRemove={() => setBaseImage(null)}
                                title="Upload Base Image"
                            />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">2. Overlay Image</h3>
                            <Dropzone
                                onDrop={handleOverlayDrop}
                                accept={{ "image/*": [] }}
                                files={[]}
                                onRemove={() => setOverlayImage(null)}
                                title="Upload Overlay"
                            />
                        </div>
                    </div>

                    {baseImage && (
                        <div className="space-y-8">
                            {overlayImage && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position X ({overlayPosition.x}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={overlayPosition.x}
                                            onChange={(e) => setOverlayPosition(prev => ({ ...prev, x: Number(e.target.value) }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Position Y ({overlayPosition.y}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={overlayPosition.y}
                                            onChange={(e) => setOverlayPosition(prev => ({ ...prev, y: Number(e.target.value) }))}
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Scale ({overlayScale.toFixed(1)}x)</label>
                                        <input
                                            type="range"
                                            min="0.1"
                                            max="2"
                                            step="0.1"
                                            value={overlayScale}
                                            onChange={(e) => setOverlayScale(Number(e.target.value))}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="border rounded-xl overflow-hidden bg-gray-50 flex justify-center p-4">
                                <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={downloadImage}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Image
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
