// New responsive header component using Tailwind CSS
const Header = () => {
  return (
    <header className="sticky top-0 z-50 transition-all duration-300 shadow-sm bg-white/90 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4 mx-auto">
        <a href="/" className="text-2xl font-semibold font-fredoka gradient-text">Paw Patroller UK</a>
        {/* Navigation Menu */}
        <nav className="hidden space-x-4 lg:flex">
          <a href="#home" className="hover:text-brand-purple">Home</a>
          <a href="#services" className="hover:text-brand-purple">Services</a>
          <a href="#gallery" className="hover:text-brand-purple">Gallery</a>
          <a href="#testimonials" className="hover:text-brand-purple">Testimonials</a>
          <a href="#faq" className="hover:text-brand-purple">FAQ</a>
          <a href="#contact" className="hover:text-brand-purple">Contact</a>
        </nav>
        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <button className="btn btn-ghost">
            <span className="material-icons">menu</span>
          </button>
        </div>
        <div className="hidden lg:flex">
          <a href="tel:07300888847" className="btn btn-circle">
            <span className="material-icons">phone</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
