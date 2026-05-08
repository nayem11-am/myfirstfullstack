"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Button } from "./Button";
import { ImagePlus } from "lucide-react";
import { useCallback } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
}

export function ImageUpload({ onUpload, buttonText = "Upload Image" }: ImageUploadProps) {
  const handleUpload = useCallback((result: any) => {
    if (result.event === "success") {
      onUpload(result.info.secure_url);
    }
  }, [onUpload]);

  return (
    <CldUploadWidget 
      signatureEndpoint="/api/cloudinary/sign"
      onSuccess={handleUpload}
      options={{
        maxFiles: 1,
        resourceType: "image",
        clientAllowedFormats: ["jpeg", "png", "jpg", "webp"]
      }}
    >
      {({ open }) => (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => open()}
          className="flex items-center gap-2"
        >
          <ImagePlus size={16} />
          {buttonText}
        </Button>
      )}
    </CldUploadWidget>
  );
}
