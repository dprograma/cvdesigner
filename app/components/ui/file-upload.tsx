'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import Image from 'next/image';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept: Record<string, string[]>;
  maxSize?: number;
  label?: string;
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload a file',
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        if (selectedFile.size > maxSize) {
          setError(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
          return;
        }

        setFile(selectedFile);
        onFileSelect(selectedFile);

        // Create preview for images
        if (selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else if (selectedFile.type === 'application/pdf') {
          setPreview('/pdf-icon.svg'); // You'll need to add this icon to your public folder
        }
      }
    },
    [maxSize, onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-gray-500">Drag & drop or click to browse</p>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4">
          <div className="flex items-center space-x-4">
            {preview && (
              <div className="h-16 w-16 overflow-hidden rounded border relative">
                <Image
                  src={preview}
                  alt="Preview"
                  fill={true}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
