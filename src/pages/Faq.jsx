import { Link } from "react-router-dom";
import { Breadcrumb, Button } from "../components/ui.jsx";
import { AccordionItem } from "../components/ui.jsx";
import { MessageCircle } from "lucide-react";

const FAQS = [
  {
    group: "Orders & Tracking",
    items: [
      {
        q: "How do I track my order?",
        a: "Go to My Orders and open the order — you'll see a live status timeline from Placed to Delivered. Tracking numbers appear there as soon as your parcel ships.",
      },
      {
        q: "Can I cancel my order?",
        a: "Yes — free cancellation while the status is Placed, Confirmed or Processing, directly from the order page. Prepaid orders are refunded to the original payment source within 5–7 working days.",
      },
      {
        q: "What is the gift wrap option?",
        a: "At checkout you can add gift wrap (₹49, calculated on the server) plus a personal message up to 200 characters. It shows on the success screen and order details.",
      },
    ],
  },
  {
    group: "Shipping & Delivery",
    items: [
      {
        q: "How much is delivery and how long does it take?",
        a: "Orders above ₹999 ship FREE; below that a flat ₹99 applies. We dispatch in 24–48 hours and deliver in 3–7 working days depending on your pincode. Use the delivery checker on any product page for an estimate.",
      },
      {
        q: "Is Cash on Delivery (COD) available?",
        a: "Yes, for orders below ₹5,000. Higher-value orders must be prepaid online via Razorpay (UPI, cards, netbanking).",
      },
    ],
  },
  {
    group: "Returns & Refunds",
    items: [
      {
        q: "Can I return jewellery?",
        a: "Jewellery is non-returnable for hygiene and authenticity reasons — please check dimensions, material and purity carefully before ordering.",
      },
      {
        q: "What about toy returns?",
        a: "Eligible toys can be returned within 7 days of delivery in original packaging. Damaged parcels? Share an unboxing photo within 48 hours via Contact Us for a free replacement or full refund.",
      },
    ],
  },
  {
    group: "Account & Wishlist",
    items: [
      {
        q: "How does the wishlist work?",
        a: "Tap the heart on any product to save it. Your wishlist syncs to your account, so it follows you across devices. Move items to cart in one tap from the wishlist page.",
      },
      {
        q: "I forgot my password. What do I do?",
        a: "Use Forgot Password on the login page — we'll email you a secure reset link valid for 30 minutes.",
      },
    ],
  },
];

const Faq = () => (
  <div className="mx-auto max-w-5xl space-y-6">
    <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "FAQs" }]} />

    <div className="text-center space-y-2">
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-primary-hover">
        Help Center
      </p>
      <h1 className="font-serif text-3xl sm:text-4xl font-black text-text">
        Frequently Asked Questions
      </h1>
    </div>

    {FAQS.map((section) => (
      <section key={section.group} className="space-y-3">
        <h2 className="font-serif font-bold text-lg text-text border-b border-accent/20 pb-2">
          {section.group}
        </h2>
        {section.items.map((f) => (
          <AccordionItem key={f.q} title={f.q}>
            <p className="leading-relaxed">{f.a}</p>
          </AccordionItem>
        ))}
      </section>
    ))}

    <div className="rounded-2xl bg-primary-soft/60 p-5 border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs text-text-muted text-center sm:text-left">
        Still have questions? Reach out to our customer support team at <b>support@shree.in</b>.
      </p>
      <Link to="/contact">
        <Button variant="primary" size="sm" icon={MessageCircle}>Contact Us</Button>
      </Link>
    </div>
  </div>
);

export default Faq;
