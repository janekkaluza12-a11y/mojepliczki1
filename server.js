import express from "express";
import cors from "cors";
import { Groq } from "groq-sdk";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Groq backend działa");
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "generuj tylko kod w języku luau bez tlumaczeia i jak umiesz to takze gui." },
                { role: "user", content: prompt }
            ]
        });

        res.json({
            code: completion.choices[0].message.content
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("Groq backend działa");
});

app.listen(3000, () => console.log("Backend Groq działa na porcie 3000"));
