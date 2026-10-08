import { useState } from "react";

const KEY = "shree_recently_viewed";
const MAX = 8;

const readAll = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const snapshotOf = (p) => ({
  _id: p._id,
  name: p.name,
  price: p.price,
  mrp: p.mrp,
  slug: p.slug,
  category: p.category,
  ratingAvg: p.ratingAvg,
  images: (p.images || []).slice(0, 2),
});

// Stores snapshots of REAL products fetched from the API (never mock data).
// Device-local history — no backend needed. Uses the render-time state
// adjustment pattern (lint-clean) with an idempotent storage write.
export const useRecentlyViewed = (currentProduct) => {
  const id = currentProduct?._id;
  const [prevId, setPrevId] = useState(id);
  const [items, setItems] = useState(() => readAll().filter((p) => p._id !== id));

  if (id !== prevId) {
    setPrevId(id);
    if (id && currentProduct) {
      const next = [snapshotOf(currentProduct), ...readAll().filter((p) => p._id !== id)].slice(0, MAX);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // storage unavailable (private mode) — history simply stays empty
      }
      setItems(next.filter((p) => p._id !== id));
    } else {
      setItems(readAll());
    }
  }

  return items;
};
