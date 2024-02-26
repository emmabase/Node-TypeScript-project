import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "./database";
import userRouter from "./routes/userRoute";

dotenv.config();

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/users", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at ${process.env.APP_URL}`);
});

export default app;