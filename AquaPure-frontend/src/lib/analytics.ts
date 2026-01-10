// Google Analytics 4 Integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = "G-XXXXXXXXXX"; // Replace with your GA4 ID

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === "undefined") return;

  // Load GA script
  const script = document.createElement("script");
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_TRACKING_ID, {
    page_path: window.location.pathname,
  });
};

// Page view tracking
export const trackPageView = (url: string) => {
  if (typeof window.gtag === "undefined") return;
  
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Event tracking
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window.gtag === "undefined") return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// E-commerce tracking
export const trackProductView = (product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  trackEvent("view_item", "ecommerce", product.name, product.price);
  
  if (typeof window.gtag === "undefined") return;
  
  window.gtag("event", "view_item", {
    currency: "INR",
    value: product.price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      },
    ],
  });
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  trackEvent("add_to_cart", "ecommerce", product.name, product.price * product.quantity);
  
  if (typeof window.gtag === "undefined") return;
  
  window.gtag("event", "add_to_cart", {
    currency: "INR",
    value: product.price * product.quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: product.quantity,
      },
    ],
  });
};

export const trackPurchase = (transaction: {
  transactionId: string;
  value: number;
  tax: number;
  shipping: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  trackEvent("purchase", "ecommerce", transaction.transactionId, transaction.value);
  
  if (typeof window.gtag === "undefined") return;
  
  window.gtag("event", "purchase", {
    transaction_id: transaction.transactionId,
    value: transaction.value,
    tax: transaction.tax,
    shipping: transaction.shipping,
    currency: "INR",
    items: transaction.items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};

// User interaction tracking
export const trackSearch = (searchTerm: string) => {
  trackEvent("search", "engagement", searchTerm);
};

export const trackServiceBooking = (serviceName: string) => {
  trackEvent("service_booking", "conversion", serviceName);
};

export const trackNewsletterSignup = (email: string) => {
  trackEvent("newsletter_signup", "conversion", "Newsletter");
};

export const trackReviewSubmit = (productId: string, rating: number) => {
  trackEvent("review_submit", "engagement", productId, rating);
};

// Performance monitoring
export const trackPerformance = () => {
  if (typeof window === "undefined" || !window.performance) return;

  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;

  trackEvent("page_load_time", "performance", "Load Time", pageLoadTime);
  trackEvent("connect_time", "performance", "Connect Time", connectTime);
  trackEvent("render_time", "performance", "Render Time", renderTime);
};

// Error tracking
export const trackError = (error: Error, errorInfo?: any) => {
  trackEvent("error", "exception", error.message);
  
  console.error("Error tracked:", error, errorInfo);
};
