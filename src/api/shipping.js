import api, { apiError } from "./client.js";

// Real backend call — server computes ETA/zone from STORE_CONFIG.
export const checkPincode = async (pincode) => {
  const { data } = await api.get(`/shipping/check/${pincode}`);
  return data;
};

export { apiError };
