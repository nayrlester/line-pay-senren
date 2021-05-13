const line = require('@line/bot-sdk');
const { v4: uuid } = require('uuid'); 
const line_pay = require("line-pay");
const cache = require("memory-cache");

const pay = new line_pay({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
  isSandbox: false
});

const config_bot = {
    channelAccessToken: process.env.LINE_PAY_BOT_TOKEN,
    channelSecret: process.env.LINE_PAY_BOT_SECRET,
};



module.exports = function(app,io){

    app.get("/pay-reserve", (req, res) => {
        let options = {
            productName: "チョコレート",
            amount: 1,
            currency: "JPY",
            orderId: uuid(),
            confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
        }
    
        pay.reserve(options).then((response) => {
            let reservation = options;
            reservation.transactionId = response.info.transactionId;
            cache.put(reservation.transactionId, reservation);
            res.redirect(response.info.paymentUrl.web);
        })
    })

    app.post('/webhook', line.middleware(config_bot), (req, res) => {
        Promise
          .all(req.body.events.map(handleEvent))
          .then((result) => res.json(result))
          .catch((err) => {
            console.error(err);
            res.status(500).end();  
        });
    });

    app.use("/pay", (req, res) => {
        let options = {
            productName: "チョコレート",
            amount: 1,
            currency: "JPY",
            orderId: uuid(),
            confirmUrl: process.env.LINE_PAY_CONFIRM_URL,
        }

        pay.middleware(options).then((response) => {
            console,log(response)
        })
    });

    app.get(`/pay-confirm`, (req, res) => {
        let optionsConfirm = {
            amount: 1,
            currency: "JPY",
            transactionId: uuid(),
        }
    
        pay.confirm(optionsConfirm).then((response) => {
            console,log(response)
        })
    });

    app.get(`/pay-capture`, (req, res) => {
        let options = {
            amount: 1,
            currency: "JPY",
            transactionId: uuid(),
        }
    
        pay.capture(options).then((response) => {
            console,log(response)
        })
    })

}

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
  
    const echo = { type: 'text', text: event.message.text };
  
    return client.replyMessage(event.replyToken, echo);
}