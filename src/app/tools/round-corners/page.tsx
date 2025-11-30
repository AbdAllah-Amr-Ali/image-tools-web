"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Square, Circle } from "lucide-react";

export default function RoundCorners() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [radius, setRadius] = useState(20);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
            setRadius(20);
        }
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                // Scale radius relative to image size
                const scale = Math.min(img.width, img.height) / 500;
                const r = radius * scale;

                ctx.beginPath();
                ctx.moveTo(r, 0);
                ctx.lineTo(img.width - r, 0);
                ctx.quadraticCurveTo(img.width, 0, img.width, r);
                ctx.lineTo(img.width, img.height - r);
                ctx.quadraticCurveTo(img.width, img.height, img.width - r, img.height);
                ctx.lineTo(r, img.height);
                ctx.quadraticCurveTo(0, img.height, 0, img.height - r);
                ctx.lineTo(0, r);
                ctx.quadraticCurveTo(0, 0, r, 0);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL("image/png"); // PNG for transparency
                link.download = file ? `rounded-${file.name.replace(/\.[^/.]+$/, "")}.png` : "rounded-image.png";
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
                        Round <span className="text-teal-600">Corners</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Add rounded corners to your images.
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
                            title="Upload Image to Round"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full max-w-md p-6 bg-gray-50 rounded-2xl border">
                                <label className="block text-sm font-medium mb-4 flex items-center gap-2">
                                    {radius === 100 ? <Circle className="w-4 h-4 text-teal-600" /> : <Square className="w-4 h-4 text-teal-600" />}
                                    Corner Radius: {radius}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    className="w-full accent-teal-600"
                                />
                            </div>

                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-[url('/checkerboard.svg')] bg-repeat p-4">
                                <div className="absolute inset-0 opacity-20" style={{
                                    backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                                    backgroundSize: `20px 20px`,
                                    backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`
                                }} />
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{
                                        borderRadius: `${radius}px`, // Visual approximation
                                        transition: "border-radius 0.1s ease",
                                        maxHeight: "50vh"
                                    }}
                                    className="relative z-10 max-w-full object-contain"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-teal-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Rounded
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
