# Project Documentation

## Folder Structure

### Client Folder (`client/`)
- **Purpose:** Contains the frontend code for the project.
- **Technologies Used:** React.js, TypeScript.
- **Notable Files:**
  - `src/` - Main source code.
  - `public/` - Static assets.
  - `package.json` - Project dependencies and scripts.

### Server Folder (`server/`)
- **Purpose:** Hosts the backend code and APIs for the project.
- **Technologies Used:** Node.js, Express.js.
- **Notable Files:**
  - `src/` - Main server logic.
  - `routes/` - API endpoints.
  - `package.json` - Server dependencies and scripts.

### WebSocket Nginx Configuration (`websocket-nginx.config`)
- **Purpose:** Configuration file for Nginx to handle WebSocket connections.
- **Notable Settings:**
  - Proxying WebSocket requests.
  - Load balancing.
  - SSL termination (if applicable).

## Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites
- Node.js installed.
- Nginx installed for production deployment.

### Installation
1. Clone the repository.
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
3. Navigate to the server folder:
   ```bash
   cd server
   npm install
   ```

### Available Scripts

In the project directory, you can run:

#### `npm start`
- Runs the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

#### `npm test`
- Launches the test runner in the interactive watch mode.

#### `npm run build`
- Builds the app for production to the `build` folder.
- Optimizes the build for the best performance.

### Running the Project
1. Start the frontend:
   ```bash
   npm start
   ```
2. Start the backend:
   ```bash
   npm run dev
   ```
3. Ensure Nginx is properly configured using the `websocket-nginx.config` file.

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000; # Frontend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Contributing
- Fork the repository.
- Create a feature branch.
- Commit your changes.
- Open a pull request.

## License
This project is licensed under the MIT License.

