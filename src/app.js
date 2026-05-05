import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

// ✅ CORS must be first
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Middlewares before routes
app.use(express.json())
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static('public'))
app.use(cookieParser())

// ✅ Routes after middlewares
import healthCheckRoute from './routes/healthcheck.route.js'
import authRoute from './routes/auth.routes.js'
import projectRoute from './routes/project.routes.js'
import taskRoute from './routes/task.routes.js'

app.use("/api/v1/healthcheck", healthCheckRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/projects", projectRoute);
app.use("/api/v1/projects/:projectId/tasks", taskRoute);

app.get('/', (req, res) => {
  res.send("Welcome to ProjectFlow")
})

export default app