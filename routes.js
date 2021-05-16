const line = require('@line/bot-sdk');
const { v4: uuid } = require('uuid'); 
const line_pay = require("line-pay");
const cache = require("memory-cache");
const myLiffId = process.env.LINE_PAY_LIFF_ID;

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

    app.get('/', function(req, res) {
        res.render('index.ejs')
    });
    
    app.get('/send-id', function(req, res) {
        res.json({id: myLiffId});
    });

    app.get('/confirm', function(req, res){
        res.render('confirm.ejs')
    })

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
            cache.put("paymentAccessToke", response.info.paymentAccessToken);
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

    app.get(`/pay-confirm`, (req, res) => {
        let optionsConfirm = {
            amount: 1,
            currency: "JPY",
            transactionId: req.query.transactionId
        }

        pay.confirm(optionsConfirm).then((response) => {
            if(response.returnMessage == 'Success.'){
                console.log('Payment success')
                res.redirect('back');
            }else{
                console.log('Payment Failed.')
            }
        })
    });

    app.get(`/pay-capture`, (req, res) => {
        let options = {
            amount: 1,
            currency: "JPY",
            transactionId: req.query.transactionId
        }

        console.log(req.query.transactionId)
    
        pay.capture(options).then((response) => {
            console,log(response.info.payInfo)
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