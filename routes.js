const lineBot = require('@line/bot-sdk');
// const liff = require('@line/liff');
const { v4: uuid } = require('uuid'); 
const line_pay = require("line-pay");
const cache = require("memory-cache");

const myLiffId = process.env.LINE_PAY_LIFF_ID;

const pay = new line_pay({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
  isSandbox: true
});

let config_bot = {
    channelAccessToken: process.env.LINE_PAY_BOT_TOKEN,
    channelSecret: process.env.LINE_PAY_BOT_SECRET,
};
const bot = new lineBot.Client(config_bot);

module.exports = function(app,io){

    app.get('/', function(req, res) {
        res.render('index.ejs')
    });

    app.get('/privacy', function(req, res) {
        res.render('privacy.ejs')
    });

    app.get('/terms', function(req,res){
        res.render('terms.ejs')
    })
    
    app.get('/send-id', function(req, res) {
        res.json({id: myLiffId});
    });

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
            cache.put("transactionId", reservation.transactionId);
            cache.put("paymentAccessToken", response.info.paymentAccessToken);
            cache.put("orderId", reservation.orderId);
            res.redirect(response.info.paymentUrl.web);
        })
    })

    app.post('/webhook', lineBot.middleware(config_bot), (req, res) => {
        Promise
          .all(req.body.events.map(handleEvent))
          .then((result) => res.json(result))
          .catch((err) => {
            console.error(err);
            res.status(500).end();  
        });
    });

    app.get(`/pay-confirm`, (req, res) => {
        let optionsConfirm = {
            amount: 1,
            currency: "JPY",
            transactionId: req.query.transactionId
        }

        pay.confirm(optionsConfirm).then((response) => {
            if(response.returnMessage == 'Success.'){
                let url = "https://liff.line.me/"+ myLiffId;
                res.redirect(url)
            }else{
                console.log('Payment Failed.')
            }
        })
    });

}

function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
  
    const echo = { type: 'text', text: event.message.text };
  
    return client.replyMessage(event.replyToken, echo);
}