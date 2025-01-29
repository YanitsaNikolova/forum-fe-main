# Forum Application

This project is a forum application built with React. It allows users to register, log in, create topics, and participate in discussions. Administrators have additional privileges to manage users and their roles.

## Features

- User registration and login
- Create, view, and participate in topics
- Pagination for topics and users
- Admin panel for managing users and roles

## Technologies Used

- React
- Vite
- React Router
- Universal Cookies
- Fetch API

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/YanitsaNikolova/forum-fe-main.git
   ```

2. Navigate to the project directory:
   ```sh
   cd forum-fe-main
   ```

3. Install dependencies:
   ```sh
   npm install
   ```

4. Start the development server:
   ```sh
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8081`.

## Folder Structure

- `src/components`: Contains React components such as `Menu`, `AdminPanel`, etc.
- `src/Global`: Contains global configurations like `ApiURL`.
- `public`: Contains static assets like images.

## Admin Panel

The admin panel is accessible only to users with the admin role. It allows administrators to manage user roles and view user information.

## License

This project is licensed under the MIT License.
