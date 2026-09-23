const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "3izoz_verify_2026";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// التحقق من Webhook
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

// استقبال رسائل واتساب والرد عليها
app.post("/webhook", async (req, res) => {
    console.log("WhatsApp Webhook received:");
    console.log(JSON.stringify(req.body, null, 2));

    try {
        const message =
            req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

        const from = message.from;

        if (message.type !== "text") {
            return res.sendStatus(200);
        }

        const userMessage = message.text.body;

        console.log("Message:", userMessage);

        const response = await fetch(
            `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                        body: "مرحبا بيك انا بوت 3LZOZ حاليا3LZOZ م فاضي شويه وهيرد عليك\ي"
                    }
                })
            }
        );

        const result = await response.json();

        console.log("WhatsApp API response:");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("Error:", error);
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`3izoz AI Bot running on port ${PORT}`);
});
