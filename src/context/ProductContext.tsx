import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  subject: string;
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
  subject: string;
}

interface Offer {
  id: string;
  productId: string;
  amount: number;
  message: string;
  name: string;
  contactNumber: string;
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
  offers: Offer[];
  addOffer: (offer: { 
    productId: string; 
    amount: number; 
    message: string;
    name: string;
    contactNumber: string;
  }) => void;
  updateOffer: (offer: Offer) => void;
  deleteOffer: (offerId: string) => void;
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
  'Textiles',
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
    console.log('ProductProvider - Saved products from localStorage:', savedProducts);
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : initialProducts;
    console.log('ProductProvider - Using products:', parsedProducts);
    return parsedProducts;
  });

  const [submissions, setSubmissions] = useState<AntiqueSubmission[]>(() => {
    const savedSubmissions = localStorage.getItem('antiqueSubmissions');
    return savedSubmissions ? JSON.parse(savedSubmissions) : [];
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const savedOffers = localStorage.getItem('productOffers');
    return savedOffers ? JSON.parse(savedOffers) : [];
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    console.log('ProductProvider - Saving products to localStorage:', products);
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // Save submissions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('antiqueSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  // Save offers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productOffers', JSON.stringify(offers));
  }, [offers]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: String(Date.now())
    };
    console.log('Adding new product:', newProduct);
    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      console.log('Updated products list:', updatedProducts);
      return updatedProducts;
    });
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

  const addOffer = (offer: { 
    productId: string; 
    amount: number; 
    message: string;
    name: string;
    contactNumber: string;
  }) => {
    const newOffer: Offer = {
      ...offer,
      id: String(Date.now()),
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setOffers(prev => [...prev, newOffer]);
  };

  const updateOffer = (offer: Offer) => {
    setOffers(prev => prev.map(o => o.id === offer.id ? offer : o));
  };

  const deleteOffer = (offerId: string) => {
    setOffers(prev => prev.filter(o => o.id !== offerId));
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
      deleteSubmission,
      offers,
      addOffer,
      updateOffer,
      deleteOffer
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
    price: 1200,
    category: 'Vintage Furniture',
    images: ['/photos/products/2024-08-02.jpg'],
    subject: 'Furniture'
  },
  {
    id: '2',
    title: 'Victorian Armchair',
    description: 'Beautifully preserved Victorian-era armchair with original upholstery.',
    price: 850,
    category: 'Vintage Furniture',
    images: ['/photos/products/2024-08-02 (1).jpg'],
    subject: 'Furniture'
  },
  // Crystal & Glass Category
  {
    id: '3',
    title: 'Crystal Chandelier',
    description: 'Stunning vintage crystal chandelier with intricate detailing.',
    price: 1500,
    category: 'Crystal & Glass',
    images: ['/photos/products/2024-08-02 (2).jpg'],
    subject: 'Lighting'
  },
  // Decorative Accents Category
  {
    id: '4',
    title: 'Brass Wall Clock',
    description: 'Antique brass wall clock with Roman numerals, fully functional.',
    price: 300,
    category: 'Decorative Accents',
    images: ['/photos/products/2024-08-02 (3).jpg'],
    subject: 'Clock'
  },
  // Lighting & Mirrors Category
  {
    id: '5',
    title: 'Ornate Gold Mirror',
    description: 'Large ornate gold-framed mirror with baroque-style details.',
    price: 950,
    category: 'Lighting & Mirrors',
    images: ['/photos/products/2024-08-02 (4).jpg'],
    subject: 'Mirror'
  },
  // Tableware Category
  {
    id: '6',
    title: 'Fine China Tea Set',
    description: 'Complete vintage fine china tea set with floral pattern.',
    price: 400,
    category: 'Tableware',
    images: ['/photos/products/2024-08-02 (5).jpg'],
    subject: 'Tea Set'
  }
]; 