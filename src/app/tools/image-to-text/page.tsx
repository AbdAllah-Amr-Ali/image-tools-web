"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Copy, Loader2, RefreshCw } from "lucide-react";
import Tesseract from "tesseract.js";

export default function ImageToText() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const url = URL.createObjectURL(files[0]);
            setImageSrc(url);
            setIsProcessing(true);
            setProgress(0);
            setText("");

            try {
                const result = await Tesseract.recognize(
                    files[0],
                    'eng',
                    {
                        logger: m => {
                            if (m.status === 'recognizing text') {
                                setProgress(Math.round(m.progress * 100));
                            }
                        }
                    }
                );
                setText(result.data.text);
            } catch (error) {
                console.error("OCR failed:", error);
                alert("Failed to extract text from image.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        alert("Text copied to clipboard!");
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Image to <span className="text-indigo-600">Text</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Extract text from images using OCR.
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
                                setText("");
                            }}
                            title="Upload Image for OCR"
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg">Original Image</h3>
                                <div className="relative rounded-xl border bg-gray-50 p-4 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageSrc}
                                        alt="Source"
                                        className="max-w-full max-h-[50vh] object-contain"
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                        setText("");
                                    }}
                                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Start Over
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-lg">Extracted Text</h3>
                                <div className="flex-1 min-h-[300px] relative rounded-xl border bg-gray-50 p-4">
                                    {isProcessing ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl">
                                            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
                                            <p className="text-sm font-medium">Processing... {progress}%</p>
                                        </div>
                                    ) : (
                                        <textarea
                                            value={text}
                                            readOnly
                                            className="w-full h-full bg-transparent border-none resize-none focus:ring-0 p-0 text-gray-700"
                                            placeholder="Extracted text will appear here..."
                                        />
                                    )}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    disabled={!text}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Copy className="w-5 h-5" />
                                    Copy Text
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
