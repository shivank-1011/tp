const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API is running" });
});
app.use("/api/books", require("./src/routes/book.routes"));
app.use("/api/authors", require("./src/routes/author.routes"));
app.use("/api/genres", require("./src/routes/genre.routes"));
app.use("/api/stats", require("./src/routes/stats.routes"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
