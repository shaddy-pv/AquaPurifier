export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendBrowserNotification = async (options: NotificationOptions): Promise<void> => {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    console.log("Notification permission denied");
    return;
  }

  const notification = new Notification(options.title, {
    body: options.body,
    icon: options.icon || "/favicon.ico",
    badge: options.badge || "/favicon.ico",
    tag: options.tag,
    data: options.data,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };
};

// Order status notifications
export const notifyOrderConfirmed = (orderNumber: string) => {
  sendBrowserNotification({
    title: "Order Confirmed!",
    body: `Your order #${orderNumber} has been confirmed and is being processed.`,
    tag: `order-${orderNumber}`,
  });
};

export const notifyOrderShipped = (orderNumber: string, trackingNumber: string) => {
  sendBrowserNotification({
    title: "Order Shipped!",
    body: `Your order #${orderNumber} is on its way. Tracking: ${trackingNumber}`,
    tag: `order-${orderNumber}`,
  });
};

export const notifyOrderDelivered = (orderNumber: string) => {
  sendBrowserNotification({
    title: "Order Delivered!",
    body: `Your order #${orderNumber} has been delivered. Enjoy your purchase!`,
    tag: `order-${orderNumber}`,
  });
};

// SMS notification templates (to be sent via backend API)
export const smsTemplates = {
  orderConfirmed: (orderNumber: string, customerName: string) =>
    `Hi ${customerName}, your AquaPure order #${orderNumber} is confirmed! Track: aquapure.com/track`,

  orderShipped: (orderNumber: string, trackingNumber: string) =>
    `Your order #${orderNumber} is shipped! Track: ${trackingNumber}. Expected delivery in 2-3 days.`,

  outForDelivery: (orderNumber: string) =>
    `Your order #${orderNumber} is out for delivery today! Please be available.`,

  delivered: (orderNumber: string) =>
    `Your order #${orderNumber} has been delivered. Thank you for choosing AquaPure!`,
};
