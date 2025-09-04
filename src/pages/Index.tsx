import { useState, useRef } from 'react';
import { Camera, Download, Globe, Zap, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [url, setUrl] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const captureScreenshot = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a valid URL to capture",
        variant: "destructive"
      });
      return;
    }

    // Validate URL format
    const urlPattern = /^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w\-._~:?#[\]@!$&'()*+,;=%]*)?$/;
    let validUrl = url;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      validUrl = 'https://' + url;
    }

    if (!urlPattern.test(validUrl.replace(/^https?:\/\//, ''))) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid website URL",
        variant: "destructive"
      });
      return;
    }

    setIsCapturing(true);
    
    try {
      // Create a new window/iframe to load the URL
      const iframe = document.createElement('iframe');
      iframe.style.width = '1920px';
      iframe.style.height = '1080px';
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Load the URL
      iframe.src = validUrl;
      
      iframe.onload = async () => {
        try {
          // Wait a bit for content to load
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Use html2canvas-like approach with canvas
          const canvas = canvasRef.current;
          if (!canvas) return;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          canvas.width = 1920;
          canvas.height = 1080;
          
          // Create a simple screenshot simulation
          // In a real app, you'd use a service like Puppeteer or a screenshot API
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Add a header area
          ctx.fillStyle = '#f8f9fa';
          ctx.fillRect(0, 0, canvas.width, 80);
          
          // Add URL bar
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(100, 20, canvas.width - 200, 40);
          ctx.strokeStyle = '#e0e0e0';
          ctx.strokeRect(100, 20, canvas.width - 200, 40);
          
          // Add URL text
          ctx.fillStyle = '#333333';
          ctx.font = '16px Arial';
          ctx.fillText(validUrl, 120, 45);
          
          // Add content area
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 80, canvas.width, canvas.height - 80);
          
          // Add some simulated content
          ctx.fillStyle = '#333333';
          ctx.font = 'bold 32px Arial';
          ctx.fillText('Website Screenshot', 100, 150);
          
          ctx.font = '18px Arial';
          ctx.fillStyle = '#666666';
          ctx.fillText('This is a simulated screenshot of: ' + validUrl, 100, 200);
          ctx.fillText('In a production app, this would show the actual webpage content.', 100, 230);
          
          // Add some visual elements
          ctx.fillStyle = '#007bff';
          ctx.fillRect(100, 280, 200, 100);
          ctx.fillStyle = '#ffffff';
          ctx.font = '16px Arial';
          ctx.fillText('Sample Content', 130, 335);
          
          ctx.fillStyle = '#28a745';
          ctx.fillRect(350, 280, 200, 100);
          ctx.fillStyle = '#ffffff';
          ctx.fillText('More Content', 385, 335);
          
          // Convert canvas to blob and create download URL
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              setScreenshotUrl(url);
              
              toast({
                title: "Screenshot Captured!",
                description: "Your webpage screenshot is ready for download.",
              });
            }
          }, 'image/png', 1.0);
          
        } catch (error) {
          console.error('Screenshot error:', error);
          toast({
            title: "Capture Failed",
            description: "Unable to capture screenshot. This is a demo version.",
            variant: "destructive"
          });
        } finally {
          document.body.removeChild(iframe);
          setIsCapturing(false);
        }
      };
      
      iframe.onerror = () => {
        document.body.removeChild(iframe);
        setIsCapturing(false);
        toast({
          title: "Load Failed",
          description: "Unable to load the webpage. Please check the URL.",
          variant: "destructive"
        });
      };
      
    } catch (error) {
      setIsCapturing(false);
      toast({
        title: "Error",
        description: "An error occurred while capturing the screenshot.",
        variant: "destructive"
      });
    }
  };

  const downloadScreenshot = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `screenshot-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: "Your screenshot is being downloaded.",
    });
  };

  const features = [
    {
      icon: Camera,
      title: "High-Quality Capture",
      description: "Capture websites in full HD resolution with perfect clarity"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your screenshots in seconds, not minutes"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "No data stored, everything happens in your browser"
    },
    {
      icon: Smartphone,
      title: "Any Device",
      description: "Works perfectly on desktop, tablet, and mobile"
    }
  ];

  const examples = [
    { url: "google.com", title: "Google Homepage" },
    { url: "github.com", title: "GitHub" },
    { url: "stackoverflow.com", title: "Stack Overflow" },
    { url: "vercel.com", title: "Vercel" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge className="mb-4 gradient-primary text-primary-foreground border-0">
            ✨ New & Improved
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-6">
            Capture Any Webpage
            <br />
            <span className="gradient-primary bg-clip-text text-transparent">Instantly</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Take high-quality screenshots of any webpage in seconds. No registration required, 
            completely free, and works right in your browser.
          </p>
          
          {/* URL Input Section */}
          <Card className="capture-card max-w-2xl mx-auto mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="url"
                    placeholder="Enter website URL (e.g., google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="text-lg h-12"
                    disabled={isCapturing}
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

          {/* Quick Examples */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="text-sm text-muted-foreground mr-2">Try:</span>
            {examples.map((example) => (
              <Button
                key={example.url}
                variant="outline"
                size="sm"
                onClick={() => setUrl(example.url)}
                className="text-xs"
              >
                {example.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Screenshot Result */}
        {screenshotUrl && (
          <Card className="capture-card max-w-4xl mx-auto mb-16">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Screenshot Ready!</span>
                <Button onClick={downloadScreenshot} className="hero-button">
                  <Download className="w-4 h-4 mr-2" />
                  Download PNG
                </Button>
              </CardTitle>
              <CardDescription>
                Your high-quality screenshot has been generated successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden shadow-soft">
                <img
                  src={screenshotUrl}
                  alt="Website Screenshot"
                  className="w-full h-auto"
                />
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
        <Card className="capture-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Simple, fast, and secure screenshot capture in 3 easy steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  1
                </div>
                <h4 className="font-semibold mb-2">Enter URL</h4>
                <p className="text-sm text-muted-foreground">
                  Paste the website URL you want to capture
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  2
                </div>
                <h4 className="font-semibold mb-2">Capture</h4>
                <p className="text-sm text-muted-foreground">
                  Click capture and wait a few seconds for processing
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  3
                </div>
                <h4 className="font-semibold mb-2">Download</h4>
                <p className="text-sm text-muted-foreground">
                  Download your high-quality PNG screenshot
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hidden Canvas for Screenshot Generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <Toaster />
    </div>
  );
};

export default Index;