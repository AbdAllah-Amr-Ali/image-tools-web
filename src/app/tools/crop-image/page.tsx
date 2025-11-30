"use client";

import { useState, useRef } from "react";
import Dropzone from "@/components/Dropzone";
import { Download, ArrowRight, Crop as CropIcon } from "lucide-react";
import { motion } from "framer-motion";
import ReactCrop, { type Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight,
        ),
        mediaWidth,
        mediaHeight,
    )
}

export default function CropImage() {
    const [file, setFile] = useState<File | null>(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [croppedImageUrl, setCroppedImageUrl] = useState<string | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setFile(files[0]);
            setCroppedImageUrl(null);
            const reader = new FileReader();
            reader.addEventListener("load", () =>
                setImgSrc(reader.result?.toString() || "")
            );
            reader.readAsDataURL(files[0]);
        }
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, 16 / 9));
    };

    const getCroppedImg = async () => {
        if (!completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return;

        // The displayed image might be scaled down (e.g. by CSS max-width)
        // We need to calculate the scale between the natural image size and the displayed size
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        // The crop dimensions in the natural image coordinates
        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        // Set canvas size to the desired crop size
        canvas.width = cropWidth;
        canvas.height = cropHeight;

        // Use high quality smoothing
        ctx.imageSmoothingQuality = "high";

        // Draw the cropped portion of the original image onto the canvas
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            image,
            cropX,
            cropY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        // As Base64 string
        const base64Image = canvas.toDataURL("image/jpeg", 1.0);
        setCroppedImageUrl(base64Image);
    };

    const downloadImage = () => {
        if (croppedImageUrl) {
            const link = document.createElement("a");
            link.href = croppedImageUrl;
            link.download = file ? file.name.replace(/\.[^/.]+$/, "") + "-cropped.jpg" : "cropped.jpg";
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
                        Crop <span className="text-orange-600">Image</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Crop your images to the perfect size and aspect ratio.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border">
                    {!imgSrc ? (
                        <Dropzone
                            onDrop={handleDrop}
                            accept={{ "image/*": [] }}
                            files={file ? [file] : []}
                            onRemove={() => {
                                setFile(null);
                                setImgSrc("");
                                setCroppedImageUrl(null);
                            }}
                            title="Upload Image to Crop"
                        />
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="mb-6 w-full overflow-auto max-h-[60vh] flex justify-center bg-gray-50 rounded-xl border p-4">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        ref={imgRef}
                                        alt="Crop me"
                                        src={imgSrc}
                                        onLoad={onImageLoad}
                                        className="max-w-full"
                                    />
                                </ReactCrop>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setImgSrc("");
                                        setCroppedImageUrl(null);
                                    }}
                                    className="px-6 py-2 rounded-full border hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={getCroppedImg}
                                    className="flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors"
                                >
                                    <CropIcon className="w-5 h-5" />
                                    Crop Image
                                </button>
                            </div>
                        </div>
                    )}

                    {croppedImageUrl && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 text-center border-t pt-8"
                        >
                            <h3 className="font-semibold text-lg mb-4">Result</h3>
                            <div className="inline-block p-2 border rounded-xl bg-gray-50 mb-6">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={croppedImageUrl} alt="Cropped" className="max-h-64 rounded-lg" />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    onClick={downloadImage}
                                    className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Cropped Image
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
