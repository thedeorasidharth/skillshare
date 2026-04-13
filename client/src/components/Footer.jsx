const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border-secondary bg-nav-bg py-12 backdrop-blur-sm transition-colors duration-500">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-bold text-text-muted">
          © {new Date().getFullYear()} SwapSkill. Crafted with Elegance.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
