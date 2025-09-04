import { useState } from 'react';
import { Settings, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

export interface ScreenshotConfig {
  viewport_width: number;
  viewport_height: number;
  device_scale_factor: number;
  format: 'png' | 'jpg' | 'webp';
  image_quality: number;
  full_page: boolean;
  block_ads: boolean;
  block_cookie_banners: boolean;
  delay: number;
  dark_mode: boolean;
  omit_background: boolean;
}

interface ScreenshotSettingsProps {
  config: ScreenshotConfig;
  onChange: (config: ScreenshotConfig) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const devicePresets = [
  { name: 'Desktop HD', width: 1920, height: 1080, icon: Monitor },
  { name: 'Desktop FHD', width: 1920, height: 1200, icon: Monitor },
  { name: 'Laptop', width: 1366, height: 768, icon: Monitor },
  { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  { name: 'Mobile', width: 375, height: 667, icon: Smartphone },
];

export const ScreenshotSettings = ({ config, onChange, isOpen, onToggle }: ScreenshotSettingsProps) => {
  const updateConfig = (updates: Partial<ScreenshotConfig>) => {
    onChange({ ...config, ...updates });
  };

  const setDevicePreset = (preset: typeof devicePresets[0]) => {
    updateConfig({
      viewport_width: preset.width,
      viewport_height: preset.height,
    });
  };

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={onToggle} className="mb-4">
        <Settings className="w-4 h-4 mr-2" />
        Advanced Settings
      </Button>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Screenshot Settings
            </CardTitle>
            <CardDescription>
              Customize your screenshot capture options
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onToggle}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Device Presets */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Device Presets</Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {devicePresets.map((preset) => (
              <Button
                key={preset.name}
                variant={
                  config.viewport_width === preset.width && 
                  config.viewport_height === preset.height ? "default" : "outline"
                }
                size="sm"
                onClick={() => setDevicePreset(preset)}
                className="flex flex-col items-center p-3 h-auto"
              >
                <preset.icon className="w-4 h-4 mb-1" />
                <span className="text-xs">{preset.name}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.width}×{preset.height}
                </span>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Viewport Settings */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Viewport Size
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
                  <Select 
                    value={config.viewport_width.toString()} 
                    onValueChange={(value) => updateConfig({ viewport_width: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920">1920px</SelectItem>
                      <SelectItem value="1366">1366px</SelectItem>
                      <SelectItem value="1280">1280px</SelectItem>
                      <SelectItem value="768">768px</SelectItem>
                      <SelectItem value="375">375px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
                  <Select 
                    value={config.viewport_height.toString()} 
                    onValueChange={(value) => updateConfig({ viewport_height: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080">1080px</SelectItem>
                      <SelectItem value="1200">1200px</SelectItem>
                      <SelectItem value="800">800px</SelectItem>
                      <SelectItem value="1024">1024px</SelectItem>
                      <SelectItem value="667">667px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Format and Quality */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Image Format</Label>
              <Select 
                value={config.format} 
                onValueChange={(value: 'png' | 'jpg' | 'webp') => updateConfig({ format: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG (Best Quality)</SelectItem>
                  <SelectItem value="jpg">JPG (Smaller Size)</SelectItem>
                  <SelectItem value="webp">WebP (Modern)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Image Quality */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Image Quality: {config.image_quality}%
              </Label>
              <Slider
                value={[config.image_quality]}
                onValueChange={(value) => updateConfig({ image_quality: value[0] })}
                max={100}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          {/* Capture Options */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-3 block">Capture Options</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Full Page</Label>
                    <p className="text-xs text-muted-foreground">Capture entire page height</p>
                  </div>
                  <Switch
                    checked={config.full_page}
                    onCheckedChange={(checked) => updateConfig({ full_page: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Force dark theme if available</p>
                  </div>
                  <Switch
                    checked={config.dark_mode}
                    onCheckedChange={(checked) => updateConfig({ dark_mode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Remove Background</Label>
                    <p className="text-xs text-muted-foreground">Transparent background</p>
                  </div>
                  <Switch
                    checked={config.omit_background}
                    onCheckedChange={(checked) => updateConfig({ omit_background: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Privacy Options */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Privacy & Performance
                <Badge variant="secondary" className="ml-2 text-xs">Recommended</Badge>
              </Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Block Ads</Label>
                    <p className="text-xs text-muted-foreground">Remove advertisements</p>
                  </div>
                  <Switch
                    checked={config.block_ads}
                    onCheckedChange={(checked) => updateConfig({ block_ads: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm">Block Cookie Banners</Label>
                    <p className="text-xs text-muted-foreground">Remove cookie notices</p>
                  </div>
                  <Switch
                    checked={config.block_cookie_banners}
                    onCheckedChange={(checked) => updateConfig({ block_cookie_banners: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Delay Setting */}
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Capture Delay: {config.delay}s
              </Label>
              <Slider
                value={[config.delay]}
                onValueChange={(value) => updateConfig({ delay: value[0] })}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Wait time before capturing (useful for animations)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};