function Footer() {
  return (
    <footer className="bg-beige border-t border-slate-light py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-text-dark/70">
            © {new Date().getFullYear()} Samuel Dires. All rights reserved.
          </p>
          <p className="text-text-dark/60 text-sm mt-2">
            Crafted with passion for visual storytelling
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
