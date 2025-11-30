"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, FlipHorizontal, FlipVertical } from "lucide-react";

export default function FlipImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [flipH, setFlipH] = useState(false);
    const [flipV, setFlipV] = useState(false);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => setImageSrc(e.target?.result as string);
            reader.readAsDataURL(files[0]);
            setFlipH(false);
            setFlipV(false);
        }
    };

    const downloadImage = () => {
        if (!imageSrc) return;
        const canvas = document.createElement("canvas");
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.translate(flipH ? img.width : 0, flipV ? img.height : 0);
                ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
                ctx.drawImage(img, 0, 0);

                const link = document.createElement("a");
                link.href = canvas.toDataURL(file?.type || "image/jpeg");
                link.download = file ? `flipped-${file.name}` : "flipped-image.jpg";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        img.src = imageSrc;
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Flip <span className="text-indigo-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Mirror your images horizontally or vertically.
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
                            }}
                            title="Upload Image to Flip"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setFlipH(!flipH)}
                                    className={`p-4 rounded-xl border transition-all ${flipH ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'hover:bg-gray-50'}`}
                                >
                                    <FlipHorizontal className="w-6 h-6 mb-2 mx-auto" />
                                    <span className="text-sm font-medium">Flip Horizontal</span>
                                </button>
                                <button
                                    onClick={() => setFlipV(!flipV)}
                                    className={`p-4 rounded-xl border transition-all ${flipV ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'hover:bg-gray-50'}`}
                                >
                                    <FlipVertical className="w-6 h-6 mb-2 mx-auto" />
                                    <span className="text-sm font-medium">Flip Vertical</span>
                                </button>
                            </div>

                            <div className="relative max-w-full overflow-hidden rounded-xl border bg-gray-50 p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageSrc}
                                    alt="Preview"
                                    style={{
                                        transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                                        transition: "transform 0.3s ease",
                                        maxHeight: "50vh"
                                    }}
                                    className="max-w-full object-contain"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImageSrc(null);
                                    }}
                                    className="px-8 py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={downloadImage}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Flipped
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
