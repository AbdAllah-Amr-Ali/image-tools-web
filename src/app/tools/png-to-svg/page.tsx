"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Loader2 } from "lucide-react";
// @ts-ignore
import ImageTracer from "imagetracerjs";

export default function PngToSvg() {
    const [file, setFile] = useState<File | null>(null);
    const [svgContent, setSvgContent] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleDrop = async (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setIsProcessing(true);
            try {
                const url = URL.createObjectURL(files[0]);

                ImageTracer.imageToSVG(url, (svg: string) => {
                    setSvgContent(svg);
                    setIsProcessing(false);
                    URL.revokeObjectURL(url);
                }, {
                    ltres: 1,
                    qtres: 1,
                    pathomit: 8,
                    rightangleenhance: true,
                    colorsampling: 2,
                    numberofcolors: 16,
                    mincolorratio: 0.02,
                    colorquantcycles: 3,
                    layering: 0,
                    strokewidth: 1,
                    linefilter: true,
                    scale: 1,
                    roundcoords: 1,
                    viewbox: true,
                    desc: false,
                    lcpr: 0,
                    qcpr: 0,
                    blurradius: 0,
                    blurdelta: 20
                });

            } catch (error) {
                console.error("Vectorization failed:", error);
                alert("Failed to convert to SVG.");
                setIsProcessing(false);
            }
        }
    };

    const downloadSvg = () => {
        if (!svgContent) return;
        const blob = new Blob([svgContent], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file ? `${file.name.replace(/\.[^/.]+$/, "")}.svg` : "image.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        PNG to <span className="text-indigo-600">SVG</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Convert PNG images to SVG vectors.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!svgContent && !isProcessing ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/png": [".png"] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setSvgContent(null);
                            }}
                            title="Upload PNG Image"
                        />
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                            <p className="text-lg font-medium">Tracing SVG...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-gray-50 p-4">
                                <div
                                    dangerouslySetInnerHTML={{ __html: svgContent! }}
                                    className="max-w-full max-h-[50vh] svg-preview"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setSvgContent(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Convert Another
                                </button>
                                <button
                                    onClick={downloadSvg}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download SVG
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
