"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, Grid3X3 } from "lucide-react";

export default function ImageSplitter() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [splitImages, setSplitImages] = useState<string[]>([]);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
                setSplitImages([]);
            };
            reader.readAsDataURL(files[0]);
        }
    };

    const splitImage = () => {
        if (!imageSrc) return;
        const img = new Image();
        img.onload = () => {
            const pieceWidth = img.width / cols;
            const pieceHeight = img.height / rows;
            const newImages: string[] = [];

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const canvas = document.createElement("canvas");
                    canvas.width = pieceWidth;
                    canvas.height = pieceHeight;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(
                            img,
                            c * pieceWidth,
                            r * pieceHeight,
                            pieceWidth,
                            pieceHeight,
                            0,
                            0,
                            pieceWidth,
                            pieceHeight
                        );
                        newImages.push(canvas.toDataURL("image/jpeg"));
                    }
                }
            }
            setSplitImages(newImages);
        };
        img.src = imageSrc;
    };

    const downloadPiece = (src: string, index: number) => {
        const link = document.createElement("a");
        link.href = src;
        link.download = file ? `split-${index + 1}-${file.name}` : `split-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Image <span className="text-orange-600">Splitter</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Split your image into a grid of smaller pieces.
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
                                setSplitImages([]);
                            }}
                            title="Upload Image"
                        />
                    ) : (
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-2xl border space-y-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Grid3X3 className="w-5 h-5 text-orange-600" />
                                            Grid Settings
                                        </h3>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Rows: {rows}</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={rows}
                                                onChange={(e) => setRows(Number(e.target.value))}
                                                className="w-full accent-orange-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Columns: {cols}</label>
                                            <input
                                                type="range"
                                                min="1"
                                                max="5"
                                                value={cols}
                                                onChange={(e) => setCols(Number(e.target.value))}
                                                className="w-full accent-orange-600"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setImageSrc(null);
                                                setSplitImages([]);
                                            }}
                                            className="flex-1 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={splitImage}
                                            className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                                        >
                                            Split Image
                                        </button>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex items-center justify-center bg-gray-50 rounded-xl border p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageSrc}
                                        alt="Preview"
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                </div>
                            </div>

                            {splitImages.length > 0 && (
                                <div className="border-t pt-8">
                                    <h3 className="font-semibold mb-4">Result Pieces</h3>
                                    <div
                                        className="grid gap-4"
                                        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
                                    >
                                        {splitImages.map((src, index) => (
                                            <div key={index} className="group relative">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={src} alt={`Piece ${index}`} className="w-full rounded-lg border" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                                    <button
                                                        onClick={() => downloadPiece(src, index)}
                                                        className="bg-white text-black p-2 rounded-full"
                                                        title="Download Piece"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
