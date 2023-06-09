import express, { Errback, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import { protect } from "./modules/auth";
import router from "./router";
import { creatNewUser, signIn } from "./handlers/user";
import { body } from "express-validator";
import { handleInputErrors } from "./modules/error";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    setTimeout(() => {
        next(new Error("Error"));
    }, 100);
});

app.use("/api", protect, router);

app.post(
    "/user",
    body("email").exists().isEmail().withMessage("Invalid Email Format"),
    body("username").exists().isString(),
    body("password").exists().isString(),
    handleInputErrors,
    creatNewUser
);
app.post("/signin", handleInputErrors, signIn);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.cause === "auth") {
        res.status(401).json({ message: "Unauthorized" });
    } else if (err.cause === "input") {
        res.status(400).json({ message: "invalid input" });
    } else {
        res.status(500).json({ message: "oops that's on us" });
    }
});

export default app;
