# Vienna 3D Scene

An interactive miniature Vienna scene built with React, TypeScript, and Three.js.

Live demo: [https://vienna-3-d-scene.vercel.app/]
(https://vienna-3-d-scene.vercel.app/)

# What is included

- Stylized models of Stephansdom, the Austrian Parliament, and the Prater Giant Ferris Wheel
- OrbitControls for exploring the scene
- Hover highlighting and clickable landmarks with information panels
- Landmark-specific camera views through the Explore action
- A curved Viennese tram route with rails, trackbed, and an animated low-poly tram
- Trees, ground variation, lighting, shadows, and small landmark signs
- Low-poly geometry created directly with Three.js primitives

## Tech stack

 React js
 TypeScript
 Three.js
Vite

## Project structure

```text
src/
├── App.tsx                       # Scene setup, camera, lighting, and animation loop
├── components/
│   ├── InfoPanel.tsx             # Landmark information panel
│   └── landmarkInfo.ts           # Landmark descriptions and camera targets
├── three/
│   ├── environment/
│   │   ├── ground.ts             # Stylized grass ground
│   │   ├── Parlament.ts           # Austrian Parliament model
│   │   ├── road.ts               # Tram route, trackbed, rails, and grooves
│   │   ├── tram.ts               # Tram model and route animation
│   │   └── tree.ts               # Reusable low-poly trees
│   ├── interaction/
│   │   └── raycaster.ts          # Hover and click detection
│   └── landmarks/
│       ├── Prater-Ferriswheel.ts # Ferris wheel model and animation
│       └── stephansdom.ts         # Stephansdom model
├── index.css                    # Global styles
└── main.tsx                     # React entry point
public/                          # Static public files
```

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Vite will print the local development URL in the terminal.

## Scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```


