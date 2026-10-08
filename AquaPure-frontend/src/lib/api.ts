const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface ApiUserAddress {
  type?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: ApiUserAddress[];
}

export interface ApiProduct {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  features: string[];
  specifications?: Record<string, string> | Map<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

export interface ApiOrderItem {
  product: string | Record<string, unknown>;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ApiOrder {
  id: string;
  _id?: string;
  orderNumber: string;
  user: string | Record<string, unknown>;
  items: ApiOrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  paymentId?: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface ApiPagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  auth: {
    async register(payload: { name: string; email: string; password: string; phone?: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    async getMe(): Promise<ApiUser> {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateProfile(payload: Partial<ApiUser>) {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async changePassword(currentPassword: string, newPassword: string) {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return handleResponse(res);
    },

    async forgotPassword(email: string) {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email }),
      });
      return handleResponse(res);
    },

    async resetPassword(token: string, newPassword: string) {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ token, newPassword }),
      });
      return handleResponse(res);
    },
  },

  // Products
  products: {
    async getAll(params?: Record<string, string>): Promise<{ products: ApiProduct[]; pagination: ApiPagination }> {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/products${query}`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async getById(idOrSlug: string): Promise<ApiProduct> {
      const res = await fetch(`${API_BASE_URL}/products/${idOrSlug}`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },
  },

  // Orders
  orders: {
    async create(orderData: {
      items: Array<{ product: string; name: string; price: number; quantity: number; image?: string }>;
      shippingAddress: { name: string; phone: string; email?: string; street: string; city: string; state?: string; pincode: string };
      paymentMethod: string;
      couponCode?: string;
    }): Promise<{ message: string; order: ApiOrder }> {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(orderData),
      });
      return handleResponse(res);
    },

    async createPayment(orderNumber: string): Promise<{ orderId: string; amount: number; currency: string; orderNumber: string }> {
      const res = await fetch(`${API_BASE_URL}/orders/create-payment`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify({ orderNumber }),
      });
      return handleResponse(res);
    },

    async verifyPayment(payload: { orderNumber: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) {
      const res = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async getMyOrders(): Promise<ApiOrder[]> {
      const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async getByNumber(orderNumber: string): Promise<ApiOrder> {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async getAll(params?: Record<string, string>): Promise<{ orders: ApiOrder[]; pagination: ApiPagination }> {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/orders${query}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateStatus(id: string, payload: { status: string; trackingNumber?: string; notes?: string }) {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },
  },

  // Reviews
  reviews: {
    async getProductReviews(productId: string, params?: Record<string, string>) {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}${query}`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async submitReview(payload: { product: string; rating: number; title: string; comment: string; images?: string[] }) {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async markHelpful(reviewId: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // Admin Portal Services
  admin: {
    async getStats(): Promise<{
      totalRevenue: number;
      totalOrders: number;
      pendingOrders: number;
      deliveredOrders: number;
      cancelledOrders: number;
      statusBreakdown: Record<string, number>;
    }> {
      const res = await fetch(`${API_BASE_URL}/orders/stats/summary`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async getUsers(): Promise<{ users: ApiUser[] }> {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateUserRole(userId: string, role: 'customer' | 'admin'): Promise<{ user: ApiUser }> {
      const res = await fetch(`${API_BASE_URL}/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ role }),
      });
      return handleResponse(res);
    },

    async getAllReviews(params?: Record<string, string>): Promise<{ reviews: Array<{
      id: string;
      _id?: string;
      user: { name: string; email?: string };
      product: { name: string; slug?: string };
      rating: number;
      title: string;
      comment: string;
      status: 'pending' | 'approved' | 'rejected';
      createdAt: string;
    }> }> {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/reviews/all${query}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async approveReview(reviewId: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/approve`, {
        method: 'PATCH',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async rejectReview(reviewId: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/${reviewId}/reject`, {
        method: 'PATCH',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // Store & Payment Settings
  settings: {
    async get(): Promise<{ success: boolean; settings: ApiStoreSettings }> {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },
  },
};

export interface ApiStoreSettings {
  _id?: string;
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  warehouseAddress: string;
  freeShippingThreshold: number;
  standardDeliveryFee: number;
  taxRateGst: number;
  maintenanceMode: boolean;
  enableCashOnDelivery: boolean;
  enableRazorpayGateway: boolean;
  bannerNotice: string;
}
