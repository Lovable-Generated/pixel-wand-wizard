import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Eye, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Maximize2,
  ImageIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  originalImage?: string;
  processedImage?: string;
  isProcessing?: boolean;
  className?: string;
}

export const ImagePreview = ({ 
  originalImage, 
  processedImage, 
  isProcessing = false,
  className 
}: ImagePreviewProps) => {
  const [currentView, setCurrentView] = useState<'split' | 'original' | 'processed'>('split');
  const [zoom, setZoom] = useState(100);

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `processed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const adjustZoom = (delta: number) => {
    setZoom(prev => Math.max(25, Math.min(400, prev + delta)));
  };

  if (!originalImage) {
    return (
      <Card className={cn("bg-gradient-to-br from-card to-card/80 border-border/50", className)}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No image selected</p>
            <p className="text-sm">Upload an image to see the preview</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-card to-card/80 border-border/50", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-primary" />
            Image Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={currentView === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('split')}
                className="px-3 py-1 text-xs"
              >
                Split
              </Button>
              <Button
                variant={currentView === 'original' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('original')}
                className="px-3 py-1 text-xs"
              >
                Original
              </Button>
              <Button
                variant={currentView === 'processed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView('processed')}
                disabled={!processedImage}
                className="px-3 py-1 text-xs"
              >
                Processed
              </Button>
            </div>
            
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustZoom(-25)}
                className="h-8 w-8"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Badge variant="outline" className="px-2 py-1 text-xs min-w-[3rem] text-center">
                {zoom}%
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustZoom(25)}
                className="h-8 w-8"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Image Display Area */}
        <div className="relative bg-muted/30 rounded-lg border border-border/50 overflow-hidden">
          <div className="relative h-96 overflow-auto">
            {currentView === 'split' && (
              <div className="flex h-full">
                <div className="flex-1 relative border-r border-border/50">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-muted/80 backdrop-blur-sm">Original</Badge>
                  </div>
                  <img
                    src={originalImage}
                    alt="Original"
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
                <div className="flex-1 relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-primary/80 text-primary-foreground backdrop-blur-sm">
                      {isProcessing ? 'Processing...' : 'Processed'}
                    </Badge>
                  </div>
                  {isProcessing ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Processing image...</p>
                      </div>
                    </div>
                  ) : processedImage ? (
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="w-full h-full object-contain"
                      style={{ transform: `scale(${zoom / 100})` }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No processed image</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {currentView === 'original' && (
              <div className="relative h-full">
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-muted/80 backdrop-blur-sm">Original Image</Badge>
                </div>
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-full object-contain"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              </div>
            )}
            
            {currentView === 'processed' && (
              <div className="relative h-full">
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-primary/80 text-primary-foreground backdrop-blur-sm">
                    Processed Image
                  </Badge>
                </div>
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No processed image available</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Download Button */}
        {processedImage && !isProcessing && (
          <div className="flex justify-center">
            <Button 
              variant="success" 
              onClick={handleDownload}
              className="px-6"
            >
              <Download className="w-4 h-4" />
              Download Processed Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};