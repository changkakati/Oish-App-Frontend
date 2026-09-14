import { apiFetch } from "./client";

export async function getDashboard(token, month) {
  const query = month ? `?month=${month}` : "";

  return apiFetch(`/dashboard${query}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}