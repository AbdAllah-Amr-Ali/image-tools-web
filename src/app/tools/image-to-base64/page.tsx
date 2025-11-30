"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Copy, Check, Code } from "lucide-react";

export default function ImageToBase64() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [base64String, setBase64String] = useState("");
    const [copied, setCopied] = useState(false);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImageSrc(result);
                setBase64String(result);
            };
            reader.readAsDataURL(files[0]);
            setCopied(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(base64String);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Image to <span className="text-pink-600">Base64</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert your images to Base64 strings for embedding.
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
                                setBase64String("");
                            }}
                            title="Upload Image to Convert"
                        />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Code className="w-5 h-5 text-pink-600" />
                                    Base64 Output
                                </h3>
                                <div className="relative">
                                    <textarea
                                        readOnly
                                        value={base64String}
                                        className="w-full h-[300px] p-4 rounded-xl border bg-gray-50 font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className="absolute top-4 right-4 p-2 bg-white rounded-lg border shadow-sm hover:bg-gray-50 transition-colors"
                                        title="Copy to Clipboard"
                                    >
                                        {copied ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                            setBase64String("");
                                        }}
                                        className="w-full py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Convert Another
                                    </button>
                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? "Copied!" : "Copy String"}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h3 className="font-semibold text-center">Preview</h3>
                                <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border p-4 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageSrc}
                                        alt="Preview"
                                        className="max-w-full max-h-[300px] object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
