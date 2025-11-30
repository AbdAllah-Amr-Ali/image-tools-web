"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function JpgToPng() {
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
            // Create an image element to load the JPG
            const img = new Image();
            img.src = URL.createObjectURL(file);

            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Draw to canvas and export as PNG
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const pngUrl = canvas.toDataURL("image/png");
                setConvertedImage(pngUrl);
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
            link.download = file ? file.name.replace(/\.[^/.]+$/, "") + ".png" : "converted.png";
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
                        JPG to <span className="text-blue-600">PNG</span> Converter
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert your JPG images to PNG format instantly. Free, fast, and secure.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{ "image/jpeg": [".jpg", ".jpeg"] }}
                        files={file ? [file] : []}
                        onRemove={() => {
                            setFile(null);
                            setConvertedImage(null);
                        }}
                        title="Upload JPG Image"
                        description="Drag & drop a JPG file here, or click to select"
                    />

                    {file && !convertedImage && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={convertImage}
                                disabled={isConverting}
                                className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isConverting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        Convert to PNG
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
                                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    Download PNG
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
