import api from "./client.js";

// Real backend calls — homepage content lives in MongoDB (CmsBlock).
export const getBlocks = async (section) => {
  const { data } = await api.get("/cms", { params: section ? { section } : {} });
  return data || [];
};
