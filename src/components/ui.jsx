import { forwardRef, useState } from "react";
import {
  Star,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
  PackageSearch,
  Sparkles,
} from "lucide-react";

/**
 * ============================================================================
 * BUTTON COMPONENT
 * Variants: primary | secondary | outline | ghost | soft | danger
 * Sizes: sm | md | lg | icon
 * ============================================================================
 */
export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      disabled = false,
      loading = false,
      icon: Icon,
      iconRight: IconRight,
      type = "button",
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-bold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer";

    const sizes = {
      sm: "h-9 px-4 text-xs rounded-xl gap-1.5",
      md: "h-11 px-6 text-sm rounded-2xl gap-2",
      lg: "h-13 px-8 text-base rounded-2xl gap-2.5 shadow-md",
      icon: "h-10 w-10 p-0 rounded-2xl",
      "icon-sm": "h-8 w-8 p-0 rounded-xl",
    };

    const variants = {
      primary:
        "bg-primary text-text shadow-sm hover:bg-primary-soft hover:shadow border border-accent/20",
      secondary:
        "bg-surface text-text shadow-sm hover:bg-sand-tint border-2 border-accent/40 hover:border-accent",
      outline:
        "bg-transparent text-text border-2 border-accent/60 hover:bg-surface/60 hover:border-accent",
      ghost:
        "bg-transparent text-text hover:bg-surface/70 border border-transparent",
      soft:
        "bg-primary-soft text-text hover:bg-primary border border-accent/20",
      danger:
        "bg-error text-error-text border border-error-text/30 hover:opacity-90",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-text/40 border-t-text" />
        ) : (
          <>
            {Icon && <Icon className="h-4 w-4 flex-shrink-0" />}
            {children}
            {IconRight && <IconRight className="h-4 w-4 flex-shrink-0" />}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = "Button";

/**
 * ============================================================================
 * INPUT COMPONENT
 * ============================================================================
 */
export const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      icon: Icon,
      className = "",
      id,
      required,
      type = "text",
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center text-text-muted">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            required={required}
            className={`w-full rounded-2xl border-2 bg-surface-card px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 transition-colors duration-200 outline-none focus:border-accent focus:bg-white ${
              Icon ? "pl-10" : ""
            } ${
              error
                ? "border-red-400 bg-red-50/50 focus:border-red-500"
                : "border-accent/40 hover:border-accent/70"
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

/**
 * ============================================================================
 * SELECT COMPONENT
 * ============================================================================
 */
export const Select = forwardRef(
  ({ label, error, hint, children, className = "", id, required, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={`w-full appearance-none rounded-2xl border-2 bg-surface-card px-4 py-2.5 pr-10 text-sm font-semibold text-text transition-colors duration-200 outline-none focus:border-accent focus:bg-white cursor-pointer ${
              error ? "border-red-400" : "border-accent/40 hover:border-accent/70"
            } ${className}`}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

/**
 * ============================================================================
 * TEXTAREA COMPONENT
 * ============================================================================
 */
export const Textarea = forwardRef(
  ({ label, error, hint, className = "", id, required, rows = 3, ...props }, ref) => {
    const areaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={areaId} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
            {label} {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          required={required}
          className={`w-full rounded-2xl border-2 bg-surface-card px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 transition-colors duration-200 outline-none focus:border-accent focus:bg-white ${
            error ? "border-red-400 bg-red-50/50" : "border-accent/40 hover:border-accent/70"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs font-semibold text-red-700">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

/**
 * ============================================================================
 * CHECKBOX COMPONENT
 * ============================================================================
 */
export const Checkbox = forwardRef(
  ({ label, description, className = "", id, ...props }, ref) => {
    const checkId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    return (
      <label htmlFor={checkId} className={`flex items-start gap-2.5 cursor-pointer select-none ${className}`}>
        <input
          ref={ref}
          id={checkId}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded-md border-2 border-accent text-accent accent-accent focus:ring-accent cursor-pointer"
          {...props}
        />
        {(label || description) && (
          <div className="text-sm">
            {label && <span className="font-bold text-text block">{label}</span>}
            {description && <span className="text-xs text-text-muted block">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

/**
 * ============================================================================
 * BADGE COMPONENT
 * Tones: pink | sand | accent | success | error | warning | neutral
 * ============================================================================
 */
export const Badge = ({ children, tone = "pink", size = "sm", className = "" }) => {
  const tones = {
    pink: "bg-primary-soft text-text border border-primary/40",
    sand: "bg-surface text-text border border-accent/40",
    accent: "bg-accent/20 text-text border border-accent/60",
    success: "bg-success text-success-text border border-success-text/20",
    error: "bg-error text-error-text border border-error-text/20",
    warning: "bg-warning text-warning-text border border-warning-text/20",
    neutral: "bg-bg text-text border border-accent/30",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-bold uppercase tracking-wider ${
        tones[tone] || tones.pink
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};

/**
 * ============================================================================
 * CHIP COMPONENT (Interactive filter/tag pill)
 * ============================================================================
 */
export const Chip = ({
  children,
  active = false,
  onClick,
  onRemove,
  icon: Icon,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 cursor-pointer ${
        active
          ? "bg-primary text-text shadow-sm border border-accent"
          : "bg-surface text-text hover:bg-primary-soft/60 border border-accent/40"
      } ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span>{children}</span>
      {onRemove && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 -mr-1 rounded-full p-0.5 hover:bg-black/10"
        >
          <X className="h-3 w-3" />
        </span>
      )}
    </button>
  );
};

/**
 * ============================================================================
 * CARD COMPONENT
 * ============================================================================
 */
export const Card = ({
  children,
  className = "",
  hover = false,
  padding = "p-5",
  surface = "card",
  ...props
}) => {
  const surfaces = {
    card: "bg-surface-card border border-accent/25",
    surface: "bg-surface border border-accent/30",
    blush: "bg-blush-tint border border-primary/30",
    sand: "bg-sand-tint border border-accent/30",
  };

  return (
    <div
      className={`rounded-2xl shadow-sm transition-all duration-200 ${
        surfaces[surface] || surfaces.card
      } ${hover ? "hover:-translate-y-1 hover:shadow-md" : ""} ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * ============================================================================
 * MODAL COMPONENT
 * ============================================================================
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-text/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl bg-surface-card p-4 sm:p-6 shadow-2xl border-2 border-accent/30 animate-in zoom-in-95 duration-200`}
      >
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-accent/20">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-text">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-text-muted hover:bg-surface hover:text-text transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 sm:mt-4">{children}</div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * DRAWER COMPONENT (Slide-in panel for mobile filter/nav)
 * ============================================================================
 */
export const Drawer = ({
  isOpen,
  onClose,
  title,
  children,
  side = "left",
}) => {
  if (!isOpen) return null;

  const sideClasses = {
    left: "inset-y-0 left-0 max-w-[85vw] sm:max-w-xs w-full",
    right: "inset-y-0 right-0 max-w-[92vw] sm:max-w-md w-full",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl",
  };

  return (
    <div className="fixed inset-0 z-50 bg-text/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className={`fixed bg-surface-card p-4 sm:p-5 shadow-2xl overflow-y-auto ${
          sideClasses[side]
        } ${side === "left" ? "animate-in slide-in-from-left duration-200" : side === "right" ? "animate-in slide-in-from-right duration-200" : "animate-in slide-in-from-bottom duration-200"}`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-accent/20">
          <h3 className="font-serif text-lg font-bold text-text">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-text-muted hover:bg-surface hover:text-text cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 sm:mt-4">{children}</div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * TABS COMPONENT
 * ============================================================================
 */
export const Tabs = ({ tabs = [], activeTab, onChange, className = "" }) => (
  <div
    className={`flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-2.5 border-b border-accent/25 w-full max-w-full ${className}`}
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-shrink-0 whitespace-nowrap rounded-xl px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
            isActive
              ? "bg-primary text-text shadow-sm border border-accent/40 font-black"
              : "bg-surface/70 text-text-muted hover:bg-surface hover:text-text border border-transparent"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

/**
 * ============================================================================
 * ACCORDION COMPONENT
 * ============================================================================
 */
export const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-accent/30 bg-surface-card overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left font-bold text-text transition hover:bg-surface/50"
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-accent transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="border-t border-accent/20 p-4 text-sm text-text/90">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * BREADCRUMB COMPONENT
 * ============================================================================
 */
export const Breadcrumb = ({ items = [] }) => (
  <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-text-muted">
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <div key={index} className="flex items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3 w-3 text-accent" />}
          {isLast || !item.to ? (
            <span className="font-bold text-text truncate max-w-[200px]">{item.label}</span>
          ) : (
            <a href={item.to} className="hover:text-text hover:underline transition-colors">
              {item.label}
            </a>
          )}
        </div>
      );
    })}
  </nav>
);

/**
 * ============================================================================
 * PAGINATION COMPONENT
 * ============================================================================
 */
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 font-bold text-text ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ← Prev
      </Button>
      <span className="px-3 py-1 text-xs font-bold rounded-xl bg-surface border border-accent/30">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next →
      </Button>
    </div>
  );
};

/**
 * ============================================================================
 * SKELETON LOADERS
 * ============================================================================
 */
export const Skeleton = ({ className = "", rounded = "rounded-2xl" }) => (
  <div className={`animate-shimmer ${rounded} ${className}`} />
);

export const ProductSkeleton = () => (
  <div className="flex flex-col h-full justify-between overflow-hidden rounded-2xl bg-white border border-border p-2.5 sm:p-3.5 shadow-xs">
    <Skeleton className="aspect-square w-full rounded-xl" />
    <div className="mt-3 space-y-2 flex-1 flex flex-col justify-between">
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-1/3 rounded-md" />
        <Skeleton className="h-8 w-4/5 rounded-md" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
      </div>
      <div className="pt-2 flex justify-between items-center border-t border-border/60">
        <Skeleton className="h-5 w-16 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </div>
  </div>
);

/**
 * ============================================================================
 * LOADER, ERROR, & EMPTY STATES
 * ============================================================================
 */
export const Loader = ({ label = "Loading goodies…" }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-16 text-text">
    <div className="relative flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-soft border-t-primary" />
      <Sparkles className="absolute h-5 w-5 text-accent animate-pulse" />
    </div>
    <p className="font-serif font-bold text-base text-text">{label}</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="mx-auto max-w-md rounded-3xl bg-surface-card p-8 text-center shadow-md border-2 border-red-200">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-error text-error-text mb-4">
      <AlertCircle className="h-8 w-8" />
    </div>
    <h3 className="font-serif text-xl font-bold text-text">Oops! Something went wrong</h3>
    <p className="mt-2 text-sm text-text-muted">{message || "We couldn't load the information. Please try again."}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="primary" className="mt-5">
        Try Again
      </Button>
    )}
  </div>
);

export const EmptyState = ({ title, hint, action, icon: Icon = PackageSearch }) => (
  <div className="mx-auto max-w-md rounded-3xl bg-surface-card p-8 text-center shadow-sm border border-accent/30">
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-soft/60 text-text mb-4">
      <Icon className="h-8 w-8 text-accent" />
    </div>
    <h3 className="font-serif text-xl font-bold text-text">{title}</h3>
    {hint && <p className="mt-1 text-sm text-text-muted">{hint}</p>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

/**
 * ============================================================================
 * STARS & RATING SELECT
 * ============================================================================
 */
export const Stars = ({ value = 0, size = "sm", count }) => {
  const starSizes = {
    xs: "h-3 w-3",
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  const iconSize = starSizes[size] || starSizes.sm;
  const rating = Math.round(Number(value) || 0);

  return (
    <div className="inline-flex items-center gap-1" aria-label={`${value} out of 5 stars`}>
      <div className="flex text-accent">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${iconSize} ${
              i <= rating ? "fill-accent text-accent" : "fill-none text-accent/40"
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs font-bold text-text-muted">({count})</span>
      )}
    </div>
  );
};

export const RatingSelect = ({ value = 5, onChange }) => (
  <div className="flex items-center gap-1.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="rounded-lg p-1 hover:scale-110 transition-transform cursor-pointer"
        aria-label={`${star} star rating`}
      >
        <Star
          className={`h-6 w-6 ${
            star <= value
              ? "fill-accent text-accent"
              : "fill-none text-accent/40"
          }`}
        />
      </button>
    ))}
  </div>
);

/**
 * ============================================================================
 * PRICE DISPLAY COMPONENT
 * ============================================================================
 */
export const Price = ({ price = 0, mrp, big = false, className = "" }) => {
  const hasDiscount = mrp && mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className={`flex flex-wrap items-baseline gap-1.5 sm:gap-2 ${className}`}>
      <span className={`text-text tracking-tight font-bold tabular-nums ${big ? "text-2xl sm:text-3xl" : "text-sm sm:text-base font-semibold"}`}>
        ₹{Number(price).toLocaleString("en-IN")}
      </span>
      {hasDiscount && (
        <>
          <span className={`text-text-muted line-through font-normal tabular-nums ${big ? "text-base sm:text-lg" : "text-[10px] sm:text-xs"}`}>
            ₹{Number(mrp).toLocaleString("en-IN")}
          </span>
          <span className="rounded-full bg-primary-soft/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-text border border-primary/30">
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  );
};

/**
 * ============================================================================
 * QUANTITY STEPPER (Accessible touch targets)
 * ============================================================================
 */
export const QuantityStepper = ({
  value = 1,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="inline-flex items-center rounded-2xl border-2 border-accent/40 bg-surface-card p-1 shadow-xs">
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-text hover:bg-primary-soft disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-10 text-center text-sm font-extrabold text-text select-none">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-text hover:bg-primary-soft disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

/**
 * ============================================================================
 * SECTION TITLE
 * ============================================================================
 */
export const SectionTitle = ({ title, sub, align = "center", className = "" }) => (
  <div className={`mb-6 ${align === "center" ? "text-center" : "text-left"} ${className}`}>
    <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-text">
      {title}
    </h2>
    {sub && <p className="mt-1.5 text-sm font-medium text-text-muted max-w-xl mx-auto">{sub}</p>}
  </div>
);

/**
 * ============================================================================
 * FIELD WRAPPER
 * ============================================================================
 */
export const Field = ({ label, children, hint, error, required }) => (
  <label className="block w-full">
    {label && (
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
        {label} {required && <span className="text-red-600">*</span>}
      </span>
    )}
    {children}
    {error && <span className="mt-1 block text-xs font-semibold text-red-700">{error}</span>}
    {hint && !error && <span className="mt-1 block text-xs text-text-muted">{hint}</span>}
  </label>
);

/**
 * ============================================================================
 * BACKWARD-COMPATIBLE UTILITY STRINGS
 * ============================================================================
 */
export const inputCls =
  "w-full rounded-2xl border-2 border-accent/40 bg-surface-card px-4 py-2.5 text-sm text-text placeholder:text-text-muted/60 outline-none transition-colors duration-200 focus:border-accent focus:bg-white";

export const btnPrimary =
  "rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-text shadow-sm hover:bg-primary-soft hover:shadow transition-all duration-200 disabled:opacity-50 cursor-pointer border border-accent/20";

export const btnSecondary =
  "rounded-full border-2 border-accent/60 bg-surface px-6 py-2.5 text-sm font-bold text-text shadow-xs hover:bg-sand-tint hover:border-accent transition-all duration-200 disabled:opacity-50 cursor-pointer";
