# Builder App Frontend

This project is the frontend application for the Builder App, developed using Angular. It offers dynamic pages and extensive customization capabilities for admins, ensuring an interactive and user-friendly experience.

## Features

### Normal Users
- **Landing Page**: Normal users are redirected to a visually appealing main landing page.
- **Dynamic Data**: Content displayed on the landing page is fetched from the database via APIs.

### Admins
- **Dashboard**: Admins are redirected to a dedicated dashboard upon login.
  - **User Management**: View all connected users, toggle admin status, or delete users.
  - **Customization**: Modify all content displayed on the main landing page:
    - Change text, button URLs, images, icons, and videos.
    - Note: Styling and position adjustments are not supported yet but can be implemented in the future.
  - **Real-Time Updates**: Seamless updates on the main landing page when changes are published, powered by WebSocket integration.
- **Authentication**: User authentication using JWT tokens from the backend.
- **Notifications**: Real-time notifications using the `ngx-toastr` npm module.
- **Media Management**: Media is stored securely on Cloudinary.

### Security
- **Route Guards**: Routes are protected using Angular Auth Guards.

## Issues
1. **Admin Status Storage**: Admin status is stored in local storage, which is vulnerable to manipulation.

## Technologies Used
- **Framework**: Angular
- **Authentication**: JWT tokens
- **Notifications**: ngx-toastr
- **Real-Time Communication**: WebSockets
- **File Storage**: Cloudinary

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- Backend APIs up and running.

### Cloning the Repository
```bash
git clone https://github.com/BilalSubhani/BuilderAppFrontend.git
cd builder-app-frontend
```

### Setting Up the Environment
1. Create a `src/environments/environment.ts` file.
2. Add the following configuration details:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'your_backend_api_url',
      cloudinaryUrl: 'your_cloudinary_url'
    };
    ```

### Installing Dependencies
```bash
npm install
```

### Running the Application
```bash
npm run start 
or
ng serve --open
```
The application will be available at `http://localhost:4200`.

## Deployment
To deploy this Angular application:
1. Build the project:
    ```bash
    ng build --prod
    ```
2. Deploy the `dist` folder to your hosting service.

## Contact
For questions, suggestions, or support, please reach out:
- **Email**: bilalsubhanii@outlook.com
- **GitHub**: [Bilal Subhani](https://github.com/BilalSubhani)

---

Feel free to contribute or report issues to enhance the Builder App Frontend!
