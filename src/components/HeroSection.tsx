
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1617419086540-172402d8b6fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80')",
          backgroundPosition: "center 30%"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-shadow/70 via-shadow/60 to-shadow/80"></div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-playfair font-bold text-porcelain mb-4 animate-fade-in opacity-0" style={{ animationDelay: '0.3s' }}>
          <span className="block">Discover our</span>
          <span className="text-brass-light italic">Vintage Treasures</span>
        </h1>
        
        <div className="w-24 h-1 bg-brass mx-auto my-8 animate-fade-in opacity-0" style={{ animationDelay: '0.6s' }}></div>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-porcelain/90 mb-10 animate-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
          Step into our cozy emporium of timeless treasures, where each piece 
          tells a story of craftsmanship and history from around the world.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in opacity-0" style={{ animationDelay: '1.2s' }}>
          <Button className="bg-brass hover:bg-mahogany text-white border border-brass px-8 py-6">
            Explore Our Collection
          </Button>
          <Button variant="outline" className="border-porcelain text-porcelain hover:bg-porcelain/10 px-8 py-6">
            Book a Private Viewing
          </Button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-porcelain animate-bounce">
        <a href="#features" className="flex flex-col items-center">
          <span className="text-sm mb-2">Scroll Down</span>
          <ChevronDown size={20} />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
