const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");
const app = express();

app.use(cors());
app.use(express.json());

// GET / — wymagane przez Roblox (inaczej 502)
app.get("/", (req, res) => {
    res.send("Groq backend działa");
});

// POST /generate — endpoint dla pluginu
app.post("/generate", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

        const completion = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content:
                        "Jesteś generatorem kodu do ROBLOX. ZAWSZE generujesz czysty kod LUAU zgodny z Roblox Studio. Jeśli użytkownik poprosi o GUI, generujesz pełne GUI w Roblox (ScreenGui, Frame, TextLabel, TextButton, UIStroke, UICorner, UIGradient, TweenService animacje). Nigdy nie generujesz kodu do aplikacji mobilnych, Solar2D, Corona SDK, Love2D, Unity, Unreal ani niczego innego. Tylko ROBLOX LUAU."
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const code = completion.choices[0].message.content;

        res.json({ code: code });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Błąd generowania kodu" });
    }
});

// Start serwera
app.listen(3000, () => {
    console.log("Backend Groq działa na porcie 3000");
});
