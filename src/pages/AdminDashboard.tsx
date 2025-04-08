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
  image: string;
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
    deleteSubmission 
  } = useProducts();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'products' | 'submissions'>('products');
  const [editForm, setEditForm] = useState<Product>({
    id: '',
    title: '',
    description: '',
    price: 0,
    category: '',
    image: ''
  });
  const [formError, setFormError] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken');
    if (!token) {
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
    if (!editForm.description.trim()) {
      setFormError('Description is required');
      return false;
    }
    if (editForm.price <= 0) {
      setFormError('Price must be greater than 0');
      return false;
    }
    if (!editForm.category) {
      setFormError('Category is required');
      return false;
    }
    if (!editForm.image && !imagePreview) {
      setFormError('Image is required');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be less than 5MB');
        return;
      }

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEditForm({ ...editForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
      setFormError('');
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
    setImagePreview(product.image);
    setFormError('');
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    try {
      if (isEditing === 'new') {
        // Add new product
        const { id, ...newProduct } = editForm;
        addProduct(newProduct);
      } else {
        // Update existing product
        updateProduct(editForm);
      }
      setIsEditing(null);
      setEditForm({
        id: '',
        title: '',
        description: '',
        price: 0,
        category: '',
        image: ''
      });
      setImagePreview('');
      setFormError('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setFormError('Error saving product. Please try again.');
    }
  };

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
      image: submission.images[0] // Use the first image as the main product image
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

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const renderForm = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-serif text-[#46392d] mb-4">
        {isEditing === 'new' ? 'Add New Product' : 'Edit Product'}
      </h3>
      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {formError}
        </div>
      )}
      <div className="space-y-4">
        <input
          type="text"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
          placeholder="Title"
        />
        <textarea
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
          placeholder="Description"
          rows={3}
        />
        <input
          type="number"
          value={editForm.price}
          onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
          placeholder="Price"
          min="0"
          step="0.01"
        />
        <select
          value={editForm.category}
          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
        >
          <option value="">Select Category</option>
          {categories.filter(cat => cat !== 'All').map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#46392d]">
            Product Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-xs max-h-48 object-contain rounded"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              setIsEditing(null);
              setFormError('');
              setImagePreview('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {isEditing === 'new' ? 'Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );

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

        {activeTab === 'products' ? (
          <>
            {/* Existing Products Management UI */}
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing('new');
                  setEditForm({
                    id: 'new',
                    title: '',
                    description: '',
                    price: 0,
                    category: '',
                    image: ''
                  });
                  setImagePreview('');
                  setFormError('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="mb-8 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add New Product
              </button>
            )}

            {isEditing && renderForm()}

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-serif text-[#46392d]">{product.title}</h3>
                    <p className="text-sm text-[#46392d]/70">{product.description}</p>
                    <p className="text-[#46392d] font-medium mt-2">
                      ₹{product.price.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                      })}
                    </p>
                    <p className="text-sm text-[#46392d]/70">Category: {product.category}</p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
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
                        <p className="text-[#46392d] font-medium mt-2">
                          ₹{submission.price.toLocaleString('en-IN', {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 2
                          })}
                        </p>
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
                            <strong>Asking Price:</strong> ₹{submission.price.toLocaleString('en-IN', {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2
                            })}
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 