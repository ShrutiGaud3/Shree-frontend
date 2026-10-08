import { Link } from "react-router-dom";
import { Sparkles, Home, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui.jsx";

const NotFound = () => {
  return (
    <div className="mx-auto my-12 max-w-lg rounded-3xl bg-surface-card p-8 text-center shadow-md border-2 border-accent/30 md:p-12">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary-soft/70 text-text">
        <span className="font-serif text-5xl font-black text-text">404</span>
        <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-accent animate-bounce" />
      </div>

      <h1 className="mt-6 font-serif text-3xl font-extrabold text-text">
        Oops! Page Not Found
      </h1>
      <p className="mt-3 text-sm font-medium text-text-muted leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let's get you back to discovering lovely toys & sparkling jewellery!
      </p>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link to="/" className="w-full sm:w-auto">
          <Button variant="primary" icon={Home} className="w-full">
            Back to Home
          </Button>
        </Link>
        <Link to="/products" className="w-full sm:w-auto">
          <Button variant="secondary" icon={ShoppingBag} className="w-full">
            Explore All Products
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
