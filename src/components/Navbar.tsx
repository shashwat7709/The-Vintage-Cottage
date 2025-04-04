
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-cream/95 backdrop-blur-sm shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <span className="font-cormorant text-3xl font-bold text-brass">
            The Vintage Cottage
          </span>
          <span className="ml-2 text-xs uppercase tracking-widest text-mahogany mt-1">
            EST. 1952
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Collection', 'Gallery', 'Our Story', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                'font-playfair text-lg transition-colors relative group',
                isScrolled ? 'text-mahogany' : 'text-porcelain'
              )}
            >
              {item}
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brass transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        <Button 
          className="hidden md:block bg-brass hover:bg-mahogany text-white"
          variant="default"
          onClick={() => window.location.href = "#contact"}
        >
          Book Appointment
        </Button>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={cn(isScrolled ? 'text-mahogany' : 'text-porcelain')} />
          ) : (
            <Menu className={cn(isScrolled ? 'text-mahogany' : 'text-porcelain')} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <nav
        className={cn(
          'md:hidden absolute w-full bg-cream/95 backdrop-blur-sm shadow-md transition-all duration-300 overflow-hidden',
          isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'
        )}
      >
        <div className="container mx-auto px-4 flex flex-col space-y-4">
          {['Home', 'Collection', 'Gallery', 'Our Story', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="font-playfair text-lg text-mahogany py-2 border-b border-brass/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <Button 
            className="bg-brass hover:bg-mahogany text-white mt-2"
            variant="default"
            onClick={() => {
              window.location.href = "#contact";
              setIsMobileMenuOpen(false);
            }}
          >
            Book Appointment
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
