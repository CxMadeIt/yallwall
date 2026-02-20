"use client";

import { useState, useCallback } from 'react';
import { createClientClient } from '@/lib/supabase';

interface UseImageUploadReturn {
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  uploadImage: (file: File) => Promise<string | null>;
  compressImage: (file: File, maxWidth?: number, maxHeight?: number, quality?: number) => Promise<File>;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function useImageUpload(): UseImageUploadReturn {
  const supabase = createClientClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Compress an image file before upload
   */
  const compressImage = useCallback(async (
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 1200,
    quality: number = 0.8
  ): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Could not compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Could not load image'));
      };
      reader.onerror = () => reject(new Error('Could not read file'));
    });
  }, []);

  /**
   * Upload an image to Supabase Storage
   */
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    setError(null);
    setUploadProgress(0);

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload JPEG, PNG, WebP, or GIF.');
      return null;
    }

    // Check file size
    let fileToUpload = file;
    if (file.size > MAX_FILE_SIZE) {
      try {
        fileToUpload = await compressImage(file);
        // Check if compression was enough
        if (fileToUpload.size > MAX_FILE_SIZE) {
          setError('Image is too large. Maximum size is 2MB.');
          return null;
        }
      } catch (err) {
        setError('Failed to compress image. Please try a smaller image.');
        return null;
      }
    }

    setIsUploading(true);

    try {
      // Generate unique filename
      const fileExt = fileToUpload.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `message-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('message-images')
        .upload(filePath, fileToUpload, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('message-images')
        .getPublicUrl(filePath);

      setUploadProgress(100);
      return publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [supabase, compressImage]);

  return {
    isUploading,
    uploadProgress,
    error,
    uploadImage,
    compressImage,
  };
}
