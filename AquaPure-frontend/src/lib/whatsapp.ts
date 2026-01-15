export const WHATSAPP_NUMBER = "919598353650";

export interface BookingData {
  serviceName: string;
  date: string;
  timeSlot: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  notes?: string;
}

export const generateWhatsAppMessage = (data: BookingData): string => {
  const message = `NEW SERVICE BOOKING REQUEST

Service: ${data.serviceName}
Date: ${data.date}
Time Slot: ${data.timeSlot}
Name: ${data.customerName}
Phone: ${data.phone}
Email: ${data.email}
Address: ${data.address}
Additional Notes: ${data.notes || "None"}`;

  return message;
};

export const openWhatsAppBooking = (data: BookingData): void => {
  const message = generateWhatsAppMessage(data);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};
