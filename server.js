const express = require("express");

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "3izoz_verify_2026";
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;


app.get("/webhook", function(req, res) {

    var mode = req.query["hub.mode"];
    var token = req.query["hub.verify_token"];
    var challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("Webhook verified");
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }

});


app.post("/webhook", function(req, res) {

    console.log("Message received");
    console.log(JSON.stringify(req.body));

    var message = null;

    try {

        message =
            req.body.entry[0]
            .changes[0]
            .value
            .messages[0];

    } catch (error) {

        console.log("No message found");

        return res.sendStatus(200);

    }


    if (message.type !== "text") {

        return res.sendStatus(200);

    }


    var from = message.from;


    fetch(
        "https://graph.facebook.com/v23.0/" +
        PHONE_NUMBER_ID +
        "/messages",

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

                    body:
                    "مرحبًا بيك 👋 أنا بوت 3lzoz 🤖 حاليًا 3lzoz مش فاضي شوية، وهيرد عليك أول ما يفضى."

                }

            })

        }

    )
    .then(function(response){

        return response.json();

    })
    .then(function(data){

        console.log(data);

    })
    .catch(function(error){

        console.log(error);

    });


    res.sendStatus(200);

});


var PORT = process.env.PORT || 3000;


app.listen(PORT, "0.0.0.0", function(){

    console.log("3lzoz bot running on port " + PORT);

});