# Restaurant Web Application - 905 - 

A full-stack restaurant web application built with **Angular** and **Spring Boot**.

The application allows users to create an account, browse food products, search and filter products, add items to a cart, place orders, view their order history, update their profile, and contact the restaurant.

The application also includes an admin area for managing products, viewing orders, and handling customer messages.

## Features

### User Features

* User registration and login
* JWT-based authentication
* Browse restaurant products
* Browse products by category
* Search for products
* Pagination for product lists
* Add products to the shopping cart
* Increase or decrease product quantities
* Place orders
* View order details and order history
* Update user profile information
* View chefs
* Contact the restaurant
* View previous messages and admin replies
* Notifications for unread messages

### Admin Features

* Admin dashboard
* View all orders
* Add products
* Delete products
* View customer messages
* Reply to customer messages

## Technologies

### Backend

* Java 17
* Spring Boot 3.4.5
* Spring Web
* Spring Data JPA
* Spring Security
* JWT
* Bean Validation
* Oracle Database
* MapStruct
* Lombok
* Swagger / OpenAPI
* Maven

### Frontend

* Angular 11
* TypeScript
* RxJS
* Angular Router
* Angular Forms
* Bootstrap
* ng-bootstrap
* Font Awesome

## Project Structure

The project is divided into two main parts:

```text
Restaurant Project
│
├── Backend
│   ├── Controllers
│   ├── Services
│   ├── Repositories
│   ├── Models
│   ├── DTOs
│   ├── Mappers
│   ├── Security
│   └── Configuration
│
└── Frontend
    ├── Components
    ├── Services
    ├── Models
    ├── Guards
    ├── Interceptors
    └── Assets
```

The backend follows a layered structure where controllers handle HTTP requests, services contain the application logic, and repositories communicate with the database.

The Angular frontend communicates with the backend through HTTP requests.

## Application Flow

The general flow of the application is:

```text
Angular Frontend
       ↓
   HTTP Request
       ↓
Spring Boot Controller
       ↓
     Service
       ↓
   Repository
       ↓
   Oracle Database
       ↓
    HTTP Response
       ↓
Angular Frontend
```

## Main Flows

### Authentication

Users can create an account and log in through the Angular frontend.

After a successful login, the backend returns a JWT token. The frontend stores the token and sends it with authenticated requests.

```text
Login / Signup
      ↓
Angular AuthService
      ↓
Spring Boot Authentication API
      ↓
Security / Account Service
      ↓
JWT Token
      ↓
Angular Session
```

### Products and Shopping Cart

Users can browse products, search for products, and filter them by category.

Products can then be added to the shopping cart. The cart keeps track of product quantities and calculates the total price.

### Orders

After adding products to the cart, the user can create an order.

The frontend sends the selected products and order information to the backend. The backend creates the order for the logged-in user.

Users can then view their orders, while admins can view all orders.

### Contact and Messages

Users can send messages to the restaurant through the Contact Us page.

Users can also view their previous messages and see replies from the admin.

Admins can view customer messages and send replies.

## API Examples

Some of the main backend endpoints used by the application include:

```text
POST /auth/sign-up
POST /auth/login

GET  /products/all-products
GET  /products/all-products/{categoryId}
GET  /products/all-products-by-key
POST /products/add
DELETE /products/delete/{id}

GET  /categories/all-categories

POST /orders/create-orders
GET  /orders/all-orders
GET  /orders/admin/all-orders

POST /api/contact/send
GET  /api/contact/my-messages
GET  /api/contact/all
POST /api/contact/reply
PUT  /api/contact/mark-read
```

## Security

The application uses **Spring Security** and **JWT authentication** for authenticated requests.

On the frontend, Angular guards are used to protect application routes, and an HTTP interceptor is used to work with authenticated requests.

## Validation and Error Handling

The backend uses Jakarta Bean Validation and Hibernate Validator for request validation.

A global exception handling component is also used to return structured error responses.

The application also includes message handling for both English and Arabic error messages.

## API Documentation

Swagger / OpenAPI is included in the backend project to document and test the available REST APIs.

## Running the Project

### Backend

Make sure you have:

* Java 17
* Maven
* Oracle Database

Configure the database connection and other application settings in the backend configuration before running the application.

Then run the Spring Boot application using Maven or from your IDE.

### Frontend

Make sure you have Node.js and Angular CLI installed.

Install the project dependencies:

```bash
npm install
```

Run the Angular application:

```bash
ng serve
```

The frontend will be available at:

```text
http://localhost:4200
```

The backend APIs are configured to run on:

```text
http://localhost:8080
```

## Notes

This project was developed as part of a Java Backend Diploma project, with an Angular frontend and a Spring Boot REST API backend.
