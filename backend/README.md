# Chatly Backend

The backend folder for the Chatly application built with Express, Node, TypeScript, and Prisma.

**Note:**  Authentication is handled by `clerk`, so when a protected controller is called, it is by the logged-in user.

## API Docs

To view the API docs [click me](https://example.com).

## Folder Structure

```bash
Chatly-Backend/
├── config/ # Configuration files
├── controllers/ # Controllers (e.g., user.controller.ts, chat.controller.ts)
├── middlewares/ # Middleware functions
├── prisma/ # Prisma schema and client
├── routes/ # Routes (e.g., user.routes.ts, chat.routes.ts)
├── utils/ # Utility functions
└── tests/ # Test files
```

## Environment Variables

Copy the contents of `.env.example`, create a `.env` file in the same location, and carefully paste the contents of the `.env.example` into the `.env` file.

## Installation Steps

1. **Clone the repository:**
```bash
   git clone https://github.com/nathan-somto/chatly.git
```
2. **Navigate to the project directory:**

```bash
cd chatly-backend
```
3. **Install the dependencies:**

```bash
npm install
```
4. **Generate Prisma client:**

```bash
npm run prisma:generate
```
5. **Seed your test database:**

```bash
npm run seed
```
6. **Start the development server:**

```bash
npm run dev
```
7. **Build for production:**

```bash
npm run build
```
8. **Start the production server:**

```bash
npm start
```