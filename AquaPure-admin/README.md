# 💧 AquaPure • Standalone Admin Operations Portal

A dedicated, enterprise-grade administrative dashboard and store management platform built specifically for the **AquaPure** drinking water purifiers ecosystem.

Designed with an aesthetic **White & Blue theme** matching the consumer storefront, providing complete operational isolation from customer-facing routes.

---

## 🚀 Key Modules & Capabilities

- 📊 **Executive Overview Dashboard**: Real-time sales metrics, order fulfillment pipeline, active customer counts, and low-inventory telemetry.
- 📦 **Purifier & Filter Catalog**: Full CRUD for water purifiers and filters, category taxonomy, pricing, inventory stock thresholds, and specifications.
- 🛒 **Orders & Invoice Engine**: Real-time order lifecycle tracking (Pending, Processing, Shipped, Delivered, Cancelled) and instant printable **Tax Invoices** (GST-compliant).
- 👥 **Customer & User Directory**: User security management, admin/customer role elevation, verified customer badges.
- ⭐ **Review Moderation Queue**: Customer feedback moderation system with 1-click Approve/Reject controls.
- ⚙️ **Store & System Settings**: Live operational configuration for free-shipping thresholds, GST tax percentage, COD toggles, and store contact info.

---

## 🎨 Theme & Design System

- **Primary Colors**: Sky Blue (`hsl(199, 89%, 48%)`), Cyan (`hsl(187, 85%, 43%)`), Deep Blue (`hsl(215, 80%, 35%)`)
- **Backgrounds**: Ultra-clean Crisp White (`hsl(0, 0%, 100%)`) & Soft Sky Mist (`hsl(210, 50%, 98%)`)
- **Typography**: Inter / Outfit sans-serif with subtle micro-interactions and smooth Radix UI dialogs.

---

## ⚙️ Environment Variables

Create `.env` in the root of `AquaPure-admin`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STOREFRONT_URL=http://localhost:8081
```

---

## 🛠️ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The Admin Portal will run on **`http://localhost:8082`**.

### 3. Default Admin Credentials
- **Email**: `admin@aquapure.com`
- **Password**: `Admin@AquaPure2025!`
