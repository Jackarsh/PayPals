# PayPals – Smart Group Expense Splitter & Settlement System  
A full-stack Java Spring Boot + ReactJS application inspired by Splitwise, designed to manage group expenses, track balances, and generate optimized settlements with activity logging.

---

## 🚀 Features

### 🔹 **User Management**
- Add and view users  
- Each user has `id`, `name`, and `email`  
- Auto-used across groups, expenses, and settlements

### 🔹 **Group Management**
- Create groups with multiple members  
- Add expenses for each group  
- View all groups and group members  
- Activity logs for each group

### 🔹 **Expense Management**
- Add expenses with:
  - Amount  
  - Paid by which user  
  - Split among selected group members  
- Balances auto-distributed fairly  
- Users can check:
  - Who owes whom  
  - Total owed and total due

### 🔹 **Balances & Optimal Settlement**
- Automatic balance calculation per group  
- `/balances/group/{id}/detailed` provides natural language:
  - `"Aditya owes ₹65 to Utkarsh"`
- `/balances/group/{id}/optimized` provides minimal settlement transactions:
  - `"Aditya pays Utkarsh ₹65"`

### 🔹 **Settle Up (with Activity Logging)**
- Users settle debts through one click  
- Backend updates all balances  
- Activity log records each settlement:
  - `"Riya settled ₹85 with Utkarsh"`

### 🔹 **Activity Feed**
- Displays chronological group activity:
  - Group creation  
  - Expenses added  
  - Settlements completed  
- Stored in MySQL table `activity`

### 🔹 **Modern Neon UI (ReactJS)**
- Dark theme  
- Neon green accents  
- Beautiful card-style layout  
- Fully responsive  
- Poppins font globally applied  
- Dropdown hover fix  
- Pages included:
  - Home
  - Users
  - Groups
  - Expenses
  - Balances
  - Optimized Settlements
  - Activity Log

---

## 🏗️ Tech Stack

### **Backend (Spring Boot – Java 17)**  
- Spring Boot Web  
- H2 / MySQL  
- Spring Data JPA  
- Maven  
- REST API architecture  

### **Frontend (ReactJS)**  
- React 18  
- Axios for API calls  
- Neon dark theme  
- Fully client-side routed  
- Reusable components: Navbar, Cards, Pages


---

## 🛠️ How to Run Locally

### **1️⃣ Backend Setup**
```sh
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:
http://localhost:8080

### **1️⃣ Frontend Setup**
```sh
cd frontend
npm install
npm start
```

Frontend runs at:
http://localhost:3000


Authors:
Utkarsh Srivastava
23FE10ITE00296
Manipal University Jaipur