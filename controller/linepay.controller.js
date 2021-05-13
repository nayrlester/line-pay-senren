const line = require('line-pay');
const { v4: uuid } = require('uuid'); 
const cache = require("memory-cache");
const pay = new line({
    channelId: process.env.LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.LINE_PAY_CHANNEL_SECRET,
    isSandbox: false
}) 

exports.pay_reserve = async function(req, res){
    try{

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


    }catch (error){ 
        console.log(error)
    }
}



