import { STORE_NAME } from "../config/site.js";
import { Breadcrumb, Button, Input, Textarea } from "../components/ui.jsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import api, { apiError } from "../api/client.js";
import {
  ShieldCheck,
  FileText,
  RotateCcw,
  Truck,
  Mail,
  Clock,
  MessageCircle,
  AlertCircle,
  Phone,
  CheckCircle2,
  Send,
  ShoppingBag,
} from "lucide-react";

const LegalPageWrapper = ({ title, subtitle, icon: Icon, breadcrumb, children }) => (
  <div className="mx-auto max-w-5xl space-y-6">
    <Breadcrumb
      items={[{ label: "Home", to: "/" }, { label: breadcrumb || title }]}
    />

    <article className="rounded-3xl bg-surface-card p-5 sm:p-10 border-2 border-accent/25 shadow-xs space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3.5 sm:gap-4 border-b border-accent/20 pb-4 sm:pb-6">
        <div className="flex h-11 w-11 sm:h-13 sm:w-13 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-text shadow-2xs border border-accent/30">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-text">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-text-muted mt-0.5 sm:mt-1 font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-5 sm:space-y-6 text-xs sm:text-sm text-text-muted leading-relaxed font-normal">
        {children}
      </div>
    </article>
  </div>
);

export const Privacy = () => (
  <LegalPageWrapper
    title="Privacy Policy"
    subtitle="How we collect, protect, and handle your data at Shree"
    icon={ShieldCheck}
    breadcrumb="Privacy"
  >
    <p>
      Last updated: <b>2026</b>. At <b>{STORE_NAME}</b>, we are deeply committed to safeguarding the privacy and personal data of our customers across India.
    </p>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">1. Information We Collect</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        We collect essential information required to deliver your orders: your full name, email address, 10-digit mobile number, shipping address, and past purchase history. All online payments are securely processed directly by <b>Razorpay</b> — we never view, capture, or store your credit card, debit card, or UPI credentials.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">2. How We Utilize Your Data</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        Your data is strictly utilized to process parcel dispatches, compute automated GST and shipping logistics, prevent fraudulent activity, improve customer service, and send transactional email updates for orders and password resets. We do not sell your personal data to third parties.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">3. Customer Rights & Data Deletion</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        You may request a copy or complete deletion of your profile data at any time by writing to our support team at <b>support@shree.in</b>.
      </p>
    </div>
  </LegalPageWrapper>
);

export const Terms = () => (
  <LegalPageWrapper
    title="Terms of Service"
    subtitle="General rules and conditions for shopping at Shree"
    icon={FileText}
    breadcrumb="Terms"
  >
    <p>
      Welcome to <b>{STORE_NAME}</b>. By placing an order or browsing our catalog, you agree to the following terms and guidelines.
    </p>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">1. Pricing & Payment Settlement</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        All catalogue prices are listed in Indian Rupees (INR) and include applicable Goods and Services Tax (GST). Cash on Delivery (COD) is available for orders under ₹5,000. Higher-value orders must be prepaid online using Razorpay for security verification.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">2. Product Availability & Stock Reservation</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        Stock is temporarily reserved upon checkout initiation. Unpaid online payment orders automatically expire and release inventory after 30 minutes.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">3. Account Integrity</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        Users are responsible for maintaining the confidentiality of their credentials. {STORE_NAME} reserves the right to deactivate accounts exhibiting fraudulent or malicious conduct.
      </p>
    </div>
  </LegalPageWrapper>
);

export const Refunds = () => (
  <LegalPageWrapper
    title="Refund & Cancellation Policy"
    subtitle="Clear and transparent replacement, return, and refund standards"
    icon={RotateCcw}
    breadcrumb="Refunds"
  >
    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">1. Order Cancellation</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        You can cancel your order free of charge at any time while its status is <b>Placed</b>, <b>Confirmed</b>, or <b>Processing</b> directly from your <i>My Orders</i> dashboard. For prepaid orders, full refunds are credited back to your original payment source within 5–7 working days.
      </p>
    </div>

    {/* Notice for Jewellery */}
    <div className="rounded-2xl bg-amber-50 p-4 border border-amber-300 space-y-2">
      <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-sm">
        <AlertCircle className="h-4 w-4 text-amber-700" />
        <span>Important Note on Jewellery Hygiene</span>
      </div>
      <p className="text-xs text-amber-900 leading-relaxed">
        <b>Jewellery items are non-returnable</b> due to personal hygiene and precious stone authenticity reasons. Please inspect dimensions, purity ratings, and materials carefully prior to checkout.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">2. Toy Returns & Replacements</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        Toys marked as returnable can be returned or exchanged within <b>7 days of delivery</b> if received in original packaging with all accessories intact.
      </p>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">3. Damaged or Defective Parcels</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        In the rare event of receiving a damaged item, kindly share an unboxing photo with our team via the Contact Us page within 48 hours. We will promptly arrange a free replacement or 100% refund.
      </p>
    </div>
  </LegalPageWrapper>
);

export const Shipping = () => (
  <LegalPageWrapper
    title="Shipping & Delivery"
    subtitle="Fast dispatch and trusted courier partners across India"
    icon={Truck}
    breadcrumb="Shipping"
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-1.5">
        <h2 className="font-serif font-bold text-base text-text">Free Shipping Above ₹999</h2>
        <p className="text-xs text-text-muted">
          All orders valuing ₹999 or more qualify for 100% FREE express shipping. Orders below ₹999 incur a nominal flat shipping fee of ₹99.
        </p>
      </div>

      <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-1.5">
        <h2 className="font-serif font-bold text-base text-text">Delivery Timelines</h2>
        <p className="text-xs text-text-muted">
          Orders are dispatched within 24–48 hours from our central warehouse and delivered within 3–7 business days depending on your postal pincode.
        </p>
      </div>
    </div>

    <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
      <h2 className="font-serif font-bold text-base text-text">Real-Time Parcel Tracking</h2>
      <p className="text-xs text-text-muted leading-relaxed">
        As soon as your package is dispatched, your tracking reference is updated directly on your <b>My Orders</b> page and shared via email.
      </p>
    </div>
  </LegalPageWrapper>
);

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [state, setState] = useState("idle");
  const [note, setNote] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    setNote("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
      };
      const { data } = await api.post("/support", payload);
      setNote(data.message || "Message received!");
      setState("done");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setNote(apiError(err, "Could not send. Try emailing us directly."));
      setState("error");
    }
  };

  return (
  <LegalPageWrapper
    title="Contact Customer Support"
    subtitle="We're here to assist with toys, jewellery, and order inquiries"
    icon={Mail}
    breadcrumb="Contact"
  >
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-accent" />
          <h2 className="font-bold text-sm sm:text-base text-text">Email Support</h2>
        </div>
        <p className="text-xs text-text-muted">
          Write to us at: <b className="text-text font-semibold">support@shree.in</b>
        </p>
        <p className="text-[11px] text-text-muted">
          Expected response time: Under 4 hours on working days.
        </p>
      </div>

      <div className="rounded-2xl bg-surface/50 p-4 border border-accent/20 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent" />
          <h2 className="font-bold text-sm sm:text-base text-text">Operating Hours</h2>
        </div>
        <p className="text-xs text-text-muted">
          Monday to Saturday: <b className="text-text font-semibold">10:00 AM – 7:00 PM IST</b>
        </p>
        <p className="text-[11px] text-text-muted">
          Closed on National Holidays.
        </p>
      </div>
    </div>

    {/* Real contact form → admin support inbox (POST /api/support) */}
    <form onSubmit={submit} className="rounded-2xl bg-surface/50 p-4 sm:p-6 border border-accent/20 space-y-3.5">
      <h2 className="font-bold text-base sm:text-lg text-text">Send Us a Message</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Your Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
        <Input label="Email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Input label="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile" />
        <Input label="Subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Order delayed" />
      </div>
      <Textarea label="Message (min 10 characters)" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
      {state === "done" && <p className="text-xs font-bold text-green-800 bg-green-50 p-3 rounded-xl border border-green-200">{note}</p>}
      {state === "error" && <p className="text-xs font-bold text-red-700 bg-red-50 p-3 rounded-xl border border-red-200">{note}</p>}
      <Button type="submit" variant="primary" size="sm" loading={state === "sending"} icon={Send}>
        Send Message
      </Button>
    </form>

    <div className="rounded-2xl bg-primary-soft/60 p-5 border border-accent/30 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="font-bold text-base text-text">
          Looking for Gifts & Jewellery?
        </h2>
        <p className="text-xs text-text-muted font-normal">
          Browse our curated collections of handcrafted jewellery and toys for all ages!
        </p>
      </div>
      <Link to="/products">
        <Button variant="primary" size="sm" icon={ShoppingBag}>
          Explore Catalog
        </Button>
      </Link>
    </div>
  </LegalPageWrapper>
  );
};
