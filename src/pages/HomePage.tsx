import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950">
      <Navigation />
      <Hero />
      <About />
      <Portfolio />
      <Contact />
      <Footer />
    </div>
  );
}

export default HomePage;
