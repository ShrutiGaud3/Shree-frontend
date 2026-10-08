import api from "./client.js";

// Real backend call — subscribers live in MongoDB (idempotent).
export const subscribeNewsletter = async (email, source = "footer") => {
  const { data } = await api.post("/newsletter/subscribe", { email, source });
  return data;
};
