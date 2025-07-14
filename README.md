# PetCare Center - SPA

This is a simple Single Page Application (SPA) for a pet care center.

## Project Description

This web app lets people:
- Register as customers
- Register pets
- Make care reservations for their pets
- Log in and see different pages depending on their role (customer or worker)

## Project Structure

```
project-auth/
├── index.html              # Main HTML file
├── src/
│   ├── css/
│   │   └── styles.css      # Styles for the app
│   └── js/
│       ├── main.js         # App logic and initialization
│       ├── router.js       # Routes for the SPA
│       └── views/          # Different pages
│           ├── login.js
│           ├── register.js
│           ├── dashboard.js
│           ├── dashboardCustomer.js
│           ├── dashboardWorker.js
│           ├── landing.js
│           └── 404.js
├── package.json            # Project info and dependencies
```

## Features

- Login and register forms
- Different dashboards for each user
- Simple navigation without reloading the page
- Basic error page (404)

## How to Run

1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Open terminal and go to the folder:

```bash
cd project-auth
```

3. Install dependencies:

```bash
npm install
```

4. Run the project (if there's a script or live server plugin):

```bash
npx live-server
```

Or open `index.html` directly in your browser.

## Technologies Used

- HTML
- CSS
- JavaScript
- SPA Routing (custom)
- Node.js (for package management)

## Notes

This is a basic web app made for learning purposes. It does not connect to a real database.

## Author

- Name: Dylan Marín
- GitHub: [@DylanDeveloper](https://github.com/DylanDeveloper)
