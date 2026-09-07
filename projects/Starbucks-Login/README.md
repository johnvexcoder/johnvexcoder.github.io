# Starbucks Login Page

A simple Starbucks-inspired login page built with HTML/CSS and a Java backend using Spring Boot.

## Project Structure

- `pom.xml` - Maven build configuration
- `src/main/java` - Java source files
- `src/main/resources/templates` - Thymeleaf HTML templates
- `src/main/resources/static/css` - CSS assets

## Features

- Responsive Starbucks-style login page
- Working login form
- Java Spring Boot backend with form handling
- Demo credentials hardcoded for easy testing

## Demo credentials

- Username: `customer@email.com`
- Password: `password123`

## Run locally

1. Ensure JDK 17+ and Maven are installed.
2. Run the app:

```bash
cd /home/j0hn/Projects/Starbucks-Login
mvn spring-boot:run
```

3. Open your browser at:

```bash
http://localhost:8080
```

## Notes

- This project is a demo login page and does not include production authentication.
- The page uses only local resources and works without internet access.
- The page uses Thymeleaf for server-side rendering and Spring Boot for backend routing.
