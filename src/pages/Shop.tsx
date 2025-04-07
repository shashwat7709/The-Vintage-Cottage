import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import ProductCard from '../components/ProductCard';
import SellItemForm from '../components/SellItemForm';
import NotificationIcon from '../components/NotificationIcon';
import PaymentModal from '../components/PaymentModal';
import Cart from '../components/Cart';
import StoreLocation from '../components/StoreLocation';

const Shop: React.FC = () => {
  const { products, categories, addSubmission } = useProducts();
  const { addToCart, getItemCount, getCartTotal, clearCart } = useCart();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [showSellForm, setShowSellForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<null | { id: string; title: string; price: number }>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCartCheckout, setIsCartCheckout] = useState(false);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const handleSellSubmit = (formData: FormData) => {
    const submission = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      images: JSON.parse(formData.get('images') as string),
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    };
    
    addSubmission(submission);
    setShowSellForm(false);
    addNotification('Thank you for submitting your item! We will review it and get back to you soon.', 'success', false);
    addNotification(`New antique submission received: "${submission.title}"`, 'info', true);
  };

  const handleAddToCart = (product: { id: string; title: string; price: number; image: string }) => {
    addToCart(product);
    addNotification(`${product.title} added to cart!`, 'success', false);
  };

  const handleBuyNow = (product: { id: string; title: string; price: number }) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handleCheckout = () => {
    setIsCartCheckout(true);
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = () => {
    if (isCartCheckout) {
      addNotification('Thank you for your purchase! You will receive an email with shipping details.', 'success', true);
      clearCart();
    } else if (selectedProduct) {
      addNotification(`Thank you for purchasing ${selectedProduct.title}! You will receive an email with shipping details.`, 'success', true);
    }
    setSelectedProduct(null);
    setIsCartCheckout(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif text-[#46392d]">
            Shop Our Collection
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-[#46392d] text-white px-4 py-2 rounded-md hover:bg-[#5c4b3d] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowSellForm(true)}
              className="px-6 py-3 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors duration-300 font-serif"
            >
              Sell Your Antiques
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-16">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-md transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#46392d] text-[#F5F1EA]'
                    : 'bg-white text-[#46392d] hover:bg-[#46392d]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 mb-24">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => handleAddToCart(product)}
              onBuyNow={() => handleBuyNow(product)}
            />
          ))}
        </div>

        {/* Store Location */}
        <div className="mt-24">
          <StoreLocation />
        </div>

        {/* Modals */}
        {showSellForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#F5F1EA] p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif text-[#46392d]">Sell Your Antiques</h2>
                <button
                  onClick={() => setShowSellForm(false)}
                  className="text-[#46392d] hover:text-[#46392d]/70"
                >
                  ✕
                </button>
              </div>
              <SellItemForm onSubmit={handleSellSubmit} />
            </div>
          </div>
        )}

        {/* Cart */}
        <Cart
          isOpen={showCart}
          onClose={() => setShowCart(false)}
          onCheckout={handleCheckout}
        />

        {/* Payment Modal */}
        {showPaymentModal && (
          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setIsCartCheckout(false);
            }}
            productTitle={isCartCheckout ? 'Cart Checkout' : selectedProduct?.title || ''}
            price={isCartCheckout ? getCartTotal() : selectedProduct?.price || 0}
            onPaymentComplete={handlePaymentComplete}
          />
        )}
      </div>
    </div>
  );
};

export default Shop; 