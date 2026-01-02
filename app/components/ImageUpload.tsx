"use client"

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
    onImageUpload?: (url: string) => void;
}

const ImageUpload = ({ onImageUpload }: ImageUploadProps) => {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const authenticator = async () => {
        try {
            const response = await fetch("/api/upload-auth");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            const { signature, expire, token, publicKey } = data;
            return { signature, expire, token, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select a file to upload");
            return;
        }

        const file = selectedFile;
        setIsUploading(true);
        setProgress(0);

        // Create abort controller for this upload
        if (!abortControllerRef.current) {
            abortControllerRef.current = new AbortController();
        }

        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            toast.error("Failed to authenticate upload");
            setIsUploading(false);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,

                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },

                abortSignal: abortControllerRef.current?.signal,
            });

            const imageUrl = uploadResponse.url || "";
            setUploadedImage(imageUrl);
            toast.success("Image uploaded successfully!");

            if (onImageUpload && imageUrl) {
                onImageUpload(imageUrl);
            }
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                toast.error("Upload cancelled");
            } else if (error instanceof ImageKitInvalidRequestError) {
                toast.error("Invalid file: " + error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                toast.error("Network error: " + error.message);
            } else if (error instanceof ImageKitServerError) {
                toast.error("Server error: " + error.message);
            } else {
                toast.error("Upload failed");
                console.error("Upload error:", error);
            }
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const handleRemove = () => {
        setUploadedImage(null);
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (onImageUpload) {
            onImageUpload("");
        }
    };

    return (
        <div className="space-y-4">
            {!uploadedImage && !preview ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/jpg,image/png"
                        className="hidden"
                    />
                    <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        PNG, JPG up to 5MB
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Select Image
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        {(uploadedImage || preview) && (
                            <Image
                                src={uploadedImage || preview || ""}
                                alt="Upload preview"
                                fill
                                className="object-cover"
                            />
                        )}
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={handleRemove}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {preview && !uploadedImage && (
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={isUploading}
                            className="w-full"
                        >
                            {isUploading ? (
                                <>
                                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                                    Uploading... {progress.toFixed(0)}%
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Image
                                </>
                            )}
                        </Button>
                    )}

                    {isUploading && (
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default ImageUpload;