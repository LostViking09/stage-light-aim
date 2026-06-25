# Stage Light Aim 📐💡

**Stage Light Aim** is a responsive, high-fidelity web utility for stage lighting designers and technicians to calculate and visualize fixture alignment coordinates. 

When lighting fixtures are rigged to a hanging truss, they are typically focused/aligned while the truss is lowered at a comfortable working height (e.g., chest level). Once raised to its high production height, the beams shift outward. This tool calculates exactly where on the stage floor to aim the beam at the lower height so that it targets the desired spot when raised to the production height.

---

## Key Features

- **Interactive Coordinates Calculator**: Input fixture coordinates, lowered/raised truss heights, and three-dimensional target focal spots.
- **Dynamic SVG Visualizers**:
  - **Top View (X-Y)**: Displays relative locations of the fixture, target spot, and floor aim point with Stage Left/Right and Upstage/Downstage axes.
  - **Side View (Z)**: Visualizes the pitch angle and beam path for both lowered and raised heights.
- **Sleek, High-Contrast UI**: Supports dynamic light and dark themes using beautiful, harmonious HSL-tailored colors.
- **Custom Presets**: Create, save, rename, load, and delete multiple preset configurations locally in your browser (`localStorage`).
- **Focus Angles Sheet**: Provides immediate trigonometric calculations for pan orientation, pitch tilt from vertical, and horizontal distances.

---

## Local Development

Ensure you have **Node.js** installed on your system.

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open the browser**:
   The app will run locally at [http://localhost:3000](http://localhost:3000).

---

## Deployment to GitHub Pages

This project is configured for easy deployment to GitHub Pages on a `gh-pages` branch.

### Deploying the App

1. Ensure the `base` property in [vite.config.ts](vite.config.ts) matches your repository name (currently configured for `/stage-light-aim/`).
2. Run the deployment script:
   ```bash
   npm run deploy
   ```
   This will automatically build the project and push the compiled assets to your repository's `gh-pages` branch.
