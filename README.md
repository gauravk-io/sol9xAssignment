# sol9xAssignment

This is a full-stack web application that allows users to manage their student records. The application is built using React for the frontend and Node.js with Express for the backend.

## Features

- User authentication (login and signup)
- Student management by admin (add student, edit student data, delete student)
- Students can view their own data and edit data and update their password
- Admin can search students by name and email
- Pagination in Admin student list.
- Responsive design

## Technologies

- React
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Axios
- React Router

## Setup

1. Clone the repository:
```bash
$ git clone https://github.com/gauravk-io/sol9xAssignment.git
$ cd sol9xAssignment
```

2. Install dependencies:
```bash
$ cd client
$ npm install
$ cd ../server
$ npm install
```

3. Configure environment variables:
```bash
$ cp client/.env.example client/.env
$ cp server/.env.example server/.env
```

4. Start the development server:
```bash
$ cd client
$ npm start
$ cd ../server
$ npm run dev
```

## License

This project is licensed under the MIT License.