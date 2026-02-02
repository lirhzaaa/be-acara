# Acara Backend API

Backend service for **Acara – Integrated Event Ticketing Platform**. This API handles authentication, event management, ticket transactions, payment processing, and email activation.

## 🔗 Links

- **Base API URL:** https://be-acara-sigma.vercel.app/
- **Swagger Documentation:** https://be-acara-sigma.vercel.app/api-docs

---

## 📌 Overview

This backend is built as a RESTful API to support both admin and member functionalities. It manages core business logic such as user authentication, role-based access control, event and category management, ticket transactions, payment status updates, and email-based account activation.

The API is designed to be consumed by a separate frontend application.

---

## ✨ Main Features

### Authentication & User
- User registration with email activation
- Login using JWT authentication
- Role-based access control (Admin & Member)
- Profile management

### Event Management (Admin)
- Create, update, and delete events
- Manage event categories
- Banner management
- Support for online and offline events

### Ticket & Transaction
- Ticket purchase flow
- Integration with Midtrans Snap
- Payment status handling via webhook
- Transaction history

### Email Service
- Email activation using Nodemailer
- Zoho Mail integration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Yup (Validation)
- Midtrans Snap
- Payment Webhook
- Cloudinary
- Nodemailer (Zoho Mail)
- Swagger (OpenAPI)

---

## 📂 API Documentation

All available endpoints, request schemas, and response formats are documented using **Swagger**.

Access the API documentation here:
👉 https://be-acara-sigma.vercel.app/api-docs

---

## 📌 Notes

- This backend is separated from the frontend application.
- Authentication uses JWT with protected routes.
- Payment flow relies on Midtrans Snap and webhook callbacks.
- Email activation is required before users can access member features.

---

## 👤 Author

Developed by **Lirhza**
