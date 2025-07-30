import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { 
  Cloud, 
  FolderOpen, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProcessingSettings } from "./ProcessingControls";

interface BatchProcessingProps {
  settings: ProcessingSettings;
  className?: string;
}

interface BatchJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  inputBucket: string;
  outputBucket: string;
  totalImages: number;
  processedImages: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
}

export const BatchProcessing = ({ settings, className }: BatchProcessingProps) => {
  const [inputBucket, setInputBucket] = useState("");
  const [outputBucket, setOutputBucket] = useState("");
  const [currentJob, setCurrentJob] = useState<BatchJob | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const startBatchJob = () => {
    if (!inputBucket || !outputBucket) return;
    
    const job: BatchJob = {
      id: crypto.randomUUID(),
      status: 'processing',
      inputBucket,
      outputBucket,
      totalImages: 150, // Simulated
      processedImages: 0,
      startTime: new Date(),
    };
    
    setCurrentJob(job);
    
    // Simulate processing
    const interval = setInterval(() => {
      setCurrentJob(prev => {
        if (!prev) return null;
        
        const newProcessed = prev.processedImages + Math.floor(Math.random() * 5) + 1;
        
        if (newProcessed >= prev.totalImages) {
          clearInterval(interval);
          return {
            ...prev,
            processedImages: prev.totalImages,
            status: 'completed',
            endTime: new Date(),
          };
        }
        
        return {
          ...prev,
          processedImages: Math.min(newProcessed, prev.totalImages),
        };
      });
    }, 1000);
  };

  const pauseJob = () => {
    setCurrentJob(prev => prev ? { ...prev, status: 'pending' } : null);
  };

  const resetJob = () => {
    setCurrentJob(null);
  };

  const getStatusColor = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'processing': return 'bg-info text-info-foreground';
      case 'completed': return 'bg-success text-success-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: BatchJob['status']) => {
    switch (status) {
      case 'pending': return <Pause className="w-3 h-3" />;
      case 'processing': return <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'error': return <AlertCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Card className={cn("bg-gradient-to-br from-card to-card/80 border-border/50", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Cloud className="h-5 w-5 text-accent" />
          S3 Batch Processing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!currentJob ? (
          <>
            {/* Configuration */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-bucket" className="text-sm font-medium">
                  Input S3 Bucket/Path
                </Label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="input-bucket"
                    placeholder="s3://my-bucket/input/images/"
                    value={inputBucket}
                    onChange={(e) => setInputBucket(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-bucket" className="text-sm font-medium">
                  Output S3 Bucket/Path
                </Label>
                <div className="relative">
                  <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="output-bucket"
                    placeholder="s3://my-bucket/output/processed/"
                    value={outputBucket}
                    onChange={(e) => setOutputBucket(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Processing Settings Summary */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Current Processing Settings</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Pixelation: {settings.pixelation}</div>
                <div>Blur: {settings.blur}</div>
                <div>Contrast: {settings.contrast}%</div>
                <div>Brightness: {settings.brightness}%</div>
                <div>Edge Detection: {settings.edgeDetection ? 'On' : 'Off'}</div>
                <div>Line Art: {settings.lineArt ? 'On' : 'Off'}</div>
              </div>
            </div>

            {/* Start Button */}
            <Button 
              variant="accent" 
              onClick={startBatchJob}
              disabled={!inputBucket || !outputBucket}
              className="w-full h-12 text-base font-medium"
            >
              <Play className="w-5 h-5" />
              Start Batch Processing
            </Button>
          </>
        ) : (
          <>
            {/* Job Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={cn("px-2 py-1", getStatusColor(currentJob.status))}>
                    {getStatusIcon(currentJob.status)}
                    {currentJob.status.charAt(0).toUpperCase() + currentJob.status.slice(1)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">Job {currentJob.id.slice(0, 8)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentJob.processedImages} / {currentJob.totalImages} images
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress 
                  value={(currentJob.processedImages / currentJob.totalImages) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {currentJob.startTime && `Started: ${currentJob.startTime.toLocaleTimeString()}`}
                  </span>
                  <span>
                    {Math.round((currentJob.processedImages / currentJob.totalImages) * 100)}% complete
                  </span>
                </div>
              </div>

              {/* Bucket Information */}
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="p-2 bg-muted/30 rounded border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">Input:</div>
                  <div className="font-mono text-xs break-all">{currentJob.inputBucket}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded border border-border/30">
                  <div className="text-xs text-muted-foreground mb-1">Output:</div>
                  <div className="font-mono text-xs break-all">{currentJob.outputBucket}</div>
                </div>
              </div>

              {/* Completion Info */}
              {currentJob.status === 'completed' && currentJob.endTime && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Batch processing completed!</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Finished at {currentJob.endTime.toLocaleTimeString()}
                  </div>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              {currentJob.status === 'processing' && (
                <Button variant="outline" onClick={pauseJob} className="flex-1">
                  <Pause className="w-4 h-4" />
                  Pause
                </Button>
              )}
              <Button variant="outline" onClick={resetJob} className="flex-1">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};