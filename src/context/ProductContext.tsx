import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface AntiqueSubmission {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: string[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  submissions: AntiqueSubmission[];
  addSubmission: (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => void;
  updateSubmission: (submission: AntiqueSubmission) => void;
  deleteSubmission: (submissionId: string) => void;
}

const categories = [
  'All',
  'Vintage Furniture',
  'Crystal & Glass',
  'Decorative Accents',
  'Lighting & Mirrors',
  'Tableware',
  'Wall Art',
  'Antique Books',
  'Garden & Outdoor',
  'Others'
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  const [submissions, setSubmissions] = useState<AntiqueSubmission[]>(() => {
    const savedSubmissions = localStorage.getItem('antiqueSubmissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : [];
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('antiqueSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: String(Date.now())
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const addSubmission = (submission: Omit<AntiqueSubmission, 'id' | 'status' | 'submittedAt'>) => {
    const newSubmission: AntiqueSubmission = {
      ...submission,
      id: String(Date.now()),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const updateSubmission = (submission: AntiqueSubmission) => {
    setSubmissions(prev => prev.map(s => s.id === submission.id ? submission : s));
  };

  const deleteSubmission = (submissionId: string) => {
    setSubmissions(prev => prev.filter(s => s.id !== submissionId));
  };

  return (
    <ProductContext.Provider value={{
      products,
      setProducts,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      submissions,
      addSubmission,
      updateSubmission,
      deleteSubmission
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Initial products data
const initialProducts: Product[] = [
  // Vintage Furniture Category
  {
    id: '1',
    title: 'Antique Display Cabinet',
    description: 'Elegant glass-front display cabinet, perfect for showcasing your treasured collections.',
    price: 85000, // Price in INR
    category: 'Vintage Furniture',
    image: '/photos/products/2023-02-05(1).jpg'
  },
  {
    id: '2',
    title: 'Victorian Era Mirror',
    description: 'Beautifully preserved Victorian-era mirror with ornate golden frame.',
    price: 45000, // Price in INR
    category: 'Lighting & Mirrors',
    image: '/photos/products/mirror-1.jpg'
  },
  {
    id: '3',
    title: 'Crystal Wine Glasses Set',
    description: 'Set of 6 vintage crystal wine glasses with intricate etching.',
    price: 12500, // Price in INR
    category: 'Crystal & Glass',
    image: '/photos/products/glasses-1.jpg'
  },
  {
    id: '4',
    title: 'Brass Wall Sconces',
    description: 'Pair of antique brass wall sconces with patina finish.',
    price: 18000, // Price in INR
    category: 'Lighting & Mirrors',
    image: '/photos/products/sconces-1.jpg'
  }
]; 