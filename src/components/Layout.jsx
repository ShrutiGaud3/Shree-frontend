import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { STORE_NAME, CATEGORIES } from "../config/site.js";
import { useEffect, useState, useRef } from "react";
import api from "../api/client.js";
import CartDrawer from "./CartDrawer.jsx";
import AnnouncementBar from "./AnnouncementBar.jsx";
import NewsletterForm from "./NewsletterForm.jsx";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Package,
  Sparkles,
  Home,
  Grid,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  MessageCircle,
  LogOut,
  Gift,
  Gem,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { Badge, Button } from "./ui.jsx";
import { WISHLIST_UPDATED_EVENT } from "../api/wishlist.js";

const CART_UPDATED_EVENT = "shree:cart-updated";

// Minimalist Top Header matching the reference design
const Header = ({ cartCount, wishlistCount, onOpenMobileMenu, onOpenCart }) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCollectionsMenu, setShowCollectionsMenu] = useState(false);
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    setShowUserMenu(false);
    setShowCollectionsMenu(false);
    setShowSearchModal(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setShowSearchModal(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border shadow-xs transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        {/* Left: Mobile Menu Trigger & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-text hover:bg-primary-soft md:hidden transition cursor-pointer"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="Shree 14"
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-all duration-200"
            />
          </Link>
        </div>

        {/* Center: Clean Minimalist Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold tracking-wider text-text">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-hover py-1 relative ${
                isActive ? "text-primary-hover font-bold" : "text-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Home</span>
                {isActive && (
                  <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/products"
            end
            className={({ isActive }) =>
              `transition-colors hover:text-primary-hover py-1 relative ${
                isActive ? "text-primary-hover font-bold" : "text-text"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span>Shop</span>
                {isActive && (
                  <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary rounded-full" />
                )}
              </>
            )}
          </NavLink>

          {/* Collections Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setShowCollectionsMenu(true)}
            onMouseLeave={() => setShowCollectionsMenu(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 hover:text-primary-hover py-1 transition-colors cursor-pointer"
            >
              <span>Collections</span>
              <ChevronDown className="h-3 w-3 text-text-muted" />
            </button>

            {showCollectionsMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-72 rounded-2xl bg-white p-4 shadow-xl border border-border z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-hover mb-1.5 flex items-center gap-1">
                    <Gem className="h-3 w-3" /> Jewellery
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(CATEGORIES.jewellery.subCategories).map(([k, label]) => (
                      <Link
                        key={k}
                        to={`/products?category=jewellery&subCategory=${k}`}
                        className="py-1 px-2 rounded-lg hover:bg-primary-tint hover:text-primary-hover transition"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary-hover mb-1.5 flex items-center gap-1">
                    <Gift className="h-3 w-3" /> Toys & Games
                  </p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {Object.entries(CATEGORIES.toys.subCategories).map(([k, label]) => (
                      <Link
                        key={k}
                        to={`/products?category=toys&subCategory=${k}`}
                        className="py-1 px-2 rounded-lg hover:bg-sand-tint hover:text-accent transition"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-hover py-1 relative ${
                isActive ? "text-primary-hover font-bold" : "text-text"
              }`
            }
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `transition-colors hover:text-primary-hover py-1 relative ${
                isActive ? "text-primary-hover font-bold" : "text-text"
              }`
            }
          >
            Contact
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className="rounded-full bg-primary-soft px-3 py-1 text-[11px] font-bold text-text hover:bg-primary transition"
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right: Search, Account, Cart Icons */}
        <div className="flex items-center gap-4 text-text">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="p-1 text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Search catalog"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* User Profile */}
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 sm:gap-2 py-1 px-1.5 sm:px-2.5 rounded-full bg-primary-soft/80 hover:bg-primary-soft text-text transition-all duration-200 border border-accent/25 shadow-2xs group cursor-pointer"
                aria-label="User account menu"
                aria-expanded={showUserMenu}
              >
                <div className="flex h-6 w-6 sm:h-6.5 sm:w-6.5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-text font-black text-[11px] shadow-2xs border border-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
                </div>
                <div className="text-left hidden sm:block leading-tight pr-0.5">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-text-muted">
                    Welcome
                  </span>
                  <span className="block text-xs font-black text-text truncate max-w-[100px] lg:max-w-[130px]">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>
                <ChevronDown
                  className={`h-3 w-3 text-text-muted group-hover:text-text transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-xl border border-border z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 bg-primary-soft/40 rounded-xl border border-accent/15 mb-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary-hover">
                      Welcome,
                    </p>
                    <p className="font-serif font-bold text-sm text-text truncate">{user?.name || "Member"}</p>
                    <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/account"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-text hover:bg-surface transition"
                    >
                      <User className="h-3.5 w-3.5 text-accent" />
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-text hover:bg-surface transition"
                    >
                      <ShoppingBag className="h-3.5 w-3.5 text-accent" />
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-text bg-primary-soft/50 hover:bg-primary-soft transition"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                        Admin Portal
                      </Link>
                    )}
                  </div>
                  <div className="pt-1 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="p-1 text-text-muted hover:text-text transition-colors"
              aria-label="Login or Join"
            >
              <User className="h-5 w-5" />
            </Link>
          )}

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-1 text-text-muted hover:text-text transition-colors"
            aria-label="My wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-text border border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart Icon with Notification Badge (opens mini-cart drawer) */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative p-1 text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Open shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-text border border-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Expandable Search Modal */}
      {showSearchModal && (
        <div className="border-t border-border bg-surface/90 px-4 py-3 backdrop-blur-md animate-in slide-in-from-top-2 duration-150">
          <div className="mx-auto max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-text-muted" />
              <input
                ref={searchInputRef}
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jewellery, earrings, necklaces, soft toys, games…"
                className="w-full rounded-full border border-border bg-white pl-10 pr-10 py-2.5 text-xs text-text outline-none focus:border-accent shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowSearchModal(false)}
                className="absolute right-3 text-text-muted hover:text-text cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

// Ultra-Premium Slide-in Mobile Drawer
const MobileDrawer = ({ isOpen, onClose, cartCount, wishlistCount = 0 }) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [jewelleryOpen, setJewelleryOpen] = useState(false);
  const [toysOpen, setToysOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="fixed inset-y-0 left-0 w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-border animate-in slide-in-from-left duration-300">
        <div className="p-4 sm:p-5 space-y-4">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-border/80">
            <Link to="/" onClick={onClose} className="flex items-center gap-2 group">
              <img
                src="/logo.png"
                alt="Shree 14"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface hover:bg-primary-soft text-text transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* User Profile / Join Banner */}
          {isLoggedIn ? (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-primary-soft/80 via-white to-[#FBE7D0]/40 border border-accent/25 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-text font-serif font-black text-base shadow-xs border-2 border-white">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                      {isAdmin ? "Store Admin" : "Member"}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="font-serif font-bold text-sm text-text truncate">
                    {user?.name || "Valued Customer"}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFFBF5] via-[#FFF5F8] to-[#FFF0F5] border border-accent/30 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-serif font-bold text-xs text-text">Welcome to Shree 14</span>
              </div>
              <p className="text-[11px] text-text-muted leading-snug">
                Sign in to track orders, save wishlists & enjoy members-only offers.
              </p>
              <div className="flex items-center gap-2 pt-0.5">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary-hover py-2 text-center text-xs font-bold text-text shadow-2xs transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex-1 rounded-xl bg-white hover:bg-surface border border-accent/40 py-2 text-center text-xs font-bold text-text transition"
                >
                  Register
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold text-text">
            {/* Home */}
            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                location.pathname === "/" ? "bg-primary-soft text-primary-hover font-black" : "hover:bg-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="h-4 w-4 text-accent" />
                <span>Home</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
            </Link>

            {/* Shop All */}
            <Link
              to="/products"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                location.pathname === "/products" && !location.search ? "bg-primary-soft text-primary-hover font-black" : "hover:bg-surface"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-accent" />
                <span>All Collections</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
            </Link>

            {/* Jewellery with Accordion */}
            <div className="rounded-xl overflow-hidden bg-primary-tint/40 border border-primary/20">
              <div
                onClick={() => setJewelleryOpen(!jewelleryOpen)}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-primary-soft/50 transition cursor-pointer"
              >
                <Link
                  to="/products?category=jewellery"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 text-primary-hover font-black"
                >
                  <Gem className="h-4 w-4 text-primary-hover" />
                  <span>Jewellery</span>
                </Link>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${
                    jewelleryOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {jewelleryOpen && (
                <div className="px-3 pb-2.5 pt-0.5 space-y-1 border-t border-primary/15 bg-white/70">
                  {Object.entries(CATEGORIES.jewellery.subCategories).map(([k, label]) => (
                    <Link
                      key={k}
                      to={`/products?category=jewellery&subCategory=${k}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-text hover:bg-primary-soft transition"
                    >
                      <span>{label}</span>
                      <span className="text-[10px] text-text-muted">Explore →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Toys with Accordion */}
            <div className="rounded-xl overflow-hidden bg-sand-tint/50 border border-accent/25">
              <div
                onClick={() => setToysOpen(!toysOpen)}
                className="flex items-center justify-between px-3 py-2.5 hover:bg-sand-tint transition cursor-pointer"
              >
                <Link
                  to="/products?category=toys"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                  className="flex items-center gap-2.5 text-[#B36B15] font-black"
                >
                  <Gift className="h-4 w-4 text-[#B36B15]" />
                  <span>Toys & Games</span>
                </Link>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-text-muted transition-transform duration-200 ${
                    toysOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {toysOpen && (
                <div className="px-3 pb-2.5 pt-0.5 space-y-1 border-t border-accent/15 bg-white/70">
                  {Object.entries(CATEGORIES.toys.subCategories).map(([k, label]) => (
                    <Link
                      key={k}
                      to={`/products?category=toys&subCategory=${k}`}
                      onClick={onClose}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-text hover:bg-sand-tint transition"
                    >
                      <span>{label}</span>
                      <span className="text-[10px] text-text-muted">Explore →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface transition"
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-accent" />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 ? (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black text-text">
                  {wishlistCount}
                </span>
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
              )}
            </Link>

            {/* My Orders */}
            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface transition"
            >
              <div className="flex items-center gap-2.5">
                <Package className="h-4 w-4 text-accent" />
                <span>My Orders</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
            </Link>

            {/* My Account */}
            <Link
              to="/account"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface transition"
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-accent" />
                <span>My Account</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-text-muted/60" />
            </Link>

            {/* Admin Portal if Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-primary-soft text-text font-black border border-accent/30 hover:bg-primary transition"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  <span>Admin Portal</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Support / Help section */}
            <div className="pt-2 border-t border-border/80 space-y-1">
              <p className="px-3 text-[9px] font-bold uppercase tracking-widest text-text-muted/80">
                Help & Info
              </p>
              <Link
                to="/about"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition"
              >
                <span>About Us</span>
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition"
              >
                <span>Contact & Support</span>
              </Link>
              <Link
                to="/faq"
                onClick={onClose}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition"
              >
                <span>FAQs</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Drawer Footer (Sign out & Trust guarantee note) */}
        <div className="p-4 border-t border-border/80 bg-surface/40 space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
            <span>100% Genuine Quality Guaranteed</span>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => {
                logout();
                onClose();
                navigate("/");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 py-2.5 text-xs font-bold text-red-700 transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile Sticky Bottom Navigation with Menu trigger
const MobileBottomNav = ({ cartCount, onOpenMobileMenu }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: "Home", to: "/", icon: Home, exact: true },
    { label: "Shop", to: "/products", icon: Grid },
    { label: "Cart", to: "/cart", icon: ShoppingBag, badge: cartCount },
    { label: "Account", to: isLoggedIn ? "/account" : "/login", icon: User },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-border shadow-lg md:hidden">
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                isActive ? "text-primary-hover font-bold" : "text-text-muted hover:text-text"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "text-primary-hover scale-105" : ""}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-text border border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          );
        })}

        {/* Menu Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="flex flex-col items-center justify-center py-1 text-text-muted hover:text-text transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <div className="relative">
            <Menu className="h-5 w-5" />
          </div>
          <span className="text-[10px] mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
};

// Collapsible accordion section for mobile footer, full-column on desktop
const FooterSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <nav aria-label={`${title} links`} className="border-b border-border/50 pb-3 md:border-b-0 md:pb-0 space-y-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1 text-xs font-black uppercase tracking-widest text-text md:pointer-events-none cursor-pointer"
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-accent transition-transform duration-200 md:hidden ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`flex flex-col gap-2 text-xs font-semibold text-text-muted transition-all duration-200 ${
          open ? "flex pt-1" : "hidden md:flex"
        }`}
      >
        {children}
      </div>
    </nav>
  );
};

// Responsive Footer with collapsible dropdowns on mobile
const Footer = () => (
  <footer className="mt-6 sm:mt-10 border-t border-border bg-white text-text w-full max-w-full">
    <div className="mx-auto max-w-7xl px-4 sm:px-8 pt-8 sm:pt-10 pb-6 grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
      {/* Brand + newsletter */}
      <div className="space-y-4 pb-2 md:pb-0 border-b border-border/50 md:border-b-0">
        <Link to="/" className="inline-block group">
          <img
            src="/logo.png"
            alt="Shree 14"
            className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-all duration-200"
          />
        </Link>
        <p className="text-xs text-text-muted leading-relaxed max-w-sm">
          Toys that spark joy and jewellery that lasts — curated, genuine and delivered across India.
        </p>
        <div className="max-w-sm">
          <NewsletterForm source="footer" compact />
        </div>
        <div className="flex items-center gap-3 text-text-muted pt-1">
          <a href="#instagram" className="hover:text-text transition-colors p-1" aria-label="Instagram">
            <Instagram className="h-4 w-4" />
          </a>
          <a href="#facebook" className="hover:text-text transition-colors p-1" aria-label="Facebook">
            <Facebook className="h-4 w-4" />
          </a>
          <a href="#youtube" className="hover:text-text transition-colors p-1" aria-label="YouTube">
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Shop Dropdown */}
      <FooterSection title="Shop" defaultOpen={false}>
        <Link to="/products" className="hover:text-text transition-colors py-0.5">All Products</Link>
        <Link to="/products?category=toys" className="hover:text-text transition-colors py-0.5">Toys & Games</Link>
        <Link to="/products?category=jewellery" className="hover:text-text transition-colors py-0.5">Jewellery</Link>
        <Link to="/wishlist" className="hover:text-text transition-colors py-0.5">My Wishlist</Link>
      </FooterSection>

      {/* Help Dropdown */}
      <FooterSection title="Help" defaultOpen={false}>
        <Link to="/shipping" className="hover:text-text transition-colors py-0.5">Shipping & Delivery</Link>
        <Link to="/refunds" className="hover:text-text transition-colors py-0.5">Returns & Refunds</Link>
        <Link to="/faq" className="hover:text-text transition-colors py-0.5">FAQs</Link>
        <Link to="/contact" className="hover:text-text transition-colors py-0.5">Contact Us</Link>
      </FooterSection>

      {/* Company Dropdown */}
      <FooterSection title="Company" defaultOpen={false}>
        <Link to="/about" className="hover:text-text transition-colors py-0.5">About Us</Link>
        <Link to="/privacy" className="hover:text-text transition-colors py-0.5">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-text transition-colors py-0.5">Terms of Service</Link>
      </FooterSection>
    </div>

    {/* Bottom bar with safe padding above fixed mobile bottom nav */}
    <div className="border-t border-border/60 pt-4 pb-24 md:pb-4 px-4 text-center space-y-1.5">
      <p className="text-[11px] font-semibold text-text-muted">
        Secure payments via Razorpay & COD · GST invoice with every order
      </p>
      <p className="text-[11px] font-medium text-text-muted">
        © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
      </p>
    </div>
  </footer>
);

// Master Layout
const Layout = () => {
  const { isLoggedIn } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const refreshCount = () => {
    if (!isLoggedIn) return;
    api
      .get("/cart")
      .then(({ data }) => setCartCount((data.items || []).reduce((s, i) => s + i.qty, 0)))
      .catch(() => {});
  };

  const refreshWishlist = () => {
    if (!isLoggedIn) return;
    api
      .get("/wishlist")
      .then(({ data }) => setWishlistCount(data.total || 0))
      .catch(() => {});
  };

  useEffect(() => {
    window.addEventListener(CART_UPDATED_EVENT, refreshCount);
    window.addEventListener(WISHLIST_UPDATED_EVENT, refreshWishlist);
    if (isLoggedIn) {
      refreshCount();
      refreshWishlist();
    }
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, refreshCount);
      window.removeEventListener(WISHLIST_UPDATED_EVENT, refreshWishlist);
    };
  }, [isLoggedIn]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen flex-col w-full max-w-full overflow-x-hidden bg-bg text-text selection:bg-primary-soft selection:text-text">
      <AnnouncementBar />
      <Header
        cartCount={isLoggedIn ? cartCount : 0}
        wishlistCount={isLoggedIn ? wishlistCount : 0}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onOpenCart={() => setCartOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        cartCount={isLoggedIn ? cartCount : 0}
        wishlistCount={isLoggedIn ? wishlistCount : 0}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 pb-16 md:pb-6 min-w-0">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav
        cartCount={isLoggedIn ? cartCount : 0}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
    </div>
  );
};

export default Layout;
