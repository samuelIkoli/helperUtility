import express, { Request, Response, NextFunction } from "express";
import { readdirSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world! I am a helper utility function");
});

app.get("/try", (req: Request, res: Response) => {
  res.send("A bunch of bananas ate a monkey");
});

readdirSync("./src/routes").map((path) =>
  app.use("/", require(`./routes/${path}`))
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      status: "error",
      message: "Bad request",
    });
  }
  next(err);
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).send({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export default app;
