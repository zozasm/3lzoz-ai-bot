const express = require("express");

const app = express();

app.use(express.json());

// بيانات مؤقتة للـ Webhook
const VERIFY_TOKEN = "3izoz_verify_2026";

// اختبار الـ Webhook من Meta
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified successfully!");
        return res.status(200).send(challenge);
    }

    res.sendStatus(403);
});

// استقبال رسائل واتساب
app.post("/webhook", (req, res) => {
    console.log("WhatsApp Webhook received:");
    console.log(JSON.stringify(req.body, null, 2));

    res.sendStatus(200);
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`3izoz AI Bot running on port ${PORT}`);
});