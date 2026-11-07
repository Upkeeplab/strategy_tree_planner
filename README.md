
# Strategy Tree Planner
[![Netlify Status](https://api.netlify.com/api/v1/badges/b113f6a7-d409-47fc-bde2-80734a086e3f/deploy-status)](https://app.netlify.com/projects/strategyplanner/deploys)

A lightweight local-first strategic planning web app.

## Features

- Infinite hierarchical text planning
- Strategic notation support
- AND / XOR / OR / SEQ semantics
- Decision points
- Local save
- PDF export
- Offline capable
- No subscriptions
- No backend required

## How to Run

Just open `index.html` in your browser.

## Recommended Usage

Use notation like:

    [AND]
    [XOR]
    [OR]
    [SEQ]
    [RISK]
    [ASSUMPTION]

Example:

    1 Main Goal

        [AND]
        1.1 Build Product
        1.2 Build Audience

        [XOR]
        1.3 Strategy A
        1.4 Strategy B

## Export to PDF

Click:
- Export PDF

Then:
- Save as PDF in your browser print dialog.



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.


## Run
npm run dev
