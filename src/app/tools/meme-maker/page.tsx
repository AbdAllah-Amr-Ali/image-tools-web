"use client";

import { useState, useRef, useEffect } from "react";
import Dropzone from "@/components/Dropzone";
import { Download } from "lucide-react";

export default function MemeMaker() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [topText, setTopText] = useState("");
    const [bottomText, setBottomText] = useState("");
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

            // Text settings
            const fontSize = Math.floor(canvas.width / 10);
            ctx.font = `900 ${fontSize}px Impact, sans-serif`;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = fontSize / 15;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            // Draw Top Text
            if (topText) {
                ctx.strokeText(topText.toUpperCase(), canvas.width / 2, fontSize / 2);
                ctx.fillText(topText.toUpperCase(), canvas.width / 2, fontSize / 2);
            }

            // Draw Bottom Text
            if (bottomText) {
                ctx.textBaseline = "bottom";
                ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
                ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - fontSize / 2);
            }
        };
        img.src = imageSrc;
    }, [imageSrc, topText, bottomText]);

    const downloadImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
        link.download = "meme.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Meme <span className="text-indigo-600">Maker</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create memes with custom text.
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
                            title="Upload Image for Meme"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Top Text</label>
                                        <input
                                            type="text"
                                            value={topText}
                                            onChange={(e) => setTopText(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="TOP TEXT"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Bottom Text</label>
                                        <input
                                            type="text"
                                            value={bottomText}
                                            onChange={(e) => setBottomText(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                                            placeholder="BOTTOM TEXT"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                        setTopText("");
                                        setBottomText("");
                                    }}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    Start Over
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="relative rounded-xl border bg-gray-50 p-4 flex items-center justify-center">
                                    <canvas ref={canvasRef} className="max-w-full h-auto shadow-lg" />
                                </div>
                                <button
                                    onClick={downloadImage}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Meme
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
