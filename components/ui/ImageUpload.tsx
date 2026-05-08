"use client";

import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { ImagePlus } from "lucide-react";
import { useCallback } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  buttonText?: string;
}

export function ImageUpload({ onUpload, buttonText = "Upload Image" }: ImageUploadProps) {
  const handleUpload = useCallback((result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success") {
      const info = result.info as any; // Cloudinary types can be tricky, cast as needed but check existence
      if (info?.secure_url) {
        onUpload(info.secure_url);
      }
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
          onClick={() => open?.()}
          className="flex items-center gap-2"
        >
          <ImagePlus size={16} />
          {buttonText}
        </Button>
      )}
    </CldUploadWidget>
  );
}
