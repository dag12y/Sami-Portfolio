import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-cream/95 backdrop-blur-sm z-50 border-b border-slate-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-xl font-display font-bold text-text-dark hover:text-sage transition-colors"
          >
            Samuel Dires
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-text-dark/70 hover:text-text-dark transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-text-dark/70 hover:text-text-dark transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-sage text-text-dark rounded-lg hover:bg-taupe hover:text-white transition-colors font-semibold"
            >
              Contact
            </button>
          </div>

          <button
            className="md:hidden text-text-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-cream border-t border-slate-light">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-text-dark/70 hover:text-text-dark transition-colors py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="block w-full text-left text-text-dark/70 hover:text-text-dark transition-colors py-2"
            >
              Portfolio
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left px-4 py-2 bg-sage text-text-dark rounded-lg hover:bg-taupe hover:text-white transition-colors font-semibold"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation;
