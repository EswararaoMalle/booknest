# 📚 BookNest – MERN Stack Bookstore Application

BookNest is a full-stack bookstore web application built using the **MERN Stack (MongoDB, Express, React, Node.js)**.

It supports **role-based access control** with:

* 👤 User
* 🏪 Seller
* 🛡️ Admin

The system allows users to browse books, place orders, track order status, while sellers manage books and orders, and admins control the entire platform.
Project Demo Video
https://drive.google.com/file/d/1dLsHwAoB6lN__D6xQmDTb6cM2wRFABb1/view?usp=sharing

---

## 🚀 Tech Stack

### Frontend

* React.js
* Axios
* React Router
* CSS (Custom Professional UI)

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

---

## 🎯 Features

### 👤 User Features

* Register & Login
* Browse books with cover images
* Search books
* Add to Cart
* Place Order (Cash on Delivery)
* View Order History
* Track Order Status (Pending / Accepted / Delivered)

---

### 🏪 Seller Features

* Seller Login
* Add new books with:

  * Title
  * Author
  * Price
  * Category
  * Cover Image URL
* Delete books
* View seller-specific orders
* Update order status:

  * Pending
  * Accepted
  * Delivered
  * Cancelled

---

### 🛡️ Admin Features

* View all users
* View all books
* Delete any book
* View all orders
* Update order status
* See total revenue

---

## 🗂️ Project Structure

```
booknest/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   └── App.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/booknest.git
cd booknest
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file inside backend folder:

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Start backend:

```bash
node server.js
```

Backend runs on:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

### Books

* `GET /api/books`
* `POST /api/books`
* `DELETE /api/books/:id`

### Cart

* `GET /api/cart/:userId`
* `POST /api/cart/add`
* `DELETE /api/cart/:id`

### Orders

* `POST /api/orders`
* `GET /api/orders`
* `GET /api/orders/user/:userId`
* `GET /api/orders/seller/:sellerId`
* `PUT /api/orders/:id/status`

### Users

* `POST /api/users/register`
* `POST /api/users/login`
* `GET /api/users`

---

## 🗄️ Database Collections

* Users
* Books
* Cart
* Orders

Orders store **book snapshot data** to preserve history even if books are deleted later.

---

## 🎨 UI Highlights

* Professional Landing Page
* Role-based Dashboard Redirection
* Book cover image support
* Order status badge system
* Clean modern design
* Responsive layout

---

## 🔐 Role-Based Redirection

After login:

* User → `/home`
* Seller → `/seller`
* Admin → `/admin`

---

## 📦 Order Workflow

1. User places order
2. Order status = **Pending**
3. Seller/Admin updates to:

   * Accepted
   * Delivered
   * Cancelled
4. User sees updated status in real-time

---

## 💡 Future Improvements

* JWT Authentication
* Online Payment Integration
* Image Upload via Cloudinary
* Pagination
* Analytics Dashboard
* Dark Mode

---

## 🏁 Conclusion

BookNest demonstrates:

* Full-stack MERN development
* REST API design
* MongoDB schema modeling
* Role-based access control
* Real-time order management
* Clean professional UI implementation

---

## 👨‍💻 Author

Your Name
Eswararao Malle

