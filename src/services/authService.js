import { API_URL } from "../config";

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Đăng nhập thất bại!");
  }

  return await response.json(); // Trả về token và thông tin user từ backend
};
