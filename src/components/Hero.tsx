import { ChevronDown, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

function Hero() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!isProfileOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [isProfileOpen]);

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-cream pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <button
          onClick={() => setIsProfileOpen(true)}
          className="mb-12 inline-block group focus:outline-none focus:ring-2 focus:ring-sage rounded-full"
          aria-label="Open profile card"
        >
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-sage shadow-elevated mx-auto transition-transform duration-300 group-hover:scale-105">
            <img
              src="/profile.jpg"
              alt="Samuel Dires"
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-text-dark mb-6 animate-fade-in">
          Hi, I'm <span className="text-sage">Samuel Dires</span>
        </h1>

        <p className="text-2xl sm:text-3xl font-display text-text-dark/80 mb-4">
          Professional Video Editor
        </p>

        <p className="text-lg text-text-dark/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          I turn raw footage into polished stories with fast pacing, clean color, and edits designed to hold attention.
        </p>

        <button
          onClick={scrollToPortfolio}
          className="px-8 py-4 bg-sage text-text-dark rounded-lg text-lg font-semibold hover:bg-taupe hover:text-white transition-all shadow-elegant hover:shadow-elevated"
        >
          View My Work
        </button>

        <div className="mt-20 animate-bounce">
          <ChevronDown size={32} className="text-taupe/40 mx-auto" />
        </div>
      </div>

      {isProfileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={() => setIsProfileOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-cream to-beige animate-fade-in-up"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative p-6 border-b border-slate-light">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-text-dark/70 hover:text-text-dark hover:bg-white/60 transition-colors"
                aria-label="Close profile card"
              >
                <X size={18} />
              </button>
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-sage shadow-elevated mx-auto mb-4">
                <img src="/profile.jpg" alt="Samuel Dires" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <p className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-white text-taupe">
                  <Sparkles size={14} />
                  Creative Editor
                </p>
                <h3 className="mt-3 text-2xl font-display font-bold text-text-dark">Samuel Dires</h3>
                <p className="text-text-dark/70">Professional Video Editor</p>
              </div>
            </div>
            <div className="p-6 text-center">
              <p className="text-text-dark/80 leading-relaxed">
                I turn raw footage into polished stories with fast pacing, clean color, and edits designed to hold attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Hero;
