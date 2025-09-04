interface ScreenshotOptions {
  url: string;
  viewport_width?: number;
  viewport_height?: number;
  device_scale_factor?: number;
  format?: 'png' | 'jpg' | 'webp';
  image_quality?: number;
  block_ads?: boolean;
  block_cookie_banners?: boolean;
  block_banners?: boolean;
  block_trackers?: boolean;
  delay?: number;
  timeout?: number;
  full_page?: boolean;
  omit_background?: boolean;
  dark_mode?: boolean;
  reduce_motion?: boolean;
}

export class ScreenshotOneAPI {
  private accessKey: string;
  private baseUrl = 'https://api.screenshotone.com/take';

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  generateScreenshotUrl(options: ScreenshotOptions): string {
    const params = new URLSearchParams();
    
    // Required parameters
    params.append('access_key', this.accessKey);
    params.append('url', options.url);
    
    // Optional parameters with defaults optimized for high quality
    params.append('viewport_width', (options.viewport_width || 1920).toString());
    params.append('viewport_height', (options.viewport_height || 1080).toString());
    params.append('device_scale_factor', (options.device_scale_factor || 2).toString());
    params.append('format', options.format || 'png');
    params.append('image_quality', (options.image_quality || 100).toString());
    
    // Privacy and performance options
    if (options.block_ads !== false) params.append('block_ads', 'true');
    if (options.block_cookie_banners !== false) params.append('block_cookie_banners', 'true');
    if (options.block_banners !== false) params.append('block_banners', 'true');
    if (options.block_trackers !== false) params.append('block_trackers', 'true');
    
    // Timing options
    params.append('delay', (options.delay || 0).toString());
    params.append('timeout', (options.timeout || 60).toString());
    
    // Page options
    if (options.full_page !== false) params.append('full_page', 'true');
    if (options.omit_background) params.append('omit_background', 'true');
    if (options.dark_mode) params.append('dark_mode', 'true');
    if (options.reduce_motion) params.append('reduce_motion', 'true');

    return `${this.baseUrl}?${params.toString()}`;
  }

  async takeScreenshot(options: ScreenshotOptions): Promise<Blob> {
    const screenshotUrl = this.generateScreenshotUrl(options);
    
    const response = await fetch(screenshotUrl);
    
    if (!response.ok) {
      throw new Error(`Screenshot failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.blob();
  }

  async takeScreenshotAsDataUrl(options: ScreenshotOptions): Promise<string> {
    const blob = await this.takeScreenshot(options);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Demo access key - replace with your actual ScreenshotOne access key
export const screenshotOne = new ScreenshotOneAPI('YWNjZXNzX2tleQ');