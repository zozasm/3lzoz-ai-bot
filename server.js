const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "3izoz_verify_2026";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Webhook verification
app.get("/webhook", function (req, res) {
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
app.post("/webhook", async function (req, res) {
    console.log("WhatsApp Webhook received:");
    console.log(JSON.stringify(req.body, null, 2));

    try {
        var message = null;

        if (
            req.body &&
            req.body.entry &&
            req.body.entry[0] &&
            req.body.entry[0].changes &&
            req.body.entry[0].changes[0] &&
            req.body.entry[0].changes[0].value &&
            req.body.entry[0].changes[0].value.messages
        ) {
            message = req.body.entry[0].changes[0].value.messages[0];
        }

        if (!message) {
            return res.sendStatus(200);
        }

        if (message.type !== "text") {
            return res.sendStatus(200);
        }

        const from = message.from;

        const response = await fetch(
            "https://graph.facebook.com/v23.0/" + PHONE_NUMBER_ID + "/messages",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + WHATSAPP_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: from,
                    type: "text",
                    text: {
                        body: "مرحبًا بيك 👋 أنا بوت 3lzoz 🤖 حاليًا 3lzoz مش فاضي شوية، وهيرد عليك أول ما يفضى."
                    }
                })
            }
        );

        const result = await response.json();

        console.log("WhatsApp response:");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.log("Error:", error);
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", function () {
    console.log("3lzoz AI Bot running on port " + PORT);
});