"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download } from "lucide-react";

export default function BlackAndWhite() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [threshold, setThreshold] = useState(128);
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
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const val = avg >= threshold ? 255 : 0;
                data[i] = val;     // R
                data[i + 1] = val; // G
                data[i + 2] = val; // B
            }

            ctx.putImageData(imageData, 0, 0);
        };
        img.src = imageSrc;
    }, [imageSrc, threshold]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
        link.download = "bw-image.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Black & <span className="text-indigo-600">White</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert images to pure black and white (thresholding).
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
                            <div className="w-full max-w-md">
                                <label className="block text-sm font-medium mb-2">Threshold ({threshold})</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="255"
                                    value={threshold}
                                    onChange={(e) => setThreshold(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            <div className="relative rounded-xl border bg-gray-50 p-4 flex items-center justify-center">
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
