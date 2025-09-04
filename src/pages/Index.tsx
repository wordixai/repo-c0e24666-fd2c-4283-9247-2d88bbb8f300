import { useState, useRef } from 'react';
import { Camera, Download, Globe, Zap, Shield, Smartphone, ExternalLink, Copy, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { screenshotOne } from '@/lib/screenshotone';
import { ScreenshotSettings, ScreenshotConfig } from '@/components/ScreenshotSettings';

const Index = () => {
  const [url, setUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [capturedUrl, setCapturedUrl] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const { toast } = useToast();

  const [config, setConfig] = useState<ScreenshotConfig>({
    viewport_width: 1920,
    viewport_height: 1080,
    device_scale_factor: 2,
    format: 'png',
    image_quality: 100,
    full_page: true,
    block_ads: true,
    block_cookie_banners: true,
    delay: 2,
    dark_mode: false,
    omit_background: false,
  });

  const validateUrl = (inputUrl: string): string => {
    if (!inputUrl) {
      throw new Error('Please enter a website URL');
    }

    let validUrl = inputUrl.trim();
    
    // Add protocol if missing
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    // Basic URL validation
    try {
      new URL(validUrl);
      return validUrl;
    } catch {
      throw new Error('Please enter a valid website URL');
    }
  };

  const captureScreenshot = async () => {
    try {
      const validUrl = validateUrl(url);
      setIsCapturing(true);
      setCapturedUrl(validUrl);

      toast({
        title: "Capturing Screenshot",
        description: "Please wait while we capture the webpage...",
      });

      // Generate screenshot using ScreenshotOne API
      const screenshotBlob = await screenshotOne.takeScreenshot({
        url: validUrl,
        ...config,
      });

      // Create object URL for the blob
      const objectUrl = URL.createObjectURL(screenshotBlob);
      setScreenshotUrl(objectUrl);

      toast({
        title: "Screenshot Captured!",
        description: "Your high-quality screenshot is ready for download.",
      });

    } catch (error) {
      console.error('Screenshot error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to capture screenshot';
      
      toast({
        title: "Capture Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    
    // Generate filename based on URL and timestamp
    const domain = capturedUrl ? new URL(capturedUrl).hostname : 'screenshot';
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    link.download = `${domain}-${timestamp}.${config.format}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Your ${config.format.toUpperCase()} screenshot is being downloaded.`,
    });
  };

  const copyImageToClipboard = async () => {
    if (!screenshotUrl) return;
    
    try {
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      
      toast({
        title: "Copied to Clipboard",
        description: "Screenshot has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please download instead.",
        variant: "destructive"
      });
    }
  };

  const shareScreenshot = async () => {
    if (!screenshotUrl || !navigator.share) {
      toast({
        title: "Share Not Available",
        description: "Web Share API is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      const file = new File([blob], `screenshot.${config.format}`, { type: blob.type });

      await navigator.share({
        title: 'Website Screenshot',
        text: `Screenshot of ${capturedUrl}`,
        files: [file]
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const features = [
    {
      icon: Camera,
      title: "Ultra High Quality",
      description: "Capture in up to 4K resolution with perfect pixel accuracy"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Powered by ScreenshotOne API for instant results"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Block ads, trackers, and cookie banners automatically"
    },
    {
      icon: Smartphone,
      title: "Any Device Size",
      description: "Desktop, tablet, mobile - capture any viewport size"
    }
  ];

  const examples = [
    { url: "google.com", title: "Google" },
    { url: "github.com", title: "GitHub" },
    { url: "vercel.com", title: "Vercel" },
    { url: "tailwindcss.com", title: "Tailwind CSS" },
    { url: "openai.com", title: "OpenAI" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 gradient-primary text-primary-foreground border-0">
            ⚡ Powered by ScreenshotOne
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
            Professional Website
            <br />
            <span className="gradient-primary bg-clip-text text-transparent">Screenshots</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Capture pixel-perfect, high-resolution screenshots of any webpage. 
            Advanced settings, privacy protection, and instant download.
          </p>
          
          {/* URL Input Section */}
          <Card className="capture-card max-w-2xl mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="Enter website URL (e.g., google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg h-12 pl-10"
                    disabled={isCapturing}
                    onKeyPress={(e) => e.key === 'Enter' && !isCapturing && captureScreenshot()}
                  />
                </div>
                <Button
                  onClick={captureScreenshot}
                  disabled={isCapturing || !url}
                  className="hero-button h-12 min-w-[140px]"
                >
                  {isCapturing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Capturing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Capture
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <ScreenshotSettings
            config={config}
            onChange={setConfig}
            isOpen={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
          />

          {/* Quick Examples */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground mr-2">Quick try:</span>
            {examples.map((example) => (
              <Button
                key={example.url}
                variant="outline"
                size="sm"
                onClick={() => setUrl(example.url)}
                className="text-xs"
                disabled={isCapturing}
              >
                {example.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Screenshot Result */}
        {screenshotUrl && (
          <Card className="capture-card max-w-5xl mx-auto mb-16">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <span>Screenshot Ready!</span>
                    <Badge variant="secondary" className="ml-2">
                      {config.viewport_width}×{config.viewport_height}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    {capturedUrl}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {navigator.clipboard && (
                    <Button variant="outline" onClick={copyImageToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  )}
                  {navigator.share && (
                    <Button variant="outline" onClick={shareScreenshot}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  )}
                  <Button onClick={downloadScreenshot} className="hero-button">
                    <Download className="w-4 h-4 mr-2" />
                    Download {config.format.toUpperCase()}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-soft bg-checkered">
                <img
                  src={screenshotUrl}
                  alt="Website Screenshot"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4 text-sm text-muted-foreground">
                <span>Format: {config.format.toUpperCase()}</span>
                <span>•</span>
                <span>Quality: {config.image_quality}%</span>
                <span>•</span>
                <span>Size: {config.viewport_width}×{config.viewport_height}</span>
                {config.full_page && (
                  <>
                    <span>•</span>
                    <span>Full Page</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="capture-card text-center">
              <CardContent className="pt-6">
                <div className="feature-icon mx-auto mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="capture-card max-w-4xl mx-auto mb-16">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Professional screenshot capture powered by ScreenshotOne API
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h4 className="font-semibold mb-2">Enter URL</h4>
                <p className="text-sm text-muted-foreground">
                  Paste any website URL you want to capture
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h4 className="font-semibold mb-2">Configure</h4>
                <p className="text-sm text-muted-foreground">
                  Adjust settings for quality, size, and privacy
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h4 className="font-semibold mb-2">Capture</h4>
                <p className="text-sm text-muted-foreground">
                  Our API captures the perfect screenshot
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  4
                </div>
                <h4 className="font-semibold mb-2">Download</h4>
                <p className="text-sm text-muted-foreground">
                  Download, copy, or share your screenshot
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card className="capture-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Why Choose Our Screenshot Tool?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Advanced Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Up to 4K resolution screenshots</li>
                  <li>• Full page or viewport capture</li>
                  <li>• Multiple format support (PNG, JPG, WebP)</li>
                  <li>• Device simulation (Desktop, Mobile, Tablet)</li>
                  <li>• Dark mode and background removal</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Privacy & Performance</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Automatic ad and tracker blocking</li>
                  <li>• Cookie banner removal</li>
                  <li>• Fast API-powered capture</li>
                  <li>• No data storage or logging</li>
                  <li>• GDPR compliant processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;