# KHALI PET — Go Live

## Included
- Swiggy-style mobile customer UI
- Menu/search/categories/cart
- COD + FAM UPI
- WhatsApp order handoff
- Customer GPS sharing
- Real-time Socket.IO location updates
- Admin order dashboard
- Order status workflow
- Node/Express backend
- Persistent JSON order store for initial launch
- Render deployment config

## Go live
1. Create a free Node hosting service account (Render is supported by `render.yaml`).
2. Upload/push this project to a Git repository.
3. Create a Web Service from the repository.
4. Set `ADMIN_PIN` to a private PIN.
5. Deploy.
6. Open the generated HTTPS URL on a phone.
7. Test: add item → checkout → allow location → confirm order → open `/admin`.

## Important
GPS location sharing requires HTTPS and customer permission.
For a larger production business, move `data/orders.json` to a real database (PostgreSQL/Supabase/Firebase) and replace the PIN login with proper authentication. The current bundle is designed to get the first version running quickly.
