// Simple footer component with contact info and social links
const Footer = () => {
  return (
    <footer className="py-8 text-white bg-brand-purple">
      <div className="container mx-auto text-center">
        {/* ...existing footer content... */}
        <p>© {new Date().getFullYear()} Paw Patroller UK. All rights reserved.</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a href="https://www.facebook.com/PawPatrollerUK" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://www.instagram.com/Paw_Patroller_UK" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="tel:07300888847">073 0088 8847</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
