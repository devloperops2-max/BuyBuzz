 BuyBuzz - Modern E-commerce Platform

BuyBuzz is a feature-rich, modern e-commerce application built with Next.js and Firebase. It provides a complete shopping experience, from user authentication and product browsing to a seamless checkout process. The platform also includes a powerful admin dashboard for store management and leverages generative AI for an enhanced user and admin experience.

![BuyBuzz Screenshot](https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxsaXZpbmclMjByb29tfGVufDB8fHx8MTc2MjQ2MDM4N3ww&ixlib=rb-4.1.0&q=80&w=1080)

## Core Features

### Customer-Facing
- **User Authentication**: Secure sign-up and login functionality for a personalized experience.
- **Product Discovery**: Browse a full catalog of products, view detailed product pages, and search for items.
- **Shopping Cart**: Add products to a persistent shopping cart.
- **Checkout Flow**: A multi-step checkout process with shipping information and payment method selection.
- **Order History**: Users can view a list of their past orders with detailed information.
- **AI Shopping Assistant (Nova)**: An AI-powered chatbot that provides personalized product recommendations based on user queries.

### Admin Panel (`/admin`)
- **Admin-Only Access**: The admin dashboard is protected and accessible only to a designated admin user (`admin@example.com`).
- **Product Management**: Admins can create, view, edit, and delete products.
- **AI-Powered Content**: Automatically generate compelling product descriptions with a single click.
- **User Management**: View a list of all registered customers.
- **Order Management**: View all customer orders and update their status (e.g., Placed, Shipped, Delivered).
- **Database Seeding**: Easily populate the product database with sample data.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Database**: Firestore
- **Authentication**: Firebase Authentication
- **Generative AI**: Google's Gemini models via Genkit

## Getting Started

### 1. Prerequisites
- Node.js (v18 or later recommended)
- An active Firebase project.

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 3. Firebase Setup
This project is pre-configured to connect to a Firebase project. The configuration is located in `src/firebase/config.ts`. Ensure your Firebase project has **Firestore** and **Firebase Authentication** (with Email/Password provider enabled) activated.

### 4. Running the Development Server
To run the application locally, use the following command:
```bash
npm run dev
```
The application will be available at `http://localhost:9002`.

### 5. Running the Genkit AI Flows
The AI features are powered by Genkit. To run the Genkit development server (which enables flows like product recommendations and description generation), run:
```bash
npm run genkit:dev
```
This will start the Genkit development UI, typically on `http://localhost:4000`.

### 6. Seeding the Database
To populate your store with initial product data:
1.  Log in as the admin user (`admin@example.com` / `password123` or create a new user with this email).
2.  Navigate to the admin dashboard at `/admin`.
3.  Go to the "Seed Database" page.
4.  Click the "Seed Database" button.
