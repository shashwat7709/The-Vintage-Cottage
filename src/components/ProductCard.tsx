import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  onAddToCart: () => void;
  onBuyNow: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  image,
  onAddToCart,
  onBuyNow
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-serif text-[#46392d] mb-2">{title}</h3>
        <p className="text-[#46392d]/70 mb-4">{description}</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-xl font-medium text-[#46392d]">
            ₹{price.toLocaleString('en-IN', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            })}
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={onAddToCart}
              variant="outline"
              className="flex-1 sm:flex-none bg-white text-[#4A3E3E] border-[#4A3E3E] hover:bg-[#4A3E3E] hover:text-white transition-colors"
            >
              Add to Cart
            </Button>
            
            <Button
              onClick={onBuyNow}
              className="flex-1 sm:flex-none bg-[#4A3E3E] text-white hover:bg-[#3A2E2E]"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 