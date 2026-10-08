import api from "./client.js";

export const WISHLIST_UPDATED_EVENT = "shree:wishlist-updated";
export const notifyWishlistUpdated = () => window.dispatchEvent(new Event(WISHLIST_UPDATED_EVENT));

// Real backend calls — wishlist lives in MongoDB, never mocked.
export const getWishlist = async () => (await api.get("/wishlist")).data;
export const addToWishlist = async (productId) => (await api.post("/wishlist", { productId })).data;
export const removeFromWishlist = async (productId) => (await api.delete(`/wishlist/${productId}`)).data;
