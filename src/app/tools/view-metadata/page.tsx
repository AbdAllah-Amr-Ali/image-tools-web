"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";
import { FileText, Info } from "lucide-react";
import EXIF from "exif-js";

export default function ViewMetadata() {
    const [file, setFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<Record<string, any>>({});

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target?.result as string);
            };
            reader.readAsDataURL(files[0]);

            // Extract EXIF
            // @ts-ignore
            EXIF.getData(files[0], function () {
                // @ts-ignore
                const allMetaData = EXIF.getAllTags(this);
                setMetadata(allMetaData);
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        View <span className="text-cyan-600">Metadata</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        View hidden EXIF data in your images.
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
                                setMetadata({});
                            }}
                            title="Upload Image"
                        />
                    ) : (
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-semibold mb-4">Image Preview</h3>
                                <div className="bg-gray-50 rounded-xl border p-4 flex items-center justify-center">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={imageSrc}
                                        alt="Preview"
                                        className="max-w-full max-h-[400px] object-contain"
                                    />
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            setImageSrc(null);
                                            setMetadata({});
                                        }}
                                        className="w-full py-3 rounded-xl border hover:bg-gray-50 transition-colors"
                                    >
                                        Check Another Image
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Info className="w-5 h-5 text-cyan-600" />
                                    EXIF Data
                                </h3>
                                <div className="bg-gray-50 rounded-xl border overflow-hidden">
                                    {Object.keys(metadata).length > 0 ? (
                                        <div className="divide-y max-h-[500px] overflow-auto">
                                            {Object.entries(metadata).map(([key, value]) => (
                                                <div key={key} className="p-3 flex justify-between text-sm hover:bg-gray-100">
                                                    <span className="font-medium text-gray-600">{key}</span>
                                                    <span className="text-gray-900 text-right max-w-[200px] truncate" title={String(value)}>
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground">
                                            No EXIF data found in this image.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
