"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, FileImage } from "lucide-react";
import { jsPDF } from "jspdf";

export default function JpgToPdf() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDrop = (newFiles: File[]) => {
        if (newFiles.length > 0) {
            const updatedFiles = [...files, ...newFiles];
            setFiles(updatedFiles);

            // Generate previews
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviews(prev => [...prev, e.target?.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const generatePdf = async () => {
        if (files.length === 0) return;
        setIsGenerating(true);

        try {
            const doc = new jsPDF();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const imgData = await readFileAsDataURL(file);
                const imgProps = await getImageProperties(imgData);

                if (i > 0) doc.addPage();

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                // Calculate scaling to fit page while maintaining aspect ratio
                const ratio = Math.min(pageWidth / imgProps.width, pageHeight / imgProps.height);
                const width = imgProps.width * ratio;
                const height = imgProps.height * ratio;
                const x = (pageWidth - width) / 2;
                const y = (pageHeight - height) / 2;

                doc.addImage(imgData, "JPEG", x, y, width, height);
            }

            doc.save("converted-images.pdf");
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const getImageProperties = (src: string): Promise<{ width: number, height: number }> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = src;
        });
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        JPG to <span className="text-red-600">PDF</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Combine multiple JPG images into a single PDF document.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                        files={files}
                        onRemove={() => {
                            setFiles([]);
                            setPreviews([]);
                        }}
                        title="Upload Images"
                        description="Drag & drop images to combine"
                    />

                    {files.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-semibold mb-4">Selected Images ({files.length})</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative aspect-square bg-gray-50 rounded-xl border overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={src}
                                            alt={`Preview ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-1 right-1 bg-black/50 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                                            {index + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => {
                                        setFiles([]);
                                        setPreviews([]);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={generatePdf}
                                    disabled={isGenerating}
                                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        "Generating..."
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Download PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
