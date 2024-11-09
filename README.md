# Wanderlust

Wanderlust is a platform similar to Airbnb that allows users to list, browse, book, and review accommodations. This project includes user authentication, payment processing, and review capabilities to provide a comprehensive booking experience.

**Live Website**: [Wanderlust](https://wanderlust-bb60.onrender.com/listings)

## Features

- **List Accommodations**: Users can create new house listings with detailed descriptions and set prices.
- **User Authentication**: Secure sign-up and login functionality using Passport.js.
- **Bookings and Payments**: Users can book accommodations and process payments securely through Stripe. After successful payment, a receipt is sent via email.
- **Reviews**: Users can leave reviews for booked rooms or hotels.
- **Flash Messages**: Informative messages displayed to guide user actions.
- **Responsive Design**: Built using Bootstrap to ensure a mobile-friendly interface.
- **Hosting**: The application is hosted on Render for easy deployment and scalability.

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, Bootstrap
- **Database**: MongoDB, MongoDB Atlas
- **Authentication**: Passport.js
- **Payments**: Stripe
- **Email Receipts**: Nodemailer library used, Integrated email service with Gmail
- **Flash-messages:** Flash-connect is used to display flash messages for user interactions.
- **Hosting**: Render


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Anuj-kushwaha664/wanderlust.git
   cd wanderlust
2. Install Dependencies:
   ```bash
   npm install
3. Set up environment variables: Create a .env file in the root directory and add the following:
   ```bash
   CLOUD_NAME=<your cloud name>
   CLOUD_API_KEY=<your secrete cloud api key>
   CLOUD_API_SECRET=<your cloud api secrete>
   ATLAS_KEY=<your atlas key>
   ATLASDB_URL=<your atlasDB_url >
   STRIPE_PUBLISHABLE_KEY=<your stripe_payment_key>
   STRIPE_SECRET_KEY=<your stripe_secret_key>
   WEBHOOK_SECRET_KEY=<your webhook_secret_key>
4. Run the Application:
   ```bash
   npm run start
5. Open your web browser and visit: http://localhost:8080 to access the wanderlust application.

## Contributing

We welcome contributions from the community to improve and enhance Wanderlust. If you have any suggestions, bug fixes, or new features to add, please submit a pull request. Let's build a better social media experience together!
