import { apiFetch } from "./client";

export async function getSpendings(token) {
  return apiFetch("/spending", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

export async function createSpending(token, spending) {
  return apiFetch("/spending", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(spending),
  });
}

export async function updateSpending(token, id, spending) {
  return apiFetch(`/spending/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(spending),
  });
}

export async function deleteSpending(token, id) {
  return apiFetch(`/spending/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}