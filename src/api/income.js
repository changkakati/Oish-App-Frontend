import { apiFetch } from "./client";

export async function getIncomes(token) {
  return apiFetch("/income", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

export async function createIncome(token, income) {
  return apiFetch("/income", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(income),
  });
}

export async function updateIncome(token, id, income) {
  return apiFetch(`/income/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(income),
  });
}

export async function deleteIncome(token, id) {
  return apiFetch(`/income/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}