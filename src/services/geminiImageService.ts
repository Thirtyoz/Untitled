import { GoogleGenAI } from '@google/genai';

export interface ImageGenerationOptions {
  prompt: string;
  sourceImageUrl?: string; // Optional: uploaded image to base the badge on
  onProgress?: (message: string) => void;
}

export interface ImageGenerationResult {
  dataUrl: string;
  mimeType: string;
}

/**
 * Generate an image using Gemini API
 * Returns a data URL that can be used directly in img src
 */
export async function generateBadgeImage(
  options: ImageGenerationOptions
): Promise<ImageGenerationResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured');
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const config = {
    responseModalities: ['IMAGE', 'TEXT'],
    imageConfig: {
      imageSize: '1K',
    },
  };

  const model = 'gemini-2.5-flash-image';

  // Build parts array based on whether source image is provided
  const parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [
    {
      text: options.prompt,
    },
  ];

  // If source image is provided, convert it to base64 and add to parts
  if (options.sourceImageUrl) {
    options.onProgress?.('업로드된 이미지 처리 중...');

    // Convert data URL or blob URL to base64
    const base64Data = await urlToBase64(options.sourceImageUrl);
    const mimeType = getMimeTypeFromDataUrl(options.sourceImageUrl);

    parts.push({
      inlineData: {
        mimeType: mimeType || 'image/png',
        data: base64Data,
      },
    });
  }

  const contents = [
    {
      role: 'user',
      parts,
    },
  ];

  options.onProgress?.('AI 이미지 생성을 시작합니다...');

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let imageData: string | null = null;
  let imageMimeType: string | null = null;

  for await (const chunk of response) {
    if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
      continue;
    }

    // Check for inline image data
    if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const inlineData = chunk.candidates[0].content.parts[0].inlineData;
      imageData = inlineData.data || null;
      imageMimeType = inlineData.mimeType || null;
      options.onProgress?.('이미지 생성 완료!');
    } else if (chunk.text) {
      // Handle text progress updates if any
      options.onProgress?.(chunk.text);
    }
  }

  if (!imageData || !imageMimeType) {
    throw new Error('Failed to generate image from Gemini API');
  }

  // Convert base64 to data URL for browser use
  const dataUrl = `data:${imageMimeType};base64,${imageData}`;

  return {
    dataUrl,
    mimeType: imageMimeType,
  };
}

/**
 * Helper function to create a badge prompt from user input
 */
export function createBadgePrompt(description: string, tags: string[], hasSourceImage: boolean = false): string {
  const tagText = tags.length > 0 ? tags.join(', ') : '';

  if (hasSourceImage) {
    return `Transform this photo into a 3D figurine-style travel souvenir magnet design.

Location/Theme: ${description}
Keywords: ${tagText}

Style requirements:
- Remove white borders and background completely (transparent or clean background)
- Create a cute, collectible figurine aesthetic (like miniature travel souvenirs)
- Add depth and 3D dimensionality to make it look like a physical object
- Maintain the essence of the scene but stylize it as a charming collectible item
- Vibrant, eye-catching colors
- NOT just a flat photo - transform it into an illustrated, figurine-like object
- Think: refrigerator magnet souvenir that tourists would buy
- IMPORTANT: DO NOT include any Korean text, letters, or characters in the image - use English or no text at all
- If there is Korean text in the source image, replace it with English or remove it completely

The final result should look like a premium travel souvenir magnet with character and charm.`;
  }

  return `Create a beautiful, artistic badge image for a location in Seoul, South Korea.
Description: ${description}
Theme/Tags: ${tagText}

The image should be aesthetic, visually appealing, and suitable as a collectible digital badge.
Style: Modern, clean, with vibrant colors suitable for mobile app display.
Format: Square or rounded square composition.
IMPORTANT: DO NOT include any Korean text, letters, or characters in the image - use English or no text at all.`;
}

/**
 * Convert image URL (data URL or blob URL) to base64 string
 */
async function urlToBase64(url: string): Promise<string> {
  // If it's already a data URL, extract the base64 part
  if (url.startsWith('data:')) {
    const base64Match = url.match(/base64,(.+)/);
    if (base64Match) {
      return base64Match[1];
    }
  }

  // For blob URLs or other URLs, fetch and convert to base64
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64Match = dataUrl.match(/base64,(.+)/);
      if (base64Match) {
        resolve(base64Match[1]);
      } else {
        reject(new Error('Failed to convert image to base64'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Get MIME type from data URL
 */
function getMimeTypeFromDataUrl(url: string): string | null {
  if (url.startsWith('data:')) {
    const match = url.match(/data:([^;]+);/);
    return match ? match[1] : null;
  }
  return null;
}
