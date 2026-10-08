const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  createdAt?: string;
}

export interface AdminProduct {
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
  stock: number;
  rating: number;
  reviewCount: number;
  isActive: boolean;
}

export interface AdminOrderItem {
  product: string | Record<string, unknown>;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  _id?: string;
  orderNumber: string;
  user: string | Record<string, unknown>;
  items: AdminOrderItem[];
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
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminReview {
  id: string;
  _id?: string;
  user: { name: string; email?: string };
  product: { name: string; slug?: string };
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

function getHeaders(includeAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = localStorage.getItem('aquapure_admin_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  // Auth
  auth: {
    async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(res);
    },

    async getMe(signal?: AbortSignal): Promise<AdminUser> {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(true),
        signal,
      });
      return handleResponse(res);
    },
  },

  // Stats
  stats: {
    async getSummary(): Promise<{
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
  },

  // Products
  products: {
    async getAll(): Promise<{ products: AdminProduct[] }> {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async create(payload: Partial<AdminProduct>): Promise<{ product: AdminProduct }> {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async update(id: string, payload: Partial<AdminProduct>): Promise<{ product: AdminProduct }> {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(payload),
      });
      return handleResponse(res);
    },

    async delete(id: string): Promise<{ message: string }> {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // Orders
  orders: {
    async getAll(params?: Record<string, string>): Promise<{ orders: AdminOrder[] }> {
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

  // Users
  users: {
    async getAll(): Promise<{ users: AdminUser[] }> {
      const res = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async updateRole(id: string, role: 'customer' | 'admin'): Promise<{ user: AdminUser }> {
      const res = await fetch(`${API_BASE_URL}/auth/users/${id}/role`, {
        method: 'PATCH',
        headers: getHeaders(true),
        body: JSON.stringify({ role }),
      });
      return handleResponse(res);
    },
  },

  // Reviews
  reviews: {
    async getAll(params?: Record<string, string>): Promise<{ reviews: AdminReview[] }> {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/reviews/all${query}`, {
        method: 'GET',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async approve(id: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/approve`, {
        method: 'PATCH',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },

    async reject(id: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}/reject`, {
        method: 'PATCH',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // Promotions & Marketing Banners
  promotions: {
    async get(): Promise<{ success: boolean; promotion: AdminPromotion }> {
      const res = await fetch(`${API_BASE_URL}/promotions`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async update(data: Partial<AdminPromotion>): Promise<{ success: boolean; message: string; promotion: AdminPromotion }> {
      const res = await fetch(`${API_BASE_URL}/promotions`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },

    async reset(): Promise<{ success: boolean; message: string; promotion: AdminPromotion }> {
      const res = await fetch(`${API_BASE_URL}/promotions/reset`, {
        method: 'POST',
        headers: getHeaders(true),
      });
      return handleResponse(res);
    },
  },

  // Store & Payment Settings
  settings: {
    async get(): Promise<{ success: boolean; settings: AdminStoreSettings }> {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'GET',
        headers: getHeaders(false),
      });
      return handleResponse(res);
    },

    async update(data: Partial<AdminStoreSettings>): Promise<{ success: boolean; message: string; settings: AdminStoreSettings }> {
      const res = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: getHeaders(true),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    },
  },
};

export interface AdminStoreSettings {
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

export interface AdminPromotion {
  _id?: string;
  announcementBar: {
    enabled: boolean;
    badgeText: string;
    message: string;
    tollFreeNumber: string;
    trustBadge1: string;
    trustBadge2: string;
  };
  heroBanner: {
    enabled: boolean;
    badgeText: string;
    headlinePrefix: string;
    brandHighlight: string;
    description: string;
    promoPrice: string;
    mrpPrice: string;
    liveTdsBadge: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    heroImage: string;
  };
  flashSale: {
    enabled: boolean;
    title: string;
    couponCode: string;
    couponDiscountText: string;
    hoursLeft: number;
    minutesLeft: number;
  };
  waterTestCampaign: {
    enabled: boolean;
    badgeText: string;
    title: string;
    description: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
  };
  catalogBanner?: {
    enabled: boolean;
    bannerType: 'standard' | 'image';
    imageUrl: string;
    imageAlt: string;
    imageLink: string;
    badgeText: string;
    title: string;
    description: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
  };
  coupons: Array<{
    _id?: string;
    code: string;
    discountText: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    description: string;
    active: boolean;
  }>;
}

