import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage?: File | null;
  className?: string;
}

export const ImageUpload = ({ onImageSelect, selectedImage, className }: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageSelect(imageFile);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile);
    }
  }, [onImageSelect]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageSelect(null as any);
  };

  return (
    <div className={cn("relative", className)}>
      {preview ? (
        <div className="relative group">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card">
            <img 
              src={preview} 
              alt="Selected image" 
              className="max-h-96 w-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer hover:border-primary/50",
            isDragOver ? "border-primary bg-primary/5" : "border-border",
            "bg-gradient-to-br from-card to-card/50"
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={cn(
              "p-4 rounded-full transition-colors",
              isDragOver ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              {isDragOver ? (
                <Upload className="h-8 w-8" />
              ) : (
                <ImageIcon className="h-8 w-8" />
              )}
            </div>
            <div>
              <p className="text-lg font-medium">
                {isDragOver ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to select • PNG, JPG, WEBP
              </p>
            </div>
            <Button 
              variant="processing" 
              onClick={() => document.getElementById('file-input')?.click()}
            >
              Select Image
            </Button>
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};