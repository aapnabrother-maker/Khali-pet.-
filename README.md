# KHALI PET — Live Delivery App

## What is included
- Customer mobile food-ordering UI
- Cart + checkout + FAM UPI QR
- WhatsApp order handoff
- Customer GPS live-location sharing with `watchPosition`
- Node.js/Express order backend
- Socket.IO real-time location updates
- Admin dashboard at `/admin`
- Order status controls: Accepted, Preparing, Out for delivery, Delivered
- JSON persistence in `data/orders.json`

## Run
1. Install Node.js 18+.
2. In this folder run:
   `npm install`
3. Set an admin PIN (recommended):
   Linux/macOS: `ADMIN_PIN=your-pin npm start`
   Windows PowerShell: `$env:ADMIN_PIN="your-pin"; npm start`
4. Open `http://localhost:3000`
5. Admin: `http://localhost:3000/admin`

## Important for real customers
For GPS on phones, deploy over HTTPS (or use localhost during testing). Customers must grant location permission.
For production, replace the simple JSON storage and PIN with a real authenticated database/backend and secure admin login.

## Live tracking behavior
After a customer confirms an order, the server creates an order ID and the browser starts `watchPosition`. Coordinates are sent over Socket.IO and appear on the admin dashboard. The customer can stop location sharing by closing the page/browser or revoking location permission.
