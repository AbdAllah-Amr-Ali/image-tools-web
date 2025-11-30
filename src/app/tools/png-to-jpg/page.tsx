"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function PngToJpg() {
    const [file, setFile] = useState<File | null>(null);
    const [convertedImage, setConvertedImage] = useState<string | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setConvertedImage(null);
        }
    };

    const convertImage = async () => {
        if (!file) return;
        setIsConverting(true);

        try {
            const img = new Image();
            img.src = URL.createObjectURL(file);

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                // Fill white background for JPG (since PNG can be transparent)
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.drawImage(img, 0, 0);
                const jpgUrl = canvas.toDataURL("image/jpeg", 0.9); // 0.9 quality
                setConvertedImage(jpgUrl);
            }
        } catch (error) {
            console.error("Conversion failed", error);
        } finally {
            setIsConverting(false);
        }
    };

    const downloadImage = () => {
        if (convertedImage) {
            const link = document.createElement("a");
            link.href = convertedImage;
            link.download = file ? file.name.replace(/\.[^/.]+$/, "") + ".jpg" : "converted.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        PNG to <span className="text-green-600">JPG</span> Converter
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert your PNG images to JPG format instantly. High quality and fast.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{ "image/png": [".png"] }}
                        files={file ? [file] : []}
                        onRemove={() => {
                            setFile(null);
                            setConvertedImage(null);
                        }}
                        title="Upload PNG Image"
                        description="Drag & drop a PNG file here, or click to select"
                    />

                    {file && !convertedImage && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={convertImage}
                                disabled={isConverting}
                                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isConverting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        Convert to JPG
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {convertedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-8 text-center"
                        >
                            <div className="p-4 bg-green-50 text-green-700 rounded-xl inline-block mb-6">
                                Conversion Successful!
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={downloadImage}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    Download JPG
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
