"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";
import JSZip from "jszip";

export default function PdfToPng() {
    const [file, setFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setIsProcessing(true);
            try {
                // Dynamically import pdfjs-dist
                const pdfjsLib = await import("pdfjs-dist");
                pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

                const arrayBuffer = await files[0].arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

                const newImages: string[] = [];

                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 }); // High quality
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    if (context) {
                        // @ts-ignore
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        newImages.push(canvas.toDataURL("image/png"));
                    }
                }

                setImages(newImages);
            } catch (error) {
                console.error("PDF conversion failed:", error);
                alert("Failed to convert PDF.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const downloadImages = async () => {
        if (images.length === 0) return;

        if (images.length === 1) {
            const link = document.createElement("a");
            link.href = images[0];
            link.download = file ? `${file.name.replace(/\.[^/.]+$/, "")}.png` : "page.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const zip = new JSZip();
            images.forEach((img, i) => {
                const data = img.replace(/^data:image\/\w+;base64,/, "");
                zip.file(`page-${i + 1}.png`, data, { base64: true });
            });
            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "converted-images.zip";
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
                        PDF to <span className="text-indigo-600">PNG</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert PDF pages to PNG images.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {images.length === 0 && !isProcessing ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "application/pdf": [".pdf"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImages([]);
                            }}
                            title="Upload PDF Document"
                        />
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                            <p className="text-lg font-medium">Converting PDF...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                                {images.map((src, i) => (
                                    <div key={i} className="relative rounded-xl border bg-gray-50 p-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={`Page ${i + 1}`}
                                            className="w-full h-auto object-contain"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                            Page {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImages([]);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Convert Another
                                </button>
                                <button
                                    onClick={downloadImages}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download {images.length > 1 ? "ZIP" : "PNG"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
