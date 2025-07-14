# PetCare Center SPA

This is a Single Page Application (SPA) for a PetCare Center. It allows users to register, log in, manage their pets, and handle stays for each pet. The system supports two types of users: **customers** and **workers**.

## Features

- **User Registration and Login**
- **Role-based Dashboard**:
  - Customers can:
    - Register, edit and delete their pets
    - View stays for each pet
  - Workers can:
    - View all users and pets
    - Register, edit and delete pets
    - Manage stays for each pet
- **LocalStorage authentication**
- **Responsive design**

## Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- `json-server` for fake REST API
- SPA navigation using hash routing

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/petcare-center-spa.git
   ```

2. Navigate into the project:
   ```bash
   cd petcare-center-spa
   ```

3. Install `json-server` if you don't have it:
   ```bash
   npm install -g json-server
   ```

4. Start the fake API:
   ```bash
   json-server public/db.json
   ```

5. Open `index.html` in your browser.

## Folder Structure

```
public/
  db.json         ← JSON database for users, pets, stays, roles
views/
  login.js        ← Login view
  register.js     ← Registration view
  dashboard.js    ← Main user dashboard
  landing.js      ← Home page
  404.js          ← Not Found view
js/
  router.js       ← SPA router logic
  main.js         ← App entry point
styles.css        ← Global styles
index.html        ← Main HTML file
```

## Author

Created by [Your Name].  
Project for learning purposes.