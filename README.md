# Babylon.js 3D Editor Mockup

Standalone structured mockup for a simplified 3D editor.

## File structure

```txt
babylon_3d_mockup/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── main.js
    ├── scene.js
    ├── ui.js
    ├── state.js
    └── parts.js
```

## Responsibilities

- `index.html`: markup and asset loading
- `css/styles.css`: all visual styling
- `js/main.js`: app bootstrap
- `js/scene.js`: Babylon.js scene, camera, lights, ground, meshes
- `js/ui.js`: sidebar UI, sliders, selection handling
- `js/state.js`: editor state and reset helpers
- `js/parts.js`: editable object part definitions

## Run locally

Because this uses JavaScript modules, run it through a local server:

```bash
run.sh
```

Then open:

```txt
http://localhost:8080
```
