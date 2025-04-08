import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ImageUploader from './ImageUploader';

interface FormData {
  title: string;
  description: string;
  price: string;
  category: string;
  images: string[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  price: '',
  category: '',
  images: []
};

const SellItemForm: React.FC = () => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price to ensure valid INR amount
    if (name === 'price') {
      // Remove any non-numeric characters except decimal point
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      // Ensure only two decimal places
      const parts = numericValue.split('.');
      if (parts.length > 1) {
        parts[1] = parts[1].slice(0, 2);
        const formattedValue = parts.join('.');
        setFormData(prev => ({
          ...prev,
          [name]: formattedValue
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageSelect = (base64Strings: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: base64Strings
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price
      const priceValue = parseFloat(formData.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        throw new Error('Please enter a valid price amount');
      }
      if (priceValue > 10000000) { // 1 crore limit
        throw new Error('Price cannot exceed ₹1,00,00,000');
      }

      if (formData.images.length === 0) {
        throw new Error('Please upload at least one image');
      }

      // Format price to always have two decimal places for API
      const formattedData = {
        ...formData,
        price: parseFloat(formData.price).toFixed(2)
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      // Reset form after successful submission
      setFormData(initialFormData);
      alert('Product submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46392d] focus:ring-[#46392d] sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46392d] focus:ring-[#46392d] sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price (₹) *
        </label>
        <div className="relative mt-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46392d] focus:ring-[#46392d] sm:text-sm"
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">Enter amount in Indian Rupees (₹)</p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#46392d] focus:ring-[#46392d] sm:text-sm"
          required
        >
          <option value="">Select a category</option>
          <option value="furniture">Furniture</option>
          <option value="jewelry">Jewelry</option>
          <option value="art">Art</option>
          <option value="collectibles">Collectibles</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images *
        </label>
        <ImageUploader onImageSelect={handleImageSelect} maxImages={5} />
        {formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#46392d] hover:bg-[#46392d]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#46392d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default SellItemForm; 