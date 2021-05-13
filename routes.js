const linepay = require("./controller/linepay.controller");
const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.LINE_PAY_BOT_TOKEN,
    channelSecret: process.env.LINE_PAY_BOT_SECRET,
};

module.exports = function(app,io){

    app.get("/", (req, res) => {
        res.render("index.ejs");
    })
    
    app.get("/confirm", (req, res) => {
        res.render("confirm.ejs");
    })

    app.get("/cancel", (req, res) => {
        res.render("cancel.ejs");
    })

    app.get("/line-pay", linepay.pay_reserve);

    app.post('/webhook', line.middleware(config), (req, res) => {
        Promise
          .all(req.body.events.map(handleEvent))
          .then((result) => res.json(result))
          .catch((err) => {
            console.error(err);
            res.status(500).end();  
        });
    });
}

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
  
    const echo = { type: 'text', text: event.message.text };
  
    return client.replyMessage(event.replyToken, echo);
}