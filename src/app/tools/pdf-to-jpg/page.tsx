"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, FileText, Loader2 } from "lucide-react";

export default function PdfToJpg() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setImages([]);
            setIsProcessing(true);
            try {
                // Dynamically import pdfjs-dist to avoid SSR issues
                const pdfjsLib = await import("pdfjs-dist");
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const arrayBuffer = await files[0].arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                const newImages: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2.0 }); // High quality
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };
                        // @ts-ignore
                        await page.render(renderContext).promise;
                        newImages.push(canvas.toDataURL("image/jpeg"));
                    }
                }
                setImages(newImages);
            } catch (error) {
                console.error("Error converting PDF:", error);
                alert("Failed to convert PDF. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const downloadImage = (src: string, index: number) => {
        const link = document.createElement("a");
        link.href = src;
        link.download = file ? `${file.name.replace(/\.[^/.]+$/, "")}-page-${index + 1}.jpg` : `page-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        PDF to <span className="text-red-600">JPG</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert PDF pages to high-quality JPG images.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!images.length && !isProcessing ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "application/pdf": [".pdf"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImages([]);
                            }}
                            title="Upload PDF to Convert"
                        />
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
                            <p className="text-lg font-medium">Converting PDF pages...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {images.map((src, index) => (
                                    <div key={index} className="space-y-3">
                                        <div className="relative aspect-[1/1.4] bg-gray-50 rounded-xl border overflow-hidden shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={src}
                                                alt={`Page ${index + 1}`}
                                                className="w-full h-full object-contain"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                                Page {index + 1}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => downloadImage(src, index)}
                                            className="w-full flex items-center justify-center gap-2 bg-white border hover:bg-gray-50 text-gray-900 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download JPG
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center pt-8 border-t">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImages([]);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Convert Another PDF
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
