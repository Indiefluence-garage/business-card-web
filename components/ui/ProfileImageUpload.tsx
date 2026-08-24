'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Camera, Trash2, Upload, X, Loader2 } from 'lucide-react';
import { Button } from './button';
import { userService } from '@/lib/services/user.service';

interface ProfileImageUploadProps {
  currentImageUrl?: string | null;
  userInitials?: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onDeleteSuccess?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showHelperText?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function ProfileImageUpload({
  currentImageUrl,
  userInitials = '??',
  onUploadSuccess,
  onDeleteSuccess,
  className = '',
  size = 'md',
  showHelperText = true,
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'h-16 w-16 text-xl',
    md: 'h-24 w-24 text-3xl',
    lg: 'h-32 w-32 text-4xl',
  };

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 5MB limit. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only JPG, PNG, and WebP images are allowed.';
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return 'Invalid file extension. Use .jpg, .jpeg, .png, or .webp';
    }

    return null;
  };

  const handleFileSelect = async (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setUploading(true);
      const response = await userService.uploadProfileImage(file);

      let imageUrl: string | null = null;
      if (response?.data && typeof response.data === 'object') {
        const dataObj = response.data as Record<string, unknown>;
        if ('imageUrl' in dataObj && typeof dataObj.imageUrl === 'string') {
          imageUrl = dataObj.imageUrl;
        } else if ('user' in dataObj && dataObj.user && typeof dataObj.user === 'object') {
          const userObj = dataObj.user as Record<string, unknown>;
          if (typeof userObj.imageUrl === 'string') {
            imageUrl = userObj.imageUrl;
          }
        }
      }

      if (imageUrl && onUploadSuccess) {
        onUploadSuccess(imageUrl);
      }

      setPreview(null);
      setError(null);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } }; message?: string };
      setError(apiErr.response?.data?.error || apiErr.message || 'Failed to upload image. Please try again.');
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
      await userService.deleteProfileImage();

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      setShowDeleteConfirm(false);
      setError(null);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } }; message?: string };
      setError(apiErr.response?.data?.error || apiErr.message || 'Failed to delete image. Please try again.');
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

  const displayImage = preview || currentImageUrl;

  return (
    <div className={`relative inline-block w-fit shrink-0 ${className}`}>
      {/* Main Image Display */}
      <div
        className={`relative group ${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden transition-all duration-300 ring-2 ring-border hover:ring-primary/50 shrink-0 ${
          isDragging ? 'ring-4 ring-primary ring-offset-2 scale-105' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {displayImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <span>{userInitials}</span>
        )}

        {(uploading || deleting) && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

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

        {isDragging && (
          <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
            <Upload className="h-8 w-8 text-white" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute -bottom-1 -right-1 flex gap-1">
        <label
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white cursor-pointer hover:bg-primary/90 transition-colors shadow-lg ${
            uploading || deleting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Upload profile image"
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

        {currentImageUrl && !preview && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={uploading || deleting}
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-white hover:bg-destructive/90 transition-colors shadow-lg ${
              uploading || deleting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Delete profile image"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-destructive/10 border border-destructive/20 rounded-xl p-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
            <h3 className="text-lg font-bold font-display text-foreground mb-2">Delete Profile Photo?</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Are you sure you want to remove your profile photo? Your avatar will revert to your initials.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl text-xs font-bold"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Photo'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showHelperText && (
        <div className="mt-2 text-center text-xs leading-5 text-muted-foreground">
          <p>{isDragging ? 'Drop to upload' : 'Click or drag to upload'}</p>
          <p className="text-[10px]">Max 5MB • JPG, PNG, WebP</p>
        </div>
      )}
    </div>
  );
}
