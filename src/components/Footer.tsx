function Footer() {
  return (
    <footer className="bg-beige dark:bg-slate-900 border-t border-slate-light dark:border-slate-800 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-text-dark/70 dark:text-slate-300">
            © {new Date().getFullYear()} Samuel Dires. All rights reserved.
          </p>
          <p className="text-text-dark/60 dark:text-slate-400 text-sm mt-2">
            Crafted with passion for visual storytelling
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
