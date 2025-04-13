import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ImageUploader from './ImageUploader';

interface SellItemFormProps {
  onSubmit: (formData: FormData) => void;
}

const SellItemForm: React.FC<SellItemFormProps> = ({ onSubmit }) => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [] as string[],
    address: '',
  });
  const [phoneCode, setPhoneCode] = useState('+1');
  const [error, setError] = useState('');

  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+91', country: 'India' },
    { code: '+86', country: 'China' },
    { code: '+81', country: 'Japan' },
    { code: '+49', country: 'Germany' },
    { code: '+33', country: 'France' },
    { code: '+7', country: 'Russia' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+82', country: 'South Korea' },
    { code: '+65', country: 'Singapore' },
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+27', country: 'South Africa' },
    { code: '+64', country: 'New Zealand' },
    { code: '+31', country: 'Netherlands' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user makes changes
  };

  const handleImageSelect = (base64String: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, base64String]
    }));
    setError(''); // Clear error when image is selected
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please enter a title');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('price', formData.price);
    submitFormData.append('category', formData.category);
    submitFormData.append('images', JSON.stringify(formData.images));
    submitFormData.append('address', formData.address);
    
    const phoneInput = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
    if (phoneInput && phoneInput.value) {
      submitFormData.append('phone', `${phoneCode}${phoneInput.value}`);
    }

    onSubmit(submitFormData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-[#46392d] mb-1">
          Item Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter the title of your antique item"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-[#46392d] mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Describe your item's history, condition, and unique features"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#46392d] mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter your complete address"
        />
        <p className="text-sm text-[#46392d]/70 mt-1">
          This address will be used for item pickup/inspection if needed
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#46392d] mb-1">
          Contact Phone Number
        </label>
        <div className="flex gap-2">
          <select
            value={phoneCode}
            onChange={(e) => setPhoneCode(e.target.value)}
            className="px-3 py-2 rounded-md border border-[#46392d]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#46392d]/50 appearance-none cursor-pointer min-w-[180px]"
            style={{ WebkitAppearance: 'menulist' }}
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code} className="py-1">
                {code} {country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            pattern="[0-9]{10}"
            className="flex-1 px-4 py-2 rounded-md border border-[#46392d]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
            placeholder="Enter your phone number"
          />
        </div>
        <p className="text-sm text-[#46392d]/70 mt-1">
          Please enter a valid phone number without spaces or special characters
        </p>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-[#46392d] mb-1">
          Asking Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
          placeholder="Enter your asking price"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-[#46392d] mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] bg-white"
        >
          <option value="">Select a category</option>
          {categories
            .filter(category => category !== 'All')
            .map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#46392d] mb-1">
          Item Images
        </label>
        <ImageUploader onImageSelect={handleImageSelect} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-contain rounded-md border border-[#46392d]/20"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <p className="mt-1 text-sm text-[#46392d]/70">
          Please provide clear, well-lit photos of your item from multiple angles
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors duration-300 font-serif text-lg"
      >
        Submit for Review
      </button>

      <p className="text-sm text-[#46392d]/70 text-center mt-4">
        Our team will review your submission and contact you within 2-3 business days.
      </p>
    </form>
  );
};

export default SellItemForm; 