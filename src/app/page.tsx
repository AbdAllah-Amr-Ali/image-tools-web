"use client";

import { motion } from "framer-motion";
import {
  FileImage, Scissors, Image as ImageIcon, Crop, Scaling, RotateCw, FlipHorizontal,
  Palette, Droplets, Sun, Coffee, ArrowRightLeft, Code, Square, FileText, Minimize2,
  Type, Grid, Grid3X3, LayoutGrid, Layers, Info, Circle, UserCircle, Wand2,
  FileArchive, FileInput, FileOutput, FileType, ImagePlus, Images, Maximize,
  Monitor, Move, PaintBucket, Scan, Settings, Sliders, Sparkles, Spline,
  Stamp, Sticker, StretchHorizontal, SwitchCamera, Tag, Trash2, Upload,
  View, ZoomIn
} from "lucide-react";
import ToolCard from "@/components/ToolCard";

const tools = [
  // Converters
  {
    title: "JPG to PNG",
    description: "Convert JPG images to PNG format.",
    icon: FileType,
    href: "/tools/jpg-to-png",
    color: "bg-blue-500",
  },
  {
    title: "PNG to JPG",
    description: "Convert PNG images to JPG format.",
    icon: FileImage,
    href: "/tools/png-to-jpg",
    color: "bg-indigo-500",
  },
  {
    title: "WebP to JPG",
    description: "Convert WebP images to JPG format.",
    icon: ImagePlus,
    href: "/tools/webp-to-jpg",
    color: "bg-purple-500",
  },
  {
    title: "WebP to PNG",
    description: "Convert WebP images to PNG format.",
    icon: Images,
    href: "/tools/webp-to-png",
    color: "bg-pink-500",
  },
  {
    title: "JPG to WebP",
    description: "Convert JPG images to WebP format.",
    icon: FileOutput,
    href: "/tools/jpg-to-webp",
    color: "bg-cyan-500",
  },
  {
    title: "PNG to WebP",
    description: "Convert PNG images to WebP format.",
    icon: FileInput,
    href: "/tools/png-to-webp",
    color: "bg-teal-500",
  },
  {
    title: "HEIC to JPG",
    description: "Convert HEIC photos to JPG.",
    icon: SwitchCamera,
    href: "/tools/heic-to-jpg",
    color: "bg-orange-500",
  },
  {
    title: "HEIC to PNG",
    description: "Convert HEIC photos to PNG.",
    icon: SwitchCamera,
    href: "/tools/heic-to-png",
    color: "bg-indigo-500",
  },
  {
    title: "SVG to PNG",
    description: "Convert SVG vectors to PNG.",
    icon: Spline,
    href: "/tools/svg-to-png",
    color: "bg-orange-500",
  },
  {
    title: "GIF to JPG",
    description: "Convert GIF to JPG.",
    icon: FileArchive,
    href: "/tools/gif-to-jpg",
    color: "bg-pink-500",
  },
  {
    title: "GIF to PNG",
    description: "Convert GIF to PNG.",
    icon: FileArchive,
    href: "/tools/gif-to-png",
    color: "bg-purple-500",
  },
  {
    title: "JPG to GIF",
    description: "Convert JPG to GIF.",
    icon: FileArchive,
    href: "/tools/jpg-to-gif",
    color: "bg-blue-500",
  },
  {
    title: "PNG to GIF",
    description: "Convert PNG to GIF.",
    icon: FileArchive,
    href: "/tools/png-to-gif",
    color: "bg-green-500",
  },
  {
    title: "JPG to AVIF",
    description: "Convert JPG to AVIF.",
    icon: FileType,
    href: "/tools/jpg-to-avif",
    color: "bg-red-500",
  },
  {
    title: "PNG to AVIF",
    description: "Convert PNG to AVIF.",
    icon: FileType,
    href: "/tools/png-to-avif",
    color: "bg-yellow-500",
  },
  {
    title: "WebP to AVIF",
    description: "Convert WebP to AVIF.",
    icon: FileType,
    href: "/tools/webp-to-avif",
    color: "bg-teal-500",
  },
  {
    title: "TIFF to JPG",
    description: "Convert TIFF to JPG.",
    icon: FileImage,
    href: "/tools/tiff-to-jpg",
    color: "bg-cyan-500",
  },
  {
    title: "TIFF to PNG",
    description: "Convert TIFF to PNG.",
    icon: FileImage,
    href: "/tools/tiff-to-png",
    color: "bg-indigo-600",
  },
  {
    title: "PSD to JPG",
    description: "Convert PSD to JPG.",
    icon: Layers,
    href: "/tools/psd-to-jpg",
    color: "bg-blue-600",
  },
  {
    title: "PSD to PNG",
    description: "Convert PSD to PNG.",
    icon: Layers,
    href: "/tools/psd-to-png",
    color: "bg-purple-600",
  },
  {
    title: "PDF to JPG",
    description: "Convert PDF pages to JPG.",
    icon: FileText,
    href: "/tools/pdf-to-jpg",
    color: "bg-red-500",
  },
  {
    title: "JPG to PDF",
    description: "Convert JPG images to PDF.",
    icon: FileText,
    href: "/tools/jpg-to-pdf",
    color: "bg-red-600",
  },
  {
    title: "PDF to PNG",
    description: "Convert PDF pages to PNG.",
    icon: FileText,
    href: "/tools/pdf-to-png",
    color: "bg-red-500",
  },
  {
    title: "PNG to PDF",
    description: "Convert PNG images to PDF.",
    icon: FileText,
    href: "/tools/png-to-pdf",
    color: "bg-indigo-500",
  },
  {
    title: "Font Awesome to PNG",
    description: "Convert icons to PNG.",
    icon: Sticker,
    href: "/tools/font-awesome-to-png",
    color: "bg-blue-400",
  },

  // Editors
  {
    title: "Remove Background",
    description: "Remove image background automatically.",
    icon: Scissors,
    href: "/tools/remove-background",
    color: "bg-rose-500",
  },
  {
    title: "Crop Image",
    description: "Crop and trim your images.",
    icon: Crop,
    href: "/tools/crop-image",
    color: "bg-green-500",
  },
  {
    title: "Resize Image",
    description: "Resize images to any dimension.",
    icon: Scaling,
    href: "/tools/resize",
    color: "bg-yellow-500",
  },
  {
    title: "Rotate Image",
    description: "Rotate images 90, 180, or 270 degrees.",
    icon: RotateCw,
    href: "/tools/rotate",
    color: "bg-orange-500",
  },
  {
    title: "Flip Image",
    description: "Flip images horizontally or vertically.",
    icon: FlipHorizontal,
    href: "/tools/flip",
    color: "bg-cyan-500",
  },
  {
    title: "Add Text",
    description: "Add custom text to your images.",
    icon: Type,
    href: "/tools/add-text",
    color: "bg-indigo-500",
  },
  {
    title: "Add Border",
    description: "Add borders to your images.",
    icon: Square,
    href: "/tools/add-border",
    color: "bg-purple-500",
  },
  {
    title: "Round Corners",
    description: "Round the corners of your images.",
    icon: Circle,
    href: "/tools/round-corners",
    color: "bg-pink-500",
  },
  {
    title: "Compress Image",
    description: "Reduce image file size.",
    icon: Minimize2,
    href: "/tools/compress-image",
    color: "bg-green-600",
  },
  {
    title: "Blur Image",
    description: "Add blur effect to images.",
    icon: Droplets,
    href: "/tools/blur",
    color: "bg-blue-400",
  },
  {
    title: "Grayscale",
    description: "Convert images to grayscale.",
    icon: Sun,
    href: "/tools/grayscale",
    color: "bg-gray-500",
  },
  {
    title: "Sepia",
    description: "Apply vintage sepia effect.",
    icon: Coffee,
    href: "/tools/sepia",
    color: "bg-amber-700",
  },
  {
    title: "Invert Colors",
    description: "Invert image colors.",
    icon: ArrowRightLeft,
    href: "/tools/invert",
    color: "bg-slate-900",
  },
  {
    title: "Brightness & Contrast",
    description: "Adjust image brightness and contrast.",
    icon: Sliders,
    href: "/tools/brightness-contrast",
    color: "bg-yellow-400",
  },
  {
    title: "Pixelate",
    description: "Pixelate your images.",
    icon: Grid,
    href: "/tools/pixelate",
    color: "bg-indigo-400",
  },
  {
    title: "Image to Base64",
    description: "Convert image to Base64 string.",
    icon: Code,
    href: "/tools/image-to-base64",
    color: "bg-slate-600",
  },
  {
    title: "Combine Images",
    description: "Combine multiple images into one.",
    icon: LayoutGrid,
    href: "/tools/combine-images",
    color: "bg-violet-500",
  },
  {
    title: "Image Splitter",
    description: "Split image into grid pieces.",
    icon: Grid3X3,
    href: "/tools/image-splitter",
    color: "bg-orange-600",
  },
  {
    title: "View Metadata",
    description: "View image EXIF metadata.",
    icon: Info,
    href: "/tools/view-metadata",
    color: "bg-blue-500",
  },
  {
    title: "Collage Maker",
    description: "Create photo collages.",
    icon: LayoutGrid,
    href: "/tools/collage-maker",
    color: "bg-pink-600",
  },
  {
    title: "Add Overlay",
    description: "Overlay image on another.",
    icon: Layers,
    href: "/tools/add-image-overlay",
    color: "bg-orange-600",
  },
  {
    title: "Image to Text",
    description: "Extract text from images (OCR).",
    icon: Scan,
    href: "/tools/image-to-text",
    color: "bg-blue-500",
  },
  {
    title: "Meme Maker",
    description: "Create memes with text.",
    icon: Sparkles,
    href: "/tools/meme-maker",
    color: "bg-yellow-500",
  },
  {
    title: "JPG to SVG",
    description: "Convert JPG to SVG vector.",
    icon: Spline,
    href: "/tools/jpg-to-svg",
    color: "bg-green-500",
  },
  {
    title: "PNG to SVG",
    description: "Convert PNG to SVG vector.",
    icon: Spline,
    href: "/tools/png-to-svg",
    color: "bg-teal-500",
  },
  {
    title: "Round Image",
    description: "Create circular images.",
    icon: Circle,
    href: "/tools/make-round-image",
    color: "bg-purple-500",
  },
  {
    title: "Profile Photo",
    description: "Create profile pictures.",
    icon: UserCircle,
    href: "/tools/profile-photo-maker",
    color: "bg-pink-500",
  },
  {
    title: "Black & White",
    description: "Convert to black & white.",
    icon: Palette,
    href: "/tools/black-and-white",
    color: "bg-gray-800",
  },
  {
    title: "WebP to GIF",
    description: "Convert WebP to GIF.",
    icon: FileArchive,
    href: "/tools/webp-to-gif",
    color: "bg-orange-500",
  },
  {
    title: "Upscale Image",
    description: "Upscale image resolution.",
    icon: Maximize,
    href: "/tools/upscale-image",
    color: "bg-emerald-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-slate-950">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
              Free Online <span className="text-indigo-600">Image Tools</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Simple, fast, and secure tools to edit, convert, and create images right in your browser.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
            >
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
