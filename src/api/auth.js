import { apiFetch } from "./client";

export async function login(username, password) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      username,
      password,
    }),
  });
}

export async function register(username, email, password) {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
}

export async function getMe(token) {
  return apiFetch("/auth/me", {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}

export async function logout(token) {
  return apiFetch("/auth/logout", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  });
}