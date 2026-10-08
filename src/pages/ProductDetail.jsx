import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api, { apiError } from "../api/client.js";
import { checkPincode, apiError as shipError } from "../api/shipping.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import ZoomImage from "../components/ZoomImage.jsx";
import { getWishlist, addToWishlist, removeFromWishlist, notifyWishlistUpdated } from "../api/wishlist.js";

const notifyCartUpdated = () => window.dispatchEvent(new Event("shree:cart-updated"));
import { useAuth } from "../context/AuthContext.jsx";
import { CATEGORIES } from "../config/site.js";
import ProductCard from "../components/ProductCard.jsx";
import {
  Badge,
  ErrorState,
  Loader,
  Price,
  Stars,
  RatingSelect,
  Breadcrumb,
  QuantityStepper,
  Button,
  Tabs,
  Field,
  Input,
  Textarea,
  AccordionItem,
} from "../components/ui.jsx";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Gift,
  Gem,
  Check,
} from "lucide-react";

const ProductDetail = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [product, setProduct] = useState(null);
  const [state, setState] = useState("loading");
  const [error, setError] = useState("");
  const [variant, setVariant] = useState("");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [activeTab, setActiveTab] = useState("specs");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [form, setForm] = useState({ rating: 5, title: "", text: "" });
  const [pin, setPin] = useState("");
  const [pinState, setPinState] = useState("idle");
  const [pinResult, setPinResult] = useState(null);
  const [pinError, setPinError] = useState("");
  const [wished, setWished] = useState(false);
  const [wishing, setWishing] = useState(false);
  const recentItems = useRecentlyViewed(product);

  useEffect(() => {
    setState("loading");
    window.scrollTo({ top: 0, behavior: "smooth" });
    api
      .get(`/products/${pid}`)
      .then(({ data }) => {
        setProduct(data);
        setVariant("");
        setQty(1);
        setState("done");

        // Fetch reviews
        api
          .get(`/products/${data._id}/review/`)
          .then(({ data: revs }) => setReviews(revs || []))
          .catch(() => setReviews([]));

        // Fetch related products in the same category
        api
          .get("/products", { params: { category: data.category, limit: 4 } })
          .then(({ data: relData }) => {
            setRelated((relData.items || []).filter((x) => x._id !== data._id).slice(0, 4));
          })
          .catch(() => {});

        // True wishlist state for the heart button (logged-in only)
        if (isLoggedIn) {
          getWishlist()
            .then((w) => setWished((w.items || []).some((i) => i.product?._id === data._id)))
            .catch(() => {});
        } else {
          setWished(false);
        }
      })
      .catch((e) => {
        setError(apiError(e, "Product not found"));
        setState("error");
      });
  }, [pid, isLoggedIn]);

  const selectedVariant = product?.variants?.find((v) => v.sku === variant);
  const maxStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const isOutOfStock = maxStock === 0;

  const handleAddToCart = async (redirectToCheckout = false) => {
    if (!isLoggedIn) {
      return navigate("/login", { state: { from: `/products/${pid}` } });
    }
    if (product.variants?.length && !variant) {
      return toast.warn("Please select a variant option first.");
    }
    setAddingToCart(true);
    try {
      await api.post("/cart", {
        productId: product._id,
        qty,
        ...(variant ? { variantSku: variant } : {}),
      });
      notifyCartUpdated();
      if (redirectToCheckout) {
        navigate("/checkout");
      } else {
        toast.success(`Added ${product.name} to cart! 🛒`);
        navigate("/cart");
      }
    } catch (e) {
      toast.error(apiError(e));
    } finally {
      setAddingToCart(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      return navigate("/login", { state: { from: `/products/${pid}` } });
    }
    setSubmittingReview(true);
    try {
      const { data } = await api.post(`/products/${product._id}/review/`, form);
      setReviews([data, ...reviews]);
      setForm({ rating: 5, title: "", text: "" });
      toast.success("Thank you! Your review has been posted. ✨");
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  const toggleWish = async () => {
    if (!isLoggedIn) {
      return navigate("/login", { state: { from: `/products/${pid}` } });
    }
    setWishing(true);
    try {
      if (wished) {
        await removeFromWishlist(product._id);
        setWished(false);
      } else {
        await addToWishlist(product._id);
        setWished(true);
        toast.success("Saved to wishlist! 💗");
      }
      notifyWishlistUpdated();
    } catch (err) {
      toast.error(apiError(err));
    } finally {
      setWishing(false);
    }
  };

  const checkDelivery = async (e) => {    e?.preventDefault();
    const code = pin.trim();
    if (!/^\d{6}$/.test(code)) {
      setPinError("Enter a valid 6-digit pincode.");
      setPinState("error");
      setPinResult(null);
      return;
    }
    setPinState("loading");
    setPinError("");
    try {
      const data = await checkPincode(code);
      setPinResult(data);
      setPinState("done");
    } catch (err) {
      setPinError(shipError(err, "Could not check delivery for this pincode."));
      setPinState("error");
      setPinResult(null);
    }
  };

  if (state === "loading") {
    return <Loader label="Opening the gift box…" />;
  }
  if (state === "error") {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  const tf = product.category === "toys" ? product.toysFields : product.jewelleryFields;

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    {
      label: CATEGORIES[product.category]?.label || product.category,
      to: `/products?category=${product.category}`,
    },
    ...(product.subCategory
      ? [
          {
            label: product.subCategory.replace(/-/g, " "),
            to: `/products?category=${product.category}&subCategory=${product.subCategory}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <div className="space-y-12">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Product Presentation Grid */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Image Gallery (hover zoom + fullscreen viewer) */}
        <div className="relative">
          {product.mrp > product.price && (
            <span className="absolute top-4 left-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-wider text-text shadow-sm border border-accent/30">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
            </span>
          )}
          <ZoomImage images={product.images} productName={product.name} category={product.category} />
        </div>

        {/* Right: Product Information & Purchase Area */}
        <div className="flex flex-col space-y-4 sm:space-y-5 rounded-3xl bg-surface-card p-4 sm:p-8 border-2 border-accent/25 shadow-sm">
          {/* Header Tag / Brand */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={product.category === "toys" ? "pink" : "sand"}>
              {product.category}
            </Badge>
            {product.subCategory && (
              <Badge tone="neutral">{product.subCategory.replace(/-/g, " ")}</Badge>
            )}
            {product.brand && (
              <span className="rounded-full bg-surface px-3 py-0.5 text-xs font-bold text-text-muted border border-accent/30">
                Brand: {product.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-text leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Stars value={product.ratingAvg || 5} size="md" />
            <span className="text-xs font-bold text-text">
              {product.ratingAvg?.toFixed(1) || "5.0"}
            </span>
            <span className="text-xs text-text-muted">
              ({reviews.length} verified {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>

          {/* Price Block */}
          <div className="rounded-2xl bg-surface/60 p-4 border border-accent/25">
            <Price price={currentPrice} mrp={product.mrp} big />
            <p className="mt-1 text-xs font-semibold text-text-muted">
              Inclusive of all taxes ({product.gstRate ?? 18}% GST). Free delivery on orders above ₹999.
            </p>
          </div>

          {/* Description */}
          <p className="text-sm font-medium text-text/90 leading-relaxed">
            {product.description}
          </p>

          {/* Variants Selector */}
          {product.variants?.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-accent/20">
              <label className="block text-xs font-black uppercase tracking-wider text-text">
                Select Option / Style:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = variant === v.sku;
                  const isVarOutOfStock = v.stock === 0;
                  return (
                    <button
                      key={v.sku}
                      type="button"
                      disabled={isVarOutOfStock}
                      onClick={() => setVariant(v.sku)}
                      className={`flex items-center gap-2 rounded-2xl border-2 px-4 py-2 text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? "border-accent bg-primary text-text shadow-sm"
                          : "border-accent/40 bg-surface-card text-text hover:border-accent"
                      } ${isVarOutOfStock ? "opacity-40 line-through cursor-not-allowed" : ""}`}
                    >
                      <span>{v.label}</span>
                      <span>·</span>
                      <span>₹{v.price}</span>
                      {isVarOutOfStock && <span className="text-red-700">(Out)</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Alert Status */}
          <div className="pt-2">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <span>Currently Out of Stock. Check back soon!</span>
              </div>
            ) : maxStock <= 5 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <Clock className="h-4 w-4 text-amber-700" />
                <span>Hurry! Only {maxStock} left in stock.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-green-800 bg-green-50 p-2.5 rounded-xl border border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
                <span>In Stock & Ready to Dispatch within 24 Hours</span>
              </div>
            )}
          </div>

          {/* Quantity & Action Buttons */}
          {!isOutOfStock && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-text">
                  Quantity:
                </span>
                <QuantityStepper
                  value={qty}
                  min={1}
                  max={Math.max(maxStock, 1)}
                  onChange={(val) => setQty(val)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-2">
                <Button
                  variant="primary"
                  size="md"
                  icon={ShoppingBag}
                  loading={addingToCart}
                  onClick={() => handleAddToCart(false)}
                  className="w-full text-xs sm:text-sm font-bold shadow-xs"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  icon={Zap}
                  loading={addingToCart}
                  onClick={() => handleAddToCart(true)}
                  className="w-full text-xs sm:text-sm font-bold shadow-xs"
                >
                  Buy Now
                </Button>
              </div>

              <Button
                variant="outline"
                size="md"
                icon={Heart}
                loading={wishing}
                onClick={toggleWish}
                aria-pressed={wished}
                className="w-full text-xs sm:text-sm font-bold"
              >
                {wished ? "Saved to Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-accent/20 text-xs font-semibold text-text-muted">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              <span>Free Delivery &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>100% Genuine Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-accent" />
              <span>{product.isReturnable ? "7-Day Easy Returns" : "Non-Returnable Item"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span>COD Available</span>
            </div>
          </div>

          {/* Delivery pincode check (real API: GET /api/shipping/check/:pincode) */}
          <div className="rounded-2xl bg-surface/60 p-4 border border-accent/25 space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-accent" />
              <p className="text-xs font-black uppercase tracking-wider text-text">
                Check Delivery Date
              </p>
            </div>
            <form onSubmit={checkDelivery} className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter pincode"
                aria-label="Delivery pincode"
                className="w-full rounded-xl border-2 border-accent/40 bg-surface-card px-3 py-2 text-sm font-bold text-text outline-none focus:border-accent"
              />
              <Button type="submit" variant="secondary" size="sm" loading={pinState === "loading"}>
                Check
              </Button>
            </form>
            {pinState === "done" && pinResult && (
              <div className="flex items-start gap-2 text-xs font-semibold text-green-800 bg-green-50 p-3 rounded-xl border border-green-200">
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-700" />
                <span>
                  {pinResult.message} COD available
                  {pinResult.freeShippingThreshold
                    ? ` · Free shipping above ₹${pinResult.freeShippingThreshold}.`
                    : "."}
                </span>
              </div>
            )}
            {pinState === "error" && (
              <div className="flex items-start gap-2 text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{pinError}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs / Specifications & Details Section */}
      <section className="rounded-3xl bg-surface-card p-4 sm:p-8 border-2 border-accent/25 shadow-sm">
        <Tabs
          tabs={[
            { id: "specs", label: "Specifications" },
            { id: "shipping", label: "Shipping & Returns" },
            { id: "care", label: "Care Instructions" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="mt-5 sm:mt-6">
          {activeTab === "specs" && (
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-text">Technical Details</h3>
              {tf ? (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-sm">
                  {product.category === "toys" && (
                    <>
                      {tf.ageGroup && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Target Age Group</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.ageGroup} Years</dd>
                        </div>
                      )}
                      {tf.batteryRequired !== undefined && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Battery Required</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.batteryRequired ? "Yes (Required)" : "No Batteries Needed"}</dd>
                        </div>
                      )}
                      {tf.safetyCertifications?.length > 0 && (
                        <div className="col-span-full rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Safety Standard Certifications</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.safetyCertifications.join(", ")}</dd>
                        </div>
                      )}
                    </>
                  )}

                  {product.category === "jewellery" && (
                    <>
                      {tf.material && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Base Material</dt>
                          <dd className="font-bold text-text mt-0.5 capitalize">{tf.material.replace(/-/g, " ")}</dd>
                        </div>
                      )}
                      {tf.purity && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Purity / Hallmark</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.purity}</dd>
                        </div>
                      )}
                      {tf.stoneType && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Stone / Embellishment</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.stoneType}</dd>
                        </div>
                      )}
                      {tf.weightGrams != null && (
                        <div className="rounded-xl bg-surface/50 p-3 border border-accent/20">
                          <dt className="font-bold text-text-muted text-xs uppercase">Gross Weight</dt>
                          <dd className="font-bold text-text mt-0.5">{tf.weightGrams} Grams</dd>
                        </div>
                      )}
                    </>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-text-muted">Standard product specifications apply.</p>
              )}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-3 text-sm text-text/90 leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-text">Shipping & Return Guidelines</h3>
              <p>• <b>Dispatch:</b> Orders are dispatched within 24 to 48 hours from our central warehouse.</p>
              <p>• <b>Delivery Timelines:</b> Express delivery in 3 to 7 working days depending on your delivery pincode across India.</p>
              <p>• <b>Return Policy:</b> {product.isReturnable ? "This toy item is eligible for 7-day hassle-free replacement or refund if damaged." : "Jewellery items are non-returnable due to hygiene and value reasons."}</p>
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-3 text-sm text-text/90 leading-relaxed">
              <h3 className="font-serif font-bold text-lg text-text">Maintenance & Care</h3>
              {tf?.careInstructions ? (
                <p>{tf.careInstructions}</p>
              ) : (
                <p>
                  Keep away from direct water, moisture, and chemical perfumes. Store jewellery in air-tight zip pouches when not in use. Clean toys with a soft damp cloth.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="rounded-3xl bg-surface-card p-4 sm:p-8 border-2 border-accent/25 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-accent/20 pb-6">
          <div>
            <h2 className="font-serif text-2xl font-black text-text">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <Stars value={product.ratingAvg || 5} size="md" />
              <span className="text-sm font-bold text-text">
                {product.ratingAvg?.toFixed(1) || "5.0"} out of 5 stars
              </span>
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        <form onSubmit={submitReview} className="mt-6 rounded-2xl bg-surface/60 p-5 border border-accent/30 space-y-4">
          <h3 className="font-serif font-bold text-base text-text">Write a Review</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-text">
                Your Rating
              </label>
              <RatingSelect
                value={form.rating}
                onChange={(r) => setForm({ ...form, rating: r })}
              />
            </div>
            <Input
              label="Review Headline (Optional)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Loved the quality!"
            />
          </div>
          <Textarea
            label="Your Experience"
            required
            rows={3}
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Share how much you enjoyed the product…"
          />
          <Button
            type="submit"
            variant="primary"
            loading={submittingReview}
            icon={Sparkles}
          >
            Submit Review
          </Button>
        </form>

        {/* Reviews List */}
        <div className="mt-8 space-y-3">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="rounded-2xl bg-surface/40 p-4 border border-accent/20 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} size="xs" />
                  <span className="font-bold text-xs text-text">{r.user?.name || "Verified Customer"}</span>
                  {r.isVerifiedBuyer && <Badge tone="success" size="xs">Verified Buyer</Badge>}
                </div>
              </div>
              {r.title && <p className="font-serif font-bold text-sm text-text">{r.title}</p>}
              <p className="text-xs text-text-muted leading-relaxed">{r.text}</p>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="py-8 text-center text-sm font-semibold text-text-muted">
              No reviews yet. Be the first to share your thoughts about this product!
            </div>
          )}
        </div>
      </section>

      {/* Related Products Discovery */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-text">You Might Also Love</h2>
            <Link
              to={`/products?category=${product.category}`}
              className="text-xs font-bold text-text hover:underline"
            >
              View More {CATEGORIES[product.category]?.label} →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed (device-local history of real API products) */}
      {recentItems.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-text">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {recentItems.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add to Cart Bar */}
      {!isOutOfStock && (
        <div className="fixed bottom-16 inset-x-0 z-30 bg-surface-card/95 backdrop-blur-md p-3 border-t-2 border-accent/30 shadow-lg md:hidden flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-text-muted">Total Price</p>
            <p className="font-serif font-extrabold text-lg text-text">₹{currentPrice}</p>
          </div>
          <Button
            variant="primary"
            size="md"
            icon={ShoppingBag}
            loading={addingToCart}
            onClick={() => handleAddToCart(false)}
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
