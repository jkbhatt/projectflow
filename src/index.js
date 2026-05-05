import "./env.js"; // load env first

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Example app listening on http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
});