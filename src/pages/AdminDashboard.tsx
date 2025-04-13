import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import type { AntiqueSubmission } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationIcon from '../components/NotificationIcon';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  subject: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    products, 
    categories, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    submissions,
    updateSubmission,
    deleteSubmission,
    offers,
    updateOffer,
    deleteOffer
  } = useProducts();

  // Debug logging
  useEffect(() => {
    console.log('Products received in AdminDashboard:', products);
    console.log('Categories received:', categories);
  }, [products, categories]);

  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'products' | 'submissions' | 'offers'>('products');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editForm, setEditForm] = useState<Product>({
    id: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    images: [],
    subject: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  // Move filteredProducts inside the component
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  console.log('AdminDashboard - Selected category:', selectedCategory);
  console.log('AdminDashboard - Filtered products:', filteredProducts);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    console.log('AdminDashboard - Admin token:', token);
    if (!token) {
      console.log('AdminDashboard - No admin token found, redirecting to login');
      navigate('/admin/login');
    }
  }, [navigate]);

  // Reset currentImageIndex when switching tabs
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [activeTab]);

  const validateForm = () => {
    if (!editForm.title.trim()) {
      setFormError('Title is required');
      return false;
    }
    if (!editForm.subject.trim()) {
      setFormError('Subject is required');
      return false;
    }
    if (!editForm.description.trim()) {
      setFormError('Description is required');
      return false;
    }
    if (!editForm.price || editForm.price <= 0) {
      setFormError('Price must be greater than 0');
      return false;
    }
    if (!editForm.category) {
      setFormError('Category is required');
      return false;
    }
    if (editForm.images.length === 0) {
      setFormError('At least one image is required');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files);
    
    if (editForm.images.length + filesArray.length > 3) {
      setFormError('Maximum 3 images allowed');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    filesArray.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setFormError('Please upload only image files');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Each image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
        setFormError('');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setEditForm(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  // Remove localStorage related effects
  useEffect(() => {
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
  }, []);

  // Add error boundary effect
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Error caught by error boundary:', event.error);
      setFormError('An error occurred. Please try again.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const handleNewProduct = () => {
    setEditForm({
      id: '',
      title: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      subject: ''
    });
    setFormError('');
    setIsEditing('new');
    setShowForm(true);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      const productData = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        price: Number(editForm.price),
        category: editForm.category,
        images: [...editForm.images],
        subject: editForm.subject.trim()
      };

      if (isEditing === 'new') {
        addProduct(productData);
        addNotification('Product added successfully!', 'success', true);
      } else {
        updateProduct({
          ...productData,
          id: editForm.id
        });
        addNotification('Product updated successfully!', 'success', true);
      }

      // Reset states
      setEditForm({
        id: '',
        title: '',
        description: '',
        price: 0,
        category: '',
        images: [],
        subject: ''
      });
      setIsEditing(null);
      setShowForm(false);
      setFormError('');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSelectedCategory('All');
    } catch (error) {
      console.error('Error saving product:', error);
      setFormError('Error saving product. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditForm({
      id: '',
      title: '',
      description: '',
      price: 0,
      category: '',
      images: [],
      subject: ''
    });
    setIsEditing(null);
    setShowForm(false);
    setFormError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (product: Product) => {
    setEditForm({
      id: product.id,
      title: product.title || '',
      description: product.description || '',
      price: Number(product.price) || 0,
      category: product.category || '',
      images: Array.isArray(product.images) ? [...product.images] : [],
      subject: product.subject || ''
    });
    setIsEditing(product.id);
    setShowForm(true);
    setFormError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  // Add error recovery for edit form
  useEffect(() => {
    if (isEditing && !editForm.id) {
      // If we're editing but have no form data, try to recover
      const product = products.find(p => p.id === isEditing);
      if (product) {
        setEditForm({
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          price: Number(product.price) || 0,
          category: product.category || '',
          images: Array.isArray(product.images) ? [...product.images] : [],
          subject: product.subject || ''
        });
      } else {
        // If we can't recover, reset editing state
        setIsEditing(null);
        setFormError('');
      }
    }
  }, [isEditing, editForm.id, products]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleApproveSubmission = (submission: AntiqueSubmission) => {
    // Update submission status only
    updateSubmission({
      ...submission,
      status: 'approved'
    });

    addNotification(`Submission "${submission.title}" has been approved. You can now add it to the shop from the Products tab.`, 'success', true);
    // Add notification for the user
    addNotification(`Your submission "${submission.title}" has been approved! The admin can now add it to the shop.`, 'success', false);
  };

  const handleRejectSubmission = (submission: AntiqueSubmission) => {
    updateSubmission({
      ...submission,
      status: 'rejected'
    });

    addNotification(`Submission "${submission.title}" has been rejected.`, 'info', true);
    // Add notification for the user
    addNotification(`Your submission "${submission.title}" has been rejected. Please contact us for more information.`, 'error', false);
  };

  const handleAddToShop = (submission: AntiqueSubmission) => {
    addProduct({
      title: submission.title,
      description: submission.description,
      price: submission.price,
      category: submission.category,
      images: submission.images,
      subject: submission.subject
    });
    addNotification(`"${submission.title}" has been added to the shop.`, 'success', true);
    addNotification(`Your item "${submission.title}" is now available in the shop!`, 'success', false);
  };

  const handlePrevImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleApproveOffer = (offer: any) => {
    const product = products.find(p => p.id === offer.productId);
    if (!product) return;

    updateOffer({
      ...offer,
      status: 'approved'
    });

    addNotification(`Offer for "${product.title}" has been approved.`, 'success', true);
    addNotification(`Your offer for "${product.title}" has been approved!`, 'success', false);
  };

  const handleRejectOffer = (offer: any) => {
    const product = products.find(p => p.id === offer.productId);
    if (!product) return;

    updateOffer({
      ...offer,
      status: 'rejected'
    });

    addNotification(`Offer for "${product.title}" has been rejected.`, 'info', true);
    addNotification(`Your offer for "${product.title}" has been rejected.`, 'error', false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedImages(filesArray);
      
      // Create preview URLs for all selected images
      const urls = filesArray.map(file => URL.createObjectURL(file));
      setImageUrls(urls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('subject', subject);

    try {
      const uploadedImageUrls: string[] = [];
      
      // Upload each image and collect their URLs
      for (const imageFile of selectedImages) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });
        
        if (!response.ok) throw new Error('Image upload failed');
        
        const data = await response.json();
        uploadedImageUrls.push(data.imageUrl);
      }

      const newProduct: Omit<Product, 'id'> = {
        title,
        description,
        price: parseFloat(price),
        category,
        images: uploadedImageUrls,
        subject,
      };

      addProduct(newProduct);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSubject('');
      setSelectedImages([]);
      setImageUrls([]);

    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  const toggleDescription = (productId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-[#46392d]">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'products'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center ${
              activeTab === 'submissions'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Submissions
            {submissions.filter(s => s.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-sm rounded-full">
                {submissions.filter(s => s.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-6 py-2 rounded-md transition-colors flex items-center ${
              activeTab === 'offers'
                ? 'bg-[#46392d] text-[#F5F1EA]'
                : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
            }`}
          >
            Client Offers
            {offers.filter(o => o.status === 'pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-sm rounded-full">
                {offers.filter(o => o.status === 'pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Full size preview"
                className="max-h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Add New Product Button */}
            {!showForm && (
              <button
                onClick={handleNewProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add New Product</span>
              </button>
            )}

            {/* Product Form */}
            {showForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-serif text-[#46392d] mb-4">
                  {isEditing === 'new' ? 'Add New Product' : 'Edit Product'}
                </h3>
                {formError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {formError}
                  </div>
                )}
                <div className="space-y-6">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="Product Title"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Subject</label>
                        <input
                          type="text"
                          value={editForm.subject}
                          onChange={(e) => setEditForm(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="Product Subject"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Price</label>
                        <input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                          placeholder="Price"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#46392d] mb-1">Category</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                        >
                          <option value="">Select Category</option>
                          {categories.filter(cat => cat !== 'All').map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#46392d] mb-1">Description</label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d] h-[calc(100%-1.5rem)]"
                        placeholder="Product Description"
                        rows={6}
                      />
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-[#46392d]">
                        Product Images
                      </label>
                      <span className="text-xs text-[#46392d]/60">
                        Maximum 3 images allowed ({editForm.images.length}/3)
                      </span>
                    </div>
                    
                    <div className="border-2 border-dashed border-[#46392d]/20 rounded-lg p-4 hover:border-[#46392d]/40 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                        disabled={editForm.images.length >= 3}
                      />
                      <div 
                        onClick={() => editForm.images.length < 3 && fileInputRef.current?.click()}
                        className={`cursor-pointer flex flex-col items-center justify-center py-6 ${
                          editForm.images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#46392d]/40 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-[#46392d]/60 text-center">
                          {editForm.images.length >= 3 ? (
                            'Maximum images reached'
                          ) : (
                            <>
                              Click to upload images<br />
                              <span className="text-xs">PNG, JPG, GIF up to 5MB</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Image Previews */}
                    {editForm.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        {editForm.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 rounded-lg">
                              <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{isEditing === 'new' ? 'Add Product' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            {!showForm && (
              <>
                {/* Category Filter */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-[#46392d] text-[#F5F1EA]'
                          : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative group">
                        <img
                          src={product.images && product.images.length > 0 
                            ? product.images[0] 
                            : '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-serif text-[#46392d] font-medium hover:text-[#5c4b3d] transition-colors">
                            {product.title}
                          </h3>
                          <span className="px-3 py-1 bg-[#46392d]/10 rounded-full text-[#46392d] text-sm font-medium">
                            {product.category}
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Description Section */}
                          <div className="prose prose-sm max-w-none">
                            <p className="text-[#46392d]/80 leading-relaxed">
                              {expandedDescriptions[product.id] 
                                ? product.description 
                                : truncateDescription(product.description)}
                              {product.description.length > 100 && (
                                <button
                                  onClick={() => toggleDescription(product.id)}
                                  className="ml-2 text-[#46392d] hover:text-[#5c4b3d] font-medium text-sm"
                                >
                                  {expandedDescriptions[product.id] ? 'Show Less' : 'Show More'}
                                </button>
                              )}
                            </p>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[#46392d]/10">
                            <div>
                              <p className="text-sm text-[#46392d]/60">Subject</p>
                              <p className="text-[#46392d] font-medium">{product.subject}</p>
                            </div>
                            <div>
                              <p className="text-sm text-[#46392d]/60">Price</p>
                              <p className="text-[#46392d] font-bold text-lg">₹{product.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-3 pt-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'submissions' ? (
          <>
            {/* Submissions Review UI */}
            <div className="grid grid-cols-1 gap-6">
              {submissions.map((submission) => (
                <div 
                  key={submission.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${
                    submission.status === 'pending' ? 'border-2 border-yellow-500' :
                    submission.status === 'approved' ? 'border-2 border-green-500' :
                    'border-2 border-red-500'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-serif text-[#46392d]">{submission.title}</h3>
                        <p className="text-sm text-[#46392d]/70">{submission.description}</p>
                        <p className="text-[#46392d] font-medium mt-2">₹{submission.price}</p>
                        <p className="text-sm text-[#46392d]/70">Category: {submission.category}</p>
                        <p className="text-sm text-[#46392d]/70">Phone: {submission.phone}</p>
                        <p className="text-sm text-[#46392d]/70">Address: {submission.address}</p>
                        <p className="text-sm text-[#46392d]/70">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={() => {
                            deleteSubmission(submission.id);
                            addNotification(`Submission "${submission.title}" has been deleted.`, 'info', true);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 transition-colors"
                          title="Delete submission"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {submission.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleApproveSubmission(submission)}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectSubmission(submission)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-md ${
                              submission.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                            </span>
                            {submission.status === 'approved' && (
                              <button
                                onClick={() => handleAddToShop(submission)}
                                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                Add to Shop
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="space-y-4">
                          <div className="relative">
                            {submission.images && submission.images.length > 0 ? (
                              <>
                                <div 
                                  className="relative cursor-pointer group"
                                  onClick={() => setSelectedImage(submission.images[currentImageIndex])}
                                >
                                  <img
                                    src={submission.images[currentImageIndex]}
                                    alt={`${submission.title} - Image ${currentImageIndex + 1}`}
                                    className="w-full h-64 object-contain rounded-md border border-gray-200"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-sm">Click to view full image</span>
                                  </div>
                                </div>
                                {submission.images.length > 1 && (
                                  <>
                                    <button
                                      onClick={(e) => handlePrevImage(e, submission.images)}
                                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => handleNextImage(e, submission.images)}
                                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md border border-gray-200">
                                <span className="text-gray-400">No images available</span>
                              </div>
                            )}
                          </div>
                          {submission.images && submission.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto py-2">
                              {submission.images.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`flex-shrink-0 w-16 h-16 rounded-md border-2 transition-all ${
                                    currentImageIndex === index
                                      ? 'border-[#46392d]'
                                      : 'border-transparent'
                                  }`}
                                >
                                  <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-contain rounded-md"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[#46392d]/70 mb-4">{submission.description}</p>
                        <div className="space-y-2">
                          <p className="text-[#46392d]">
                            <strong>Category:</strong> {submission.category}
                          </p>
                          <p className="text-[#46392d]">
                            <strong>Asking Price:</strong> ₹{submission.price}
                          </p>
                          <p className="text-[#46392d]">
                            <strong>Phone:</strong> {submission.phone}
                          </p>
                          <p className="text-[#46392d]">
                            <strong>Address:</strong> {submission.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {submissions.length === 0 && (
                <div className="text-center py-12 text-[#46392d]/70">
                  No submissions to review at this time.
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {offers.length === 0 ? (
              <div className="text-center py-12 text-[#46392d]/70">
                No offers to review at this time.
              </div>
            ) : (
              offers.map((offer) => {
                const product = products.find(p => p.id === offer.productId);
                if (!product) return null;

                return (
                  <div 
                    key={offer.id} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden ${
                      offer.status === 'pending' ? 'border-2 border-yellow-500' :
                      offer.status === 'approved' ? 'border-2 border-green-500' :
                      'border-2 border-red-500'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex gap-6">
                        <div className="w-1/4">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-48 object-cover rounded-md"
                          />
                        </div>
                        <div className="w-3/4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-serif text-[#46392d]">{product.title}</h3>
                              <p className="text-[#46392d]/70">{product.description}</p>
                              <div className="mt-4 space-y-2">
                                <p className="text-[#46392d]">
                                  <strong>Original Price:</strong> ₹{product.price}
                                </p>
                                <p className="text-[#46392d]">
                                  <strong>Offer Amount:</strong> ₹{offer.amount}
                                </p>
                                <p className="text-[#46392d]">
                                  <strong>Client Name:</strong> {offer.name}
                                </p>
                                <p className="text-[#46392d]">
                                  <strong>Contact Number:</strong> {offer.contactNumber}
                                </p>
                                {offer.message && (
                                  <div>
                                    <strong className="text-[#46392d]">Message:</strong>
                                    <p className="text-[#46392d]/70 mt-1 p-3 bg-gray-50 rounded-md">
                                      {offer.message}
                                    </p>
                                  </div>
                                )}
                                <p className="text-sm text-[#46392d]/70">
                                  Submitted: {new Date(offer.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this offer?')) {
                                    deleteOffer(offer.id);
                                    addNotification(`Offer for "${product.title}" has been deleted.`, 'info', true);
                                  }
                                }}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                                title="Delete offer"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                              {offer.status === 'pending' ? (
                                <>
                                  <button
                                    onClick={() => handleApproveOffer(offer)}
                                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectOffer(offer)}
                                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </>
                              ) : (
                                <span className={`px-3 py-1 rounded-md ${
                                  offer.status === 'approved' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 