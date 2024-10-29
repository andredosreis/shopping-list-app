# Shopping List App

This is a Shopping List application, built with **Node.js** and **Express**, that allows users to add, edit, mark as purchased, and delete items from their list. The app also offers product suggestions from an external API.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [External API](#external-api)
- [Technologies Used](#technologies-used)
- [Contribution](#contribution)
- [License](#license)

## Features

- Add items to the shopping list.
- Mark items as purchased.
- Edit list items.
- Delete individual items or the entire purchased list.
- Display product suggestions using an external API.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/shopping-list-app.git
   cd shopping-list-app
   
2. Install the dependencies:
    ```bash
   npm install

## Usage
 1. **Start the server in development mode:**
  ``bash
npm run dev``


The server will run at http://localhost:3002.

2. **Open the application:**

Open your browser and navigate to http://localhost:3002.

## Available Scripts

1. npm start: Runs the server in production mode.
2. npm run dev: Runs the server in development mode with Nodemon.

## Project Structure

shopping-list-app/
├── public/
│   ├── css/
│   │   └── styles.css           # Stylesheet file
│   └── js/
│       └── app.js               # Main frontend file
├── views/
│   └── index.html               # Main HTML file
├── server.js                    # Node.js server file
├── package.json                 # Project configuration file
└── README.md                    # Project instructions

## External API

Product suggestions are retrieved via the OpenFoodFacts API, accessed on the server using Axios. The base URL is https://world.openfoodfacts.org/api/v0/product.


## Technologies Used

* Node.js and Express: Server backend.

* Axios: HTTP client for accessing the external API.

* Nodemon: Development tool for automatic server restarts.

* HTML/CSS/JavaScript: Frontend for the user interface.

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository.

2. Create a new branch with your feature: ``bash git checkout -b my-feature.``

3. Commit your changes: ``git commit -m 'My new feature'``.

4. Push to the main repository: ``git push origin my-feature``.

5. Open a Pull Request.

  

 
 
