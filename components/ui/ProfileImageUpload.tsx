'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Camera, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { userService } from '@/lib/services/user.service';

interface ProfileImageUploadProps {
  image?: string | null;
  userInitials?: string;
  onUploadSuccess?: (image: string) => void;
  onDeleteSuccess?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function ProfileImageUpload({
  image,
  userInitials = '??',
  onUploadSuccess,
  onDeleteSuccess,
  className = '',
  size = 'md',
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size configurations
  const sizeClasses = {
    sm: 'h-16 w-16 text-xl',
    md: 'h-24 w-24 text-3xl',
    lg: 'h-32 w-32 text-4xl',
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed.';
    }

    // Check file extension
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Invalid file extension. Use .jpg, .jpeg, .png, or .webp';
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      setUploading(true);
      console.log('🖼️ [PROFILE IMAGE] Uploading:', file.name);

      const response = await userService.uploadProfileImage(file);
      console.log('✅ [PROFILE IMAGE] Upload success:', response);

      let imageRes: string | null = null;
      if (response?.data && typeof response.data === 'object') {
        if ('imageUrl' in response.data) {
          imageRes = (response.data as any).imageUrl;
        } else if ('user' in response.data && (response.data as any).user?.imageUrl) {
          imageRes = (response.data as any).user.imageUrl;
        }
      }

      if (imageRes && onUploadSuccess) {
        onUploadSuccess(imageRes);
      }

      setPreview(null);
      setError(null);
    } catch (err: any) {
      console.error('❌ [PROFILE IMAGE] Upload failed:', err);
      setError(err.response?.data?.error || err.message || 'Failed to upload image. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      console.log('🗑️ [PROFILE IMAGE] Deleting...');

      await userService.deleteProfileImage();
      console.log('✅ [PROFILE IMAGE] Delete success');

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      setShowDeleteConfirm(false);
      setError(null);
    } catch (err: any) {
      console.error('❌ [PROFILE IMAGE] Delete failed:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete image. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelPreview = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = preview || image;

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div
        className={`relative group ${sizeClasses[size]} rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden transition-all ${isDragging ? 'ring-4 ring-primary ring-offset-2' : ''
          }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Image or Initials */}
        {displayImage ? (
          <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <span>{userInitials}</span>
        )}

        {/* Loading Overlay */}
        {(uploading || deleting) && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {/* Preview Overlay */}
        {preview && !uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/20"
              onClick={handleCancelPreview}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Drag & Drop Hint */}
        {isDragging && (
          <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
            <Upload className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-1 -right-1 flex gap-1">
        {/* Upload Button */}
        <label
          className={`bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg ${uploading || deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          <Camera className="h-4 w-4" />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleInputChange}
            disabled={uploading || deleting}
          />
        </label>

        {/* Delete Button */}
        {image && !preview && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={uploading || deleting}
            className={`bg-destructive text-white p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-lg ${uploading || deleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-destructive/10 border border-destructive/20 rounded-md p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold mb-2">Delete Profile Image?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete your profile image? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground text-center mt-2">
        {isDragging ? 'Drop to upload' : 'Click or drag to upload'}
      </p>
      <p className="text-xs text-muted-foreground text-center">
        Max 5MB • JPG, PNG, WebP
      </p>
    </div>
  );
}
