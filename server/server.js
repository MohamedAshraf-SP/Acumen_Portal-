import express from "express";
import router from "./routes/router.js";
import cors from "cors";
import dotenv from "dotenv";
import { run } from "./config/databaseConnection.js";
import cookieParser from "cookie-parser";



import crypto from "crypto";

// Generate a random code_verifier
const codeVerifier = crypto.randomBytes(32).toString("base64url");
console.log("code_verifier:", codeVerifier);


const codeChallenge = crypto
  .createHash("sha256")
  .update(codeVerifier)
  .digest("base64url");
console.log("codeChallenge:", codeChallenge);

dotenv.config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";
const dbURI = process.env.DB_URI;

console.log(dbURI);

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://api.company-information.service.gov.uk",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// Handle preflight requests for OPTIONS method
app.options("*", cors(corsOptions));

// Connect to the database
try {
  await run(dbURI); // Ensure run() is an async function
} catch (error) {
  console.error("Database connection failed", error);
  process.exit(1); // Exit if the database connection fails
}

// Set up body parsers for handling JSON and URL-encoded data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", router);

// Start the server
app.listen(port, host, (req, res) => {
  console.log(`Server running on Host ${host} Port ${port}...!\n`);
});
