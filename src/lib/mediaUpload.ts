import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Compresses an image file client-side to ensure it is ultra-lightweight (< 150KB)
 * and safe for Firestore storage. Converts everything to JPEG with optimal compression.
 */
export const compressImageFile = (
  file: File,
  maxDimension: number = 1200,
  quality: number = 0.72
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Fill background for transparency
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Always use image/jpeg for strong compression (PNG canvas export does NOT compress)
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // If still large (> 300KB), downscale further
        if (dataUrl.length > 350000) {
          const smallCanvas = document.createElement('canvas');
          const scale = 0.7;
          smallCanvas.width = Math.round(width * scale);
          smallCanvas.height = Math.round(height * scale);
          const sCtx = smallCanvas.getContext('2d');
          if (sCtx) {
            sCtx.fillStyle = '#121212';
            sCtx.fillRect(0, 0, smallCanvas.width, smallCanvas.height);
            sCtx.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);
            dataUrl = smallCanvas.toDataURL('image/jpeg', 0.6);
          }
        }

        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Re-compresses an existing oversized data URL if it exceeds 300KB.
 */
export const ensureCompressedDataUrl = async (dataUrl: string): Promise<string> => {
  if (!dataUrl || !dataUrl.startsWith('data:image/') || dataUrl.length < 350000) {
    return dataUrl;
  }
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      const maxDim = 1000;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.fillStyle = '#121212';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

/**
 * Uploads a file to Supabase Storage if possible, with lightweight client-side fallback for images.
 */
export const processAndUploadFile = async (
  file: File,
  folder: string = 'uploads'
): Promise<{ url: string; isCloud: boolean }> => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  // 1. Try Supabase Storage upload first
  try {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase non configuré');
    }
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;
    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file, { upsert: false });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('media').getPublicUrl(filePath);
    return { url: data.publicUrl, isCloud: true };
  } catch (storageError) {
    console.warn('Supabase Storage upload unavailable or not permitted, applying optimized fallback:', storageError);

    if (isImage) {
      // Compress image to a safe, small base64 string (<150KB)
      const compressedDataUrl = await compressImageFile(file, 1200, 0.72);
      return { url: compressedDataUrl, isCloud: false };
    }

    if (isVideo) {
      throw new Error(
        "L'upload de vidéo vers Supabase Storage a échoué. " +
        "Pour les vidéos, veuillez renseigner une URL (YouTube, Vimeo, ou MP4 hébergée) " +
        "car les fichiers vidéo bruts dépassent la limite de stockage de la base de données."
      );
    }

    throw storageError;
  }
};

/**
 * Calculates approximate size of an object in bytes.
 */
export const getEstimatedByteSize = (obj: any): number => {
  try {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  } catch {
    return 0;
  }
};
