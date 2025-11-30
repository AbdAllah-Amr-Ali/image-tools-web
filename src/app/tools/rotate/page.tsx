"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, RotateCw, RotateCcw, RefreshCcw } from "lucide-react";

export default function RotateImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [rotation, setRotation] = useState(0);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
            setRotation(0);
        }
    };

    const rotate = (angle: number) => {
        setRotation((prev) => (prev + angle) % 360);
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.onload = () => {
            const rads = (rotation * Math.PI) / 180;
            const sin = Math.abs(Math.sin(rads));
            const cos = Math.abs(Math.cos(rads));

            canvas.width = img.width * cos + img.height * sin;
            canvas.height = img.width * sin + img.height * cos;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(rads);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `rotated-${file.name}` : "rotated-image.jpg";
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
                        Rotate <span className="text-orange-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Rotate your images to the perfect angle.
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
                            title="Upload Image to Rotate"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => rotate(-90)}
                                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    title="Rotate Left"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={() => rotate(90)}
                                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                    title="Rotate Right"
                                >
                                    <RotateCw className="w-6 h-6" />
                                </button>
                                <div className="w-px bg-gray-200 mx-2" />
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    value={rotation}
                                    onChange={(e) => setRotation(Number(e.target.value))}
                                    className="w-48 accent-orange-600"
                                />
                                <span className="min-w-[3ch] font-mono">{rotation}°</span>
                            </div>

                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-gray-50 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{
                                        transform: `rotate(${rotation}deg)`,
                                        transition: "transform 0.3s ease",
                                        maxHeight: "50vh"
                                    }}
                                    className="max-w-full object-contain"
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
                                    className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Rotated
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
