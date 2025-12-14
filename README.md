# TDD Kata: Midnight Sweets - Sweet Shop Management System

## 🌟 Project Overview

[cite_start]This project implements a full-stack **Sweet Shop Management System** following the principles of Test-Driven Development (TDD) and meeting all requirements of the AI Kata assignment[cite: 227]. It features a RESTful API with robust authentication and inventory control, backed by a modern web application for shop and administrative functions.

### Core Technologies

| Layer | Technology | Key Features Implemented |
| :--- | :--- | :--- |
| **Backend** | **Java 21, Spring Boot 3.x** | [cite_start]RESTful API, Validation (`jakarta.validation`), Exception Handling[cite: 234]. |
| **Database** | **MongoDB** | [cite_start]Persistent storage, leveraging text indexing and complex criteria for search endpoints[cite: 28, 235]. |
| **Security** | **Spring Security, JWT, RBAC** | [cite_start]Token-based authentication, user roles (`USER`/`ADMIN`), and fine-grained access control (`@PreAuthorize`)[cite: 237, 238, 246, 249]. |
| **Frontend** | **Next.js 16 (React/TS), Tailwind CSS** | [cite_start]Unified UI with separate views for Shop and Admin, state management via `@tanstack/react-query`[cite: 253, 256, 259]. |

## ⚙️ Setup and Running Instructions

The project consists of two main folders: `TDD-Kata` (Backend) and `sweet-shop-ui` (Frontend).

### Prerequisites

1.  **Java:** JDK 21 or higher.
2.  **Maven:** For building the Java project.
3.  **MongoDB:** A running instance of MongoDB on `localhost:27017`. The application will connect to a database named `sweetshop`.
4.  **Node.js:** Version 18+ and a package manager (npm/yarn/pnpm) for the frontend.

### 1. Backend Setup (`TDD-Kata`)

1.  **Configuration Check:** The application is configured to run on port `8085`.
2.  **Build and Run:** Navigate to the `TDD-Kata` directory and execute:
    ```bash
    cd TDD-Kata
    ./mvnw spring-boot:run
    ```
    The API will be available at `http://localhost:8085/api`.

### 2. Frontend Setup (`sweet-shop-ui`)

1.  **Install Dependencies:** Navigate to the `sweet-shop-ui` directory and install packages:
    ```bash
    cd sweet-shop-ui
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:3000`.

### Initial Users (For Testing RBAC)

Since the database starts empty, you will need to register users via the `/register` page:

| Username | Password | Role | Access |
| :--- | :--- | :--- | :--- |
| `admin` | `password` | `ADMIN` | [cite_start]Full CRUD, Restock, Delete[cite: 246, 249]. |
| `user` | `password` | `USER` | [cite_start]View, Search, Purchase Sweets[cite: 243, 244, 248]. |

---

## 🔬 Test-Driven Development (TDD) Process

The TDD methodology was strictly followed, with tests written before implementation for all core business logic and security policies.

### Key Test Coverage Highlights:

| Test Class | Focus | Verification |
| :--- | :--- | :--- |
| `SweetServiceTest.java` | **Advanced Search** | Ensures complex MongoDB queries accurately combine full-text search (`keyword`) with price range filters (`minPrice`, `maxPrice`). |
| `SweetServiceTest.java` | **Inventory Control** | Verifies `purchaseSweet` correctly decreases quantity and throws a `RuntimeException` when stock is insufficient ("Not enough stock. Available: X"). |
| `AuthServiceTest.java` | **Authentication Logic** | Confirms users can register as `USER` or `ADMIN`. Implements a safety net test to ensure the role defaults to `USER` if none is provided. |
| `SweetControllerSecurityTest.java` | **Role-Based Access** | Explicitly tests the access control layer (`@PreAuthorize`), confirming that `DELETE` operations are **Forbidden (403)** for a standard `USER` role and successfully completed for an `ADMIN` role. |

---

## 🤖 My AI Usage

[cite_start]In line with the project's guidelines[cite: 272], I utilized AI assistance extensively to accelerate development and ensure adherence to best practices.

**AI Tool Used:** **Gemini (Large Language Model Assistant)**

### How Gemini Was Used

1.  **Test Scaffolding (TDD - Red Phase):** I asked Gemini to generate the initial structural outlines for complex unit tests, specifically for `SweetServiceTest.java`'s Mongo criteria logic and the `SweetControllerSecurityTest.java`'s Spring Security mocks. This allowed me to immediately focus on defining the correct *assertions* and *conditions* before writing the functional code.
2.  **Boilerplate & Plumbing:** Generated initial DTOs (e.g., `RegisterRequest.java`), configuration classes (e.g., `ApplicationConfig.java`), and utility files (e.g., `useAuth.ts`), significantly reducing repetitive setup work.
3.  **Refactoring and Styling:** Utilized the tool to refine the component code (e.g., `SweetCard.tsx`) to correct layout issues (using CSS Grid instead of Flexbox) and enhance the component's visual aesthetic using complex Tailwind CSS gradient and shadow definitions.
4.  **Security Integration:** Assisted in ensuring the JWT payload correctly included the user's `role`, which is a critical step for Spring Security to enforce RBAC using the `@PreAuthorize` annotation.

### Reflection on Workflow Impact

The use of Gemini allowed for a **hyper-focused TDD cycle**. Instead of spending time on framework-specific setup or manually writing large test stubs, the efficiency gain let me dedicate more time to the actual business logic of inventory control and the comprehensive coverage of edge cases (e.g., multi-parameter search logic and zero-stock purchases). The AI functioned as a highly effective pair programmer for boilerplate and structural tasks.

## screenshot of final output:  

<img width="1916" height="895" alt="Screenshot 2025-12-14 184224" src="https://github.com/user-attachments/assets/c4f27fb5-c8ae-46f6-8448-a8703eff2b94" />

<img width="1901" height="832" alt="Screenshot 2025-12-14 184316" src="https://github.com/user-attachments/assets/256bff72-ef0a-4199-a5a9-23a51d94b559" />
<img width="1907" height="824" alt="Screenshot 2025-12-14 184333" src="https://github.com/user-attachments/assets/f6c5bb3c-791e-4305-95ae-7715c16bdf8b" />
<img width="1904" height="907" alt="Screenshot 2025-12-14 180519" src="https://github.com/user-attachments/assets/e82360ce-4951-4240-9ecf-103a36ccf565" /> 
<img width="1908" height="893" alt="Screenshot 2025-12-14 182532" src="https://github.com/user-attachments/assets/20fc2cd2-ca3b-4f19-8e0c-6c7a50896f80" /> 
<img width="1911" height="860" alt="Screenshot 2025-12-14 182632" src="https://github.com/user-attachments/assets/f30eda46-8027-44d6-9361-25cc67a3d638" /> 
<img width="1148" height="704" alt="Screenshot 2025-12-14 182610" src="https://github.com/user-attachments/assets/067ec0df-0b54-42ab-b45a-fcc2a1de0fa6" /> 
<img width="1028" height="712" alt="Screenshot 2025-12-14 182556" src="https://github.com/user-attachments/assets/e4c5da31-649c-4c1e-9e28-42828cd62458" /> 
<img width="1147" height="750" alt="Screenshot 2025-12-14 182545" src="https://github.com/user-attachments/assets/57c1492f-409f-40f4-a225-6cae90732179" /> 
<img width="1037" height="544" alt="Screenshot 2025-12-14 182643" src="https://github.com/user-attachments/assets/0496750d-d6ed-4953-8ab2-f2adb7382827" />








|
