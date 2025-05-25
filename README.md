# Lectures

This repository contains the source code for a frontend web application built using modern web development tools and frameworks.

## Features

* **Frameworks & Libraries**:

  * Vite: Next-generation frontend tooling.
  * Tailwind CSS: Utility-first CSS framework.
  * TypeScript: Typed superset of JavaScript.
  * PostCSS: Tool for transforming CSS with JavaScript plugins.

* **Configuration Files**:

  * `vite.config.ts`: Configuration for Vite.
  * `tailwind.config.js`: Tailwind CSS configuration.
  * `postcss.config.js`: PostCSS configuration.
  * `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript configurations.
  * `eslint.config.js`: ESLint configuration for code linting.

* **Project Structure**:

  * `index.html`: Entry point of the web application.
  * `src/`: Contains the source code of the application.

## Getting Started

### Prerequisites

Ensure you have the following installed:

* Node.js
* npm

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/latha0001/lectures.git
   cd lectures
   ```



2. **Install dependencies**:

   ```bash
   npm install
   ```



### Running the Development Server

To start the development server:

```bash
npm run dev
```



This will start the application at [http://localhost:5173](http://localhost:5173) (default Vite port).

### Building for Production

To build the application for production:

```bash
npm run build
```



The optimized and minified output will be in the `dist/` directory.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
```



## Scripts

* `npm run dev`: Starts the development server.
* `npm run build`: Builds the application for production.
* `npm run preview`: Previews the production build locally.

