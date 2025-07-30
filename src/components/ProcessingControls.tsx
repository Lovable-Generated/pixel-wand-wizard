import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Settings, Zap, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProcessingSettings {
  pixelation: number;
  blur: number;
  edgeDetection: boolean;
  posterize: number;
  contrast: number;
  brightness: number;
  saturation: number;
  outputSize: number;
  backgroundColor: string;
  lineArt: boolean;
}

interface ProcessingControlsProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
  onProcess: () => void;
  isProcessing?: boolean;
  className?: string;
}

const colorOptions = [
  { name: "White", value: "#ffffff" },
  { name: "Black", value: "#000000" },
  { name: "Transparent", value: "transparent" },
  { name: "Gray", value: "#808080" },
];

export const ProcessingControls = ({ 
  settings, 
  onSettingsChange, 
  onProcess, 
  isProcessing = false,
  className 
}: ProcessingControlsProps) => {
  const updateSetting = <K extends keyof ProcessingSettings>(
    key: K, 
    value: ProcessingSettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card className={cn("bg-gradient-to-br from-card to-card/80 border-border/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Settings className="h-5 w-5 text-primary" />
          Processing Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Effects Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Effects
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Pixelation
                <span className="text-muted-foreground">{settings.pixelation}</span>
              </Label>
              <Slider
                value={[settings.pixelation]}
                onValueChange={([value]) => updateSetting('pixelation', value)}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Blur Radius
                <span className="text-muted-foreground">{settings.blur}</span>
              </Label>
              <Slider
                value={[settings.blur]}
                onValueChange={([value]) => updateSetting('blur', value)}
                max={20}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Posterize Levels
                <span className="text-muted-foreground">{settings.posterize}</span>
              </Label>
              <Slider
                value={[settings.posterize]}
                onValueChange={([value]) => updateSetting('posterize', value)}
                max={16}
                min={2}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Adjustments Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Adjustments
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Contrast
                <span className="text-muted-foreground">{settings.contrast}%</span>
              </Label>
              <Slider
                value={[settings.contrast]}
                onValueChange={([value]) => updateSetting('contrast', value)}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Brightness
                <span className="text-muted-foreground">{settings.brightness}%</span>
              </Label>
              <Slider
                value={[settings.brightness]}
                onValueChange={([value]) => updateSetting('brightness', value)}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Saturation
                <span className="text-muted-foreground">{settings.saturation}%</span>
              </Label>
              <Slider
                value={[settings.saturation]}
                onValueChange={([value]) => updateSetting('saturation', value)}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Options
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="edge-detection" className="text-sm">Edge Detection</Label>
              <Switch
                id="edge-detection"
                checked={settings.edgeDetection}
                onCheckedChange={(checked) => updateSetting('edgeDetection', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="line-art" className="text-sm">Line Art Mode</Label>
              <Switch
                id="line-art"
                checked={settings.lineArt}
                onCheckedChange={(checked) => updateSetting('lineArt', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm">Background Color</Label>
              <div className="flex gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    className={cn(
                      "w-8 h-8 rounded border-2 transition-all",
                      settings.backgroundColor === color.value 
                        ? "border-primary ring-2 ring-primary/30" 
                        : "border-border hover:border-primary/50",
                      color.value === "transparent" && "bg-gradient-to-br from-white to-gray-300"
                    )}
                    style={{
                      backgroundColor: color.value === "transparent" ? undefined : color.value
                    }}
                    onClick={() => updateSetting('backgroundColor', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm flex justify-between">
                Output Size
                <span className="text-muted-foreground">{settings.outputSize}px</span>
              </Label>
              <Slider
                value={[settings.outputSize]}
                onValueChange={([value]) => updateSetting('outputSize', value)}
                max={2048}
                min={256}
                step={64}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Process Button */}
        <div className="pt-4 border-t border-border">
          <Button 
            variant="processing" 
            onClick={onProcess}
            disabled={isProcessing}
            className="w-full h-12 text-base font-medium"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Process Image
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};