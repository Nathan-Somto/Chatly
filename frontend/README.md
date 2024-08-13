# Chatly Front-End

This folder houses the frontend code for the next-gen chat application Chatly.

## Folder Structure

```bash
Chatly-Frontend/
├── components/
│ ├── pages/ # Components specific to each page
│ ├── layouts/ # Layout components
│ ├── modals/ # Modal components
│ ├── ui/ # UI components (buttons, forms, etc.)
│ └── common/ # Common components shared across the app
├── constants/ # Constant data or values
├── hooks/ # Zustand and project-specific hooks
├── lib/ # Axios instance and utility functions
├── pages/ # All the pages in the web app
├── assets/ # Public assets and files
├── tests/ # Test files
└── api-types.d.ts # Houses the api types from the backend
```

## Installation Steps

1. **Clone the repository:**
```bash
   git clone https://github.com/nathan-somto/chatly.git
```
2. **Navigate to the project directory:**
```bash
cd frontend
```
3. **Install the dependencies:**
```bash
npm install
```
4. **Start the development server:**
```bash
npm run dev
```