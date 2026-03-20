Task Management Application built with Spring Boot (backend) and Angular (frontend).
JWT authentication is implemented users log in to receive a bearer token, which is used for authenticated API requests.

Backend Setup (Spring Boot)

Requirements
Java 17+
Maven
MySQL 8+

Run steps
Navigate to the backend folder
Configure the database in application.properties
JWT secret key is managed internally you do not need to provide it manually
Backend API will be available at http://localhost:3030
other end points at UserController and TaskController

Database Setup(Mysql)
Create the MySQL database
CREATE DATABASE taskapp;
Tables will be automatically created by Spring Boot

Frontend Setup (Angular)
Requirements
Node.js 18+
Angular CLI

Run steps
Navigate to the frontend folder
Install dependencies
Start the frontend development server "ng serve"

Authentication & JWT Usage
Use the login page in the frontend to log in
On successful login, the backend returns a JWT token
there is a rendering problems fetch all task take some time to load changing filter work fine
<img width="1871" height="825" alt="Screenshot 2026-03-21 013411" src="https://github.com/user-attachments/assets/b09fec91-60a0-4072-a879-fbe8314d3208" />
<img width="1873" height="821" alt="Screenshot 2026-03-21 013450" src="https://github.com/user-attachments/assets/d008bb17-a7b8-4838-a068-e495b62a5ade" />
<img width="1870" height="842" alt="Screenshot 2026-03-21 013627" src="https://github.com/user-attachments/assets/0a55af20-7654-4112-bf72-013e3dc8703d" />
<img width="1837" height="842" alt="Screenshot 2026-03-21 013654" src="https://github.com/user-attachments/assets/a945e388-926a-493a-8b70-3d6039cd92a1" />





