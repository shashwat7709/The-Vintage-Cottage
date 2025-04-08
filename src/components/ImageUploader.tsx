import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (base64Strings: string[]) => void;
  maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, maxImages = 5 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array for easier handling
    const fileArray = Array.from(files);

    // Validate file types
    const invalidFiles = fileArray.filter(file => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Please upload only image files');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = fileArray.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError('Each image must be less than 5MB');
      return;
    }

    // Process each file
    Promise.all(
      fileArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });
      })
    )
      .then(base64Strings => {
        setError('');
        onImageSelect(base64Strings);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      })
      .catch(() => {
        setError('Failed to process one or more images');
      });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <div className="flex flex-col items-center justify-center w-full">
        <label 
          htmlFor="image-upload"
          className="w-full flex flex-col items-center justify-center px-4 py-6 bg-white text-[#46392d] rounded-lg shadow-lg tracking-wide border border-[#46392d]/20 cursor-pointer hover:bg-[#46392d]/5 transition-colors duration-300"
        >
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base">Select images</span>
          <p className="text-sm text-gray-500 mt-1">
            Upload up to {maxImages} images (max 5MB each)
          </p>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUploader; 