import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface AddProductFormProps {
  onSubmit: (formData: FormData) => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Vintage Furniture',
  });
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState('');

  const categories = [
    'Vintage Furniture',
    'Antique Decor',
    'Collectibles',
    'Art & Paintings',
    'Vintage Clothing',
    'Jewelry & Accessories'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Convert FileList to Array and filter for images only
      const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
      
      if (newImages.length === 0) {
        setError('Please select valid image files (PNG, JPG, JPEG, etc.)');
        return;
      }

      // Create object URLs for previews
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      
      // Update images and previews
      setImages(prev => [...prev, ...newImages]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Reset file input to allow selecting the same files again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).filter(file => file.type.startsWith('image/'));
      if (newImages.length === 0) {
        setError('Please select valid image files (PNG, JPG, JPEG, etc.)');
        return;
      }
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Please enter a product title');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a product description');
      return;
    }
    if (!formData.price.trim()) {
      setError('Please enter a price');
      return;
    }
    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('price', formData.price);
    submitFormData.append('category', formData.category);
    
    // Append all images with the same field name
    images.forEach(image => {
      submitFormData.append('images', image);
    });

    onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-[#46392d] mb-2">
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-[#46392d] mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] resize-none"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-[#46392d] mb-2">
          Price (₹)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price in INR"
          min="0"
          step="0.01"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
          required
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-[#46392d] mb-2">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] bg-white"
          required
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[#46392d] mb-2">
          Product Images
        </label>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full"
            >
              <label className="flex-1">
                <div className="w-full px-4 py-8 border-2 border-dashed border-gray-200 rounded-md hover:border-[#46392d] transition-colors cursor-pointer text-center group">
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-10 w-10 mx-auto text-gray-400 group-hover:text-[#46392d] transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <div className="text-[#46392d]">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-sm text-gray-500">
                      Support for multiple images (PNG, JPG, JPEG)
                    </p>
                    {previewUrls.length > 0 && (
                      <p className="text-sm font-medium text-[#46392d]">
                        Click or drop to add more images
                      </p>
                    )}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {previewUrls.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <motion.div
                    key={url}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-square"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {previewUrls.length} image{previewUrls.length !== 1 ? 's' : ''} selected
              </p>
            </>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#46392d] text-white py-3 rounded-md hover:bg-[#5c4b3d] transition-colors font-medium"
      >
        Add Product
      </button>
    </form>
  );
};

export default AddProductForm; 