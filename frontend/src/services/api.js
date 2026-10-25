const BASE_URL = "http://localhost:5000/api";

// Helper function to handle fetch requests with auth headers and error handling
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred while fetching data");
    }

    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const authApi = {
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  sendOtp: (phoneData) =>
    request("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(phoneData),
    }),

  verifyOtp: (otpData) =>
    request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  getProfile: () => request("/auth/profile"),

  updateProfile: (userData) =>
    request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

export const restaurantApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    return request(`/restaurants${queryString ? `?${queryString}` : ""}`);
  },

  getById: (id) => request(`/restaurants/${id}`),

  getMenu: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/restaurants/${id}/menu${query ? `?${query}` : ""}`);
  },
};

export const categoryApi = {
  getAll: () => request("/categories"),
};

export const orderApi = {
  create: (orderData) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  getMyOrders: () => request("/orders/my-orders"),

  getById: (id) => request(`/orders/${id}`),

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export default {
  auth: authApi,
  restaurants: restaurantApi,
  categories: categoryApi,
  orders: orderApi,
};
