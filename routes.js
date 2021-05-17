const line = require('@line/bot-sdk');
// const liff = require('@line/liff');
const { v4: uuid } = require('uuid'); 
const line_pay = require("line-pay");
const cache = require("memory-cache");
const { exec } = require("child_process");

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

module.exports = function(app,io){

    app.get('/', function(req, res) {
        res.render('liff_send_message.ejs')
    });
    
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
                console.log('Success')
                exec(`liff init ${process.env.LINE_ACCESS_TOKEN}`);
                exec(`liff send ${process.env.LINE_PAY_LIFF_ID} ${process.env.LINE_LIFF_USER_ID}`, (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout: ${stdout}`);
                });
                res.redirect('back');
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