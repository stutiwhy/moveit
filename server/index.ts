import express, { type Request, Response, NextFunction } from "express";
import authRoutes from "./routes/auth"; // ✅ Import authentication routes
import cors from 'cors';

console.log("🚀 Server initialization started");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      console.log(logLine);
    }
  });

  next();
});

console.log("🔐 Registering authentication routes");
app.use("/auth", authRoutes); // ✅ Add authentication routes

app.use((err, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  });
  console.error(err);
});


// Catch-all route for handling undefined routes
app.get("/", (req, res) => {
  res.send("Welcome to the MoveIt API! Use /auth/register to register.");
});

const port = 5000;
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
