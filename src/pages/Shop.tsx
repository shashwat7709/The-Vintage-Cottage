import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import SellItemForm from '../components/SellItemForm';
import NotificationIcon from '../components/NotificationIcon';

const Shop: React.FC = () => {
  const { products, categories, addSubmission } = useProducts();
  const { addNotification } = useNotifications();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const addToCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: productId, quantity: 1 }];
    });
    addNotification('Item added to cart successfully!', 'success', false);
  };

  const handleSellSubmit = (formData: FormData) => {
    const submission = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      image: formData.get('image') as string,
      phone: formData.get('phone') as string,
    };
    
    addSubmission(submission);
    setIsSellModalOpen(false);
    addNotification('Thank you for submitting your item! We will review it and get back to you soon.', 'success', false);
    // Add notification for admin
    addNotification(`New antique submission received: "${submission.title}"`, 'info', true);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-[#46392d]">
            Shop Our Collection
          </h1>
          <div className="flex items-center space-x-4">
            <NotificationIcon />
            <button
              onClick={() => setIsSellModalOpen(true)}
              className="px-6 py-3 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors duration-300 font-serif"
            >
              Sell Your Antiques
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-12">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif text-[#46392d] mb-2">{product.title}</h3>
                <p className="text-[#46392d]/70 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-medium text-[#46392d]">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="px-4 py-2 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sell Modal */}
        {isSellModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#F5F1EA] p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif text-[#46392d]">Sell Your Antiques</h2>
                <button
                  onClick={() => setIsSellModalOpen(false)}
                  className="text-[#46392d] hover:text-[#46392d]/70"
                >
                  ✕
                </button>
              </div>
              <SellItemForm onSubmit={handleSellSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop; 