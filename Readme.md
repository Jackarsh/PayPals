# PayPals (Full-stack demo)

Backend: Spring Boot (Java 17) + MySQL
Frontend: React (create-react-app) + axios

## Prerequisites
- Java 17+ and Maven
- Node.js 16+ and npm
- MySQL server

## Setup & Run (Backend)
1. Create database:
   $ mysql -u root -p
   CREATE DATABASE paypals_db;

2. Update `backend/src/main/resources/application.properties` with your MySQL username/password.

3. Build & run:
   $ cd backend
   $ mvn clean package
   $ mvn spring-boot:run
   Backend will run on: http://localhost:8080

## Setup & Run (Frontend)
1. In another terminal:
   $ cd frontend
   $ npm install
   $ npm start

Frontend will run on http://localhost:3000 and call the backend at http://localhost:8080/api

## Example flow
1. Create a user:
   POST http://localhost:8080/api/users
   { "name":"Utkarsh", "email":"utkarsh@example.com" }

2. Create group (use created user id):
   POST http://localhost:8080/api/groups
   { "name":"Trip", "memberIds":[1] }

3. Add expense:
   POST http://localhost:8080/api/expenses
   { "groupId":1, "paidByUserId":1, "amount":1000, "description":"Dinner" }

4. Get group + balances:
   GET http://localhost:8080/api/groups/1

