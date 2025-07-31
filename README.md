# ZeroWaste DineMao

**Bridging the gap between excess food and empty plates. ZeroWaste DineMao is a web platform that connects restaurants with surplus food to NGOs, facilitating efficient collection and distribution to combat hunger and reduce waste.**

---

## 📜 Table of Contents

- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [System Flow](#-system-flow)
- [Technical Stack](#-technical-stack)
- [Getting Started](#-getting-started)
- [License](#-license)

---

## 🌍 The Problem

Every year, an estimated **1.3 billion tonnes of food** is wasted globally — nearly one-third of all food produced for human consumption. This staggering figure, reported by the UN Food and Agriculture Organization (FAO), stands in stark contrast to the reality that over **800 million people** worldwide suffer from chronic hunger.

The restaurant and hospitality industry is a significant contributor to this paradox. Due to the challenges of predicting daily customer traffic, managing perishable inventory, and maintaining high standards of freshness, vast quantities of perfectly edible, nutritious food are often discarded at the end of the day. This isn't just a business loss; it represents a massive environmental burden in terms of wasted resources (water, land, energy) and increased greenhouse gas emissions from landfills. It is, above all, a profound social and ethical failure.

## 💡 Our Solution

**ZeroWaste DineMao** tackles this challenge head-on by creating a seamless, real-time logistics platform designed for speed and efficiency. We provide a simple, intuitive interface for two key user groups, closing the loop between food surplus and food scarcity:

1.  **Restaurants & Food Donors:** Can quickly and easily list surplus food items that are available for pickup, specifying the quantity, type, and a convenient pickup window. This takes only minutes, turning potential waste into a valuable donation.
2.  **NGOs & Community Organizations:** Receive instant, geo-targeted notifications about available food in their vicinity. They can accept pickup requests with a single click and use an optimized routing system to collect the food efficiently, maximizing the number of pickups they can handle.

Our core objective is to transform surplus into sustenance, ensuring that good food nourishes people, not landfills. By doing so, we help businesses reduce their environmental footprint, support communities in need, and build a more sustainable and equitable food system.

## ✨ Key Features

-   **Real-time Food Listings:** Restaurants can post details about available food, including type (e.g., "Baked Goods," "Cooked Meals"), quantity (e.g., "feeds 60 people"), and a specific pickup window (e.g., "from 9:00 PM to 10:00 PM").
-   **Instant NGO Notifications:** Registered NGOs are alerted immediately via the platform when a new pickup becomes available within their operational radius, ensuring no opportunity is missed.
-   **Optimized Route Navigation:** Upon accepting a pickup, the platform displays an integrated map view powered by a leading mapping service, showing the best route from the NGO's current location to the restaurant.
-   **Pickup Management Dashboard:** NGOs can manage their active pickups in a simple dashboard. They can mark food as "Collected," and if handling multiple pickups, the system will seamlessly guide them to the next location.
-   **Responsive & Mobile-First Design:** The entire interface is designed to be highly responsive, ensuring that NGO drivers and restaurant staff can use the application effectively on mobile devices and tablets while on the go.
-   **Secure Authentication:** Separate, secure login portals for restaurants and NGOs, managed by Firebase Authentication, ensure that only authorized users can list or claim food donations.

## 🔄 System Flow

1.  **Donation:** A manager at a partner restaurant logs into their dashboard and creates a new "Pickup Available" listing. They fill in key details: type of food, estimated number of people it can feed, and the hours it will be available for collection.
2.  **Notification:** The ZeroWaste DineMao system instantly identifies all registered NGOs within a predefined geographic radius of the restaurant and sends a notification to their dashboards.
3.  **Acceptance:** An NGO field worker monitoring the platform sees the notification, reviews the details, and accepts the pickup with a single tap. The listing is then marked as "Claimed" to prevent multiple NGOs from heading to the same location.
4.  **Navigation:** The app immediately transitions to a map view, displaying the optimized route to the restaurant. A compact, non-intrusive card at the bottom of the screen shows key pickup details (address, food type) without obstructing the map.
5.  **Collection:** The NGO driver arrives at the restaurant, presents their credentials via the app, collects the food, and marks the pickup as "Collected" in the app. This updates the dashboard and provides a record of the successful donation.
6.  **Distribution:** The food is successfully diverted from waste streams and is now ready to be transported back to the NGO's facility for immediate distribution to communities in need.

## 🛠️ Technical Stack

This project is built with a modern, robust, and scalable technology stack chosen for performance and reliability:

-   **Framework:** [Next.js](https://nextjs.org/) (utilizing the App Router). Chosen for its high performance, server-side rendering (SSR) capabilities for fast initial page loads, and excellent developer experience.
-   **Language:** [TypeScript](https://www.typescriptlang.org/). Used to enhance code quality, maintainability, and reduce bugs through static type checking.
-   **UI Framework:** [React](https://reactjs.org/). The leading library for building dynamic, component-based user interfaces.
-   **Component Library:** [ShadCN UI](https://ui.shadcn.com/). Provides a set of beautifully designed, accessible, and customizable components that accelerate development.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/). A utility-first CSS framework that allows for rapid styling directly within the markup without leaving the HTML.
-   **Icons:** [Lucide React](https://lucide.dev/). A comprehensive and lightweight icon library that ensures visual consistency.
-   **Backend & Database:** [Firebase](https://firebase.google.com/). A comprehensive platform used for:
    -   **Firestore:** A NoSQL, real-time database for storing food listings and user data. Its real-time capabilities are perfect for instant notifications.
    -   **Firebase Authentication:** Handles secure user login and management for both restaurants and NGOs.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/zerowaste-dinemao.git
    cd zerowaste-dinemao
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env.local` in the root of your project. You will need to add your Firebase project configuration keys. You can find these by creating a new web app in your Firebase project console.

    ```env
    # Firebase Client SDK Configuration (for the browser)
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...

    # Firebase Admin SDK Configuration (for server-side actions)
    # Go to Project Settings > Service Accounts in Firebase to generate a new private key
    FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@...iam.gserviceaccount.com
    # Ensure the private key is enclosed in quotes and newlines are preserved with \n
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details....
