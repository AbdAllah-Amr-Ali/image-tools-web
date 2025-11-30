"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2, X } from "lucide-react";
import { jsPDF } from "jspdf";

export default function PngToPdf() {
    const [files, setFiles] = useState<File[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = (newFiles: File[]) => {
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const convertToPdf = async () => {
        if (files.length === 0) return;
        setIsProcessing(true);

        try {
            const doc = new jsPDF();

            for (let i = 0; i < files.length; i++) {
                if (i > 0) doc.addPage();

                const imgData = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = (e) => resolve(e.target?.result as string);
                    reader.readAsDataURL(files[i]);
                });

                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = doc.internal.pageSize.getHeight();

                // Calculate aspect ratio to fit page
                const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height);
                const width = imgProps.width * ratio;
                const height = imgProps.height * ratio;
                const x = (pdfWidth - width) / 2;
                const y = (pdfHeight - height) / 2;

                doc.addImage(imgData, "PNG", x, y, width, height);
            }

            doc.save("converted-images.pdf");
        } catch (error) {
            console.error("Conversion failed:", error);
            alert("Failed to convert images to PDF.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        PNG to <span className="text-indigo-600">PDF</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert PNG images to a single PDF document.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <div className="mb-8">
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/png": [".png"] }}
                            files={files}
                            onRemove={() => { }} // Handled individually
                            title="Upload PNG Images"
                        />
                    </div>

                    {files.length > 0 && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {files.map((file, i) => (
                                    <div key={i} className="relative group border rounded-xl p-2 bg-gray-50">
                                        <div className="aspect-square flex items-center justify-center overflow-hidden rounded-lg bg-white mb-2">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <p className="text-xs truncate px-1">{file.name}</p>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                {isProcessing ? (
                                    <button disabled className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold opacity-75 cursor-not-allowed flex items-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Converting...
                                    </button>
                                ) : (
                                    <button
                                        onClick={convertToPdf}
                                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download PDF
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
