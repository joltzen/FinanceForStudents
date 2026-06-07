# FinanceForStudents

**FinanceForStudents** is your personal finance companion — built for students, but useful for anyone who wants to stay on top of their money. Track expenses, manage budgets, set savings goals, and get a clear monthly and annual overview of your finances.

## 📖 Project Overview

| Layer | Technology |
|-------|-----------|
| Frontend | React, Material UI, Chart.js |
| Auth & Database | Firebase Authentication, Cloud Firestore |
| Backend | Node.js, Express (email & auxiliary APIs) |
| Hosting | Firebase Hosting |
| CI/CD | GitHub Actions |

## 🚀 Features

- Sign up / login via Firebase Authentication
- Add, view, and filter transactions (monthly & annual view)
- Category management with budget limits and custom colors
- Savings goals tracking
- Favorites for recurring transactions
- Fixed costs management
- Monthly and annual budget summaries
- Dark / light mode
- Interactive charts (bar & pie)
- Responsive design for mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Material UI 5, Chart.js, React Router
- **Database**: Cloud Firestore
- **Auth**: Firebase Authentication
- **Backend**: Node.js, Express, Nodemailer
- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions

## ⚙️ Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- [npm](https://www.npmjs.com/) ≥ 9

### Clone the repository

```bash
git clone https://github.com/joltzen/FinanceForStudents.git
cd FinanceForStudents
```

### Install dependencies

```bash
# Frontend
cd client && npm install

# Backend (optional, for email features)
cd ../server && npm install
```

### Firebase configuration

The Firebase project config is already included in `client/src/firebase.js`. No additional setup is needed to run the app locally.

If you want to connect to your own Firebase project, replace the config values in `client/src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
};
```

### Backend environment (optional)

Create a `.env` file inside `/server` for email functionality:

```bash
JWT_SECRET=<your_jwt_secret>
EMAIL_HOST=<smtp_server>
EMAIL_PORT=<smtp_port>
EMAIL_USER=<smtp_user>
EMAIL_PASS=<smtp_password>
```

## 🏁 Running the App

```bash
# Start the frontend
cd client && npm start

# Start the backend (separate terminal, optional)
cd server && npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:3001`.

## 📦 Deployment

The app is hosted on **Firebase Hosting** at [www.financeforstudents.de](https://www.financeforstudents.de).

Every push to `main` triggers an automatic deploy via GitHub Actions. The workflow:
1. Builds the React app (`client/build`)
2. Deploys to Firebase Hosting

To set up deployment in your own fork, add a `FIREBASE_TOKEN` secret to your GitHub repository (generate one with `firebase login:ci`).

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add feature XYZ"`)
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

- Website: [www.financeforstudents.de](https://www.financeforstudents.de)
- Issues: [github.com/joltzen/FinanceForStudents/issues](https://github.com/joltzen/FinanceForStudents/issues)
