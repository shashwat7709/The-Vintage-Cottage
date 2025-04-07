import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import ImageUploader from './ImageUploader';

interface SellItemFormProps {
  onSubmit: (formData: {
    name: string;
    email: string;
    title: string;
    description: string;
    address: string;
    phone: string;
    price: string;
    currency: string;
    images?: FileList;
  }) => void;
}

const SellItemForm: React.FC<SellItemFormProps> = ({ onSubmit }) => {
  const { categories } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    address: '',
    phone: '',
    price: '',
  });
  const [phoneCode, setPhoneCode] = useState('+1');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState('');

  const countryCodes = [
    { code: '+1', country: 'USA/Canada', currency: 'USD' },
    { code: '+44', country: 'UK', currency: 'GBP' },
    { code: '+61', country: 'Australia', currency: 'AUD' },
    { code: '+91', country: 'India', currency: 'INR' },
    { code: '+86', country: 'China', currency: 'CNY' },
    { code: '+81', country: 'Japan', currency: 'JPY' },
    { code: '+49', country: 'Germany', currency: 'EUR' },
    { code: '+33', country: 'France', currency: 'EUR' },
  ];

  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    GBP: '£',
    AUD: 'A$',
    INR: '₹',
    CNY: '¥',
    JPY: '¥',
    EUR: '€'
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return false;
    }
    return true;
  };

  const handlePhoneCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    setPhoneCode(selectedCode);
    // Automatically update currency based on selected country
    const selectedCountry = countryCodes.find(country => country.code === selectedCode);
    if (selectedCountry) {
      setCurrency(selectedCountry.currency);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('name', formData.name);
    submitFormData.append('email', formData.email);
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('price', formData.price);
    submitFormData.append('currency', currency);
    submitFormData.append('address', formData.address);
    
    const phoneInput = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
    if (phoneInput && phoneInput.value) {
      submitFormData.append('phone', `${phoneCode}${phoneInput.value}`);
    }

    onSubmit({ ...formData, currency });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-[#46392d] mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-[#46392d] mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
          required
        />
      </div>

      <div>
        <label htmlFor="title" className="block text-[#46392d] mb-2">
          Item Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter the title of your antique item"
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
          placeholder="Describe your item's history, condition, and unique features"
          rows={4}
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] resize-none"
          required
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-[#46392d] mb-2">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter your complete address"
          rows={3}
          className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] resize-none"
          required
        />
        <p className="text-sm text-[#46392d]/70 mt-1">
          This address will be used for item pickup/inspection if needed
        </p>
      </div>

      <div>
        <label htmlFor="phone" className="block text-[#46392d] mb-2">
          Contact Phone Number
        </label>
        <div className="flex gap-4">
          <select
            value={phoneCode}
            onChange={handlePhoneCodeChange}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] bg-white"
          >
            {countryCodes.map(({ code, country }) => (
              <option key={code} value={code}>
                {code} {country}
              </option>
            ))}
          </select>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
            required
          />
        </div>
        <p className="text-sm text-[#46392d]/70 mt-1">
          Please enter a valid phone number without spaces or special characters
        </p>
      </div>

      <div>
        <label htmlFor="price" className="block text-[#46392d] mb-2">
          Asking Price
        </label>
        <div className="flex gap-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d] bg-white"
          >
            {Object.entries(currencySymbols).map(([code, symbol]) => (
              <option key={code} value={code}>
                {symbol} {code}
              </option>
            ))}
          </select>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
            placeholder={`Enter price in ${currency}`}
          min="0"
          step="0.01"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d] text-[#46392d]"
            required
        />
      </div>
      </div>

      <div>
        <label className="block text-[#46392d] mb-2">
          Item Images
        </label>
        <ImageUploader onImageSelect={handleImageSelect} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {formData.images?.length && formData.images.map((image, index) => (
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
        className="w-full bg-[#46392d] text-white py-3 rounded-md hover:bg-[#5c4b3d] transition-colors font-medium"
      >
        Submit Item for Review
      </button>

      <p className="text-sm text-[#46392d]/70 text-center mt-4">
        Our team will review your submission and contact you within 2-3 business days.
      </p>
    </form>
  );
};

export default SellItemForm; 