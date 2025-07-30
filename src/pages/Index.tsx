import { useState } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { ProcessingControls, ProcessingSettings } from "@/components/ProcessingControls";
import { BatchProcessing } from "@/components/BatchProcessing";
import { ImagePreview } from "@/components/ImagePreview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ImageIcon, Zap, Cloud } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  
  const [settings, setSettings] = useState<ProcessingSettings>({
    pixelation: 0,
    blur: 0,
    edgeDetection: false,
    posterize: 8,
    contrast: 100,
    brightness: 100,
    saturation: 100,
    outputSize: 1024,
    backgroundColor: "transparent",
    lineArt: false,
  });

  const handleImageSelect = (file: File | null) => {
    setSelectedImage(file);
    setProcessedImage(null);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      toast.success("Image uploaded successfully!");
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsProcessing(true);
    toast.info("Processing image...");

    // Simulate image processing
    setTimeout(() => {
      // In a real implementation, you would send the image and settings to your Python backend
      // For now, we'll just use the original image as a placeholder
      setProcessedImage(imagePreviewUrl);
      setIsProcessing(false);
      toast.success("Image processed successfully!");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-primary to-primary-glow rounded-lg">
                <ImageIcon className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Image Processor</h1>
                <p className="text-sm text-muted-foreground">Professional image processing tool</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="single" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96">
            <TabsTrigger value="single" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Single Image
            </TabsTrigger>
            <TabsTrigger value="batch" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              Batch Processing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Upload & Controls */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-card to-card/80 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload 
                      onImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                    />
                  </CardContent>
                </Card>

                <ProcessingControls
                  settings={settings}
                  onSettingsChange={setSettings}
                  onProcess={handleProcessImage}
                  isProcessing={isProcessing}
                />
              </div>

              {/* Right Column - Preview */}
              <div className="lg:col-span-2">
                <ImagePreview
                  originalImage={imagePreviewUrl}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="batch" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column - Settings Summary */}
              <div>
                <ProcessingControls
                  settings={settings}
                  onSettingsChange={setSettings}
                  onProcess={() => {}}
                  isProcessing={false}
                />
              </div>

              {/* Right Column - Batch Processing */}
              <div className="lg:col-span-2">
                <BatchProcessing settings={settings} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
