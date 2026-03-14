#  Flipkart Clone — Full Stack E-Commerce

A production-grade Flipkart clone built with **React.js**, **Node.js**, **Express**, and **MySQL**. Fully responsive, session-based cart, real-time search, and complete order management.



##  Features

###  Shopping
- Product listing with grid layout
- Live search (type to filter instantly)
- Category & sort filters
- Product detail page with image gallery & specs
- Similar products section

###  Cart & Orders
- Session-based cart (no login required)
- Add / remove / update quantity
- Price summary with discount & delivery
- Checkout with address form + payment selection
- Order success page with Order ID
- Full order history with expandable details

###  UI/UX
- Fully responsive — mobile, tablet, desktop
- Animated banner carousel
- Skeleton loading states
- Toast notifications
- Wishlist toggle
- Category quick-nav with icons

---

##  Project Structure
```
flipkart-clone/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   ├── schema.sql         # Database schema
│   │   └── seed.js            # Sample data seeder
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── CategoryList.jsx
    │   │   ├── CartItem.jsx
    │   │   └── Skeleton.jsx
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── ProductsPage.jsx
    │   │   ├── ProductDetailPage.jsx
    │   │   ├── CartPage.jsx
    │   │   ├── CheckoutPage.jsx
    │   │   ├── OrderSuccessPage.jsx
    │   │   └── OrdersPage.jsx
    │   ├── context/
    │   │   ├── CartContext.jsx
    │   │   └── ToastContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   └── App.jsx
    ├── index.html
    └── package.json
```

---

##  Database Tables

| Table | Purpose |
|-------|---------|
| `categories` | Product categories |
| `products` | Catalog with images (JSON), pricing, specs |
| `cart` | Session-based cart items |
| `orders` | Orders with shipping address |
| `order_items` | Individual items per order |

---

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| State | React Context API (Cart + Toast) |
| HTTP | Axios with interceptors |
| Backend | Node.js, Express.js |
| Database | MySQL 8+ with mysql2/promise |
| Session | localStorage UUID → `x-session-id` header |

---

##  Getting Started

### Prerequisites
- Node.js >= 18
- MySQL 8+
- npm

---

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/flipkart-clone.git
cd flipkart-clone
```

### 2. Database setup
```bash
mysql -u root -p
```
```sql
CREATE DATABASE flipkart_clone;
```
```bash
mysql -u root -p flipkart_clone < backend/config/schema.sql
```

### 3. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flipkart_clone
```

Seed products:
```bash
npm run seed
```

Start server:
```bash
npm run dev
```

> Runs at **http://localhost:5000**

### 4. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

> Runs at **http://localhost:3000**

---

##  API Reference

### Products
| Method | Endpoint | Params |
|--------|----------|--------|
| GET | `/api/products` | `?search` `?category` `?sort` `?page` `?limit` |
| GET | `/api/products/featured` | — |
| GET | `/api/products/:id` | — |

### Cart
| Method | Endpoint | Body |
|--------|----------|------|
| GET | `/api/cart` | — |
| GET | `/api/cart/count` | — |
| POST | `/api/cart/add` | `{ product_id, quantity }` |
| PUT | `/api/cart/:id` | `{ quantity }` |
| DELETE | `/api/cart/:id` | — |
| DELETE | `/api/cart/clear` | — |

### Orders
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/orders/place` | address + payment fields |
| GET | `/api/orders` | — |
| GET | `/api/orders/:orderId` | — |

---

##  Deployment

### Frontend — Vercel / Netlify
```bash
cd frontend
npm run build

Set env variable:
VITE_API_URL=https://your-backend-url.com/api


### Backend — Render / Railway
1. Push to GitHub
2. Connect repo to Render/Railway
3. Add environment variables
4. Deploy — Node.js auto-detected

---

## Notes

- No login required — cart & orders tracked via `localStorage` UUID
- Product images served from Unsplash CDN
- Free delivery on orders above ₹499
- Stock decrements on order placement with transaction rollback on failure
- COD default; UPI, Card, Net Banking available as options

---

##  Author

Built for **Scaler SDE Intern Fullstack Assignment**

> Made with ❤️ using React + Node.js + MySQL