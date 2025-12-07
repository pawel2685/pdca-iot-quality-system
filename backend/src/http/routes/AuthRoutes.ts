import { Router } from "express";
import { registerUser } from "../../auth/AuthService";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body ?? {};

        if (!email || !firstName || !lastName || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        try {
            const userId = await registerUser({ email, firstName, lastName, password });
            return res.status(201).json({ id: userId, email, firstName, lastName });

        } catch (err) {
            const message = (err as Error).message;
            if (message.includes("ERR_DUP_ENTRY")) {
                return res.status(409).json({ message: "Email is already registered." });
            }

            console.error("Error registering user:", message);
            return res.status(500).json({ message: "Internal server error." });
        }
    } catch (err) {
        console.error("Unexpected error:", (err as Error).message);
        return res.status(500).json({ message: "Internal server error." });
    }
});
