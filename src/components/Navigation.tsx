import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-cream/95 dark:bg-slate-950/95 backdrop-blur-sm z-50 border-b border-slate-light dark:border-slate-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => scrollToSection('hero')}
            className="text-xl font-display font-bold text-text-dark dark:text-slate-100 hover:text-sage transition-colors"
          >
            Samuel Dires
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-text-dark/70 dark:text-slate-300 hover:text-text-dark dark:hover:text-slate-100 transition-colors"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-text-dark/70 dark:text-slate-300 hover:text-text-dark dark:hover:text-slate-100 transition-colors"
            >
              Portfolio
            </button>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-light dark:border-slate-700 text-text-dark dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span className="text-sm font-semibold">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-sage text-text-dark rounded-lg hover:bg-taupe hover:text-white transition-colors font-semibold"
            >
              Contact
            </button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center rounded-lg border border-slate-light dark:border-slate-700 w-10 h-10 text-text-dark dark:text-slate-100 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="text-text-dark dark:text-slate-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-cream dark:bg-slate-900 border-t border-slate-light dark:border-slate-800">
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-text-dark/70 dark:text-slate-300 hover:text-text-dark dark:hover:text-slate-100 transition-colors py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="block w-full text-left text-text-dark/70 dark:text-slate-300 hover:text-text-dark dark:hover:text-slate-100 transition-colors py-2"
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
