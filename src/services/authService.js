import { API_URL } from "../config";

export const authService = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    // Check if response is not OK (HTTP 200-299)
    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.message || "Đăng nhập thất bại!"); // Use server's error message if available
    }

    // Return token and user info from backend
    return await response.json();
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error; // Re-throw the error for further handling
  }
};
