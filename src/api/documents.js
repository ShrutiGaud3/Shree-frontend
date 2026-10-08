import api from "./client.js";

// Download helpers for authed binary/CSV endpoints (real API, never mock).
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadOrderInvoice = async (orderId, isAdmin = false) => {
  const path = isAdmin ? `/admin/orders/${orderId}/invoice` : `/orders/${orderId}/invoice`;
  const { data, headers } = await api.get(path, { responseType: "blob" });
  const match = /filename="([^"]+)"/.exec(headers?.["content-disposition"] || "");
  downloadBlob(data, match?.[1] || `SHREE-${String(orderId).slice(-8).toUpperCase()}.pdf`);
};

export const downloadReport = async (type, from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  const { data } = await api.get(`/admin/reports/${type}`, { params, responseType: "blob" });
  const stamp = new Date().toISOString().slice(0, 10);
  downloadBlob(data, `shree-${type}-${stamp}.csv`);
};
