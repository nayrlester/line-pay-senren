const axios = require('axios');
const line = require('line-pay-sdk');
const uuid = require('uuidv4');

const config = {
    channelId: process.env.YOUR_LINE_PAY_CHANNEL_ID,
    channelSecret: process.env.YOUR_LINE_PAY_CHANNEL_SECRET,
    isSandbox: true
};

exports.pay_reserve = async function(req, res){
    try{

        let options = {
            productName: "チョコレート",
            amount: 1,
            currency: "JPY",
            orderId: uuid(),
            confirmUrl: process.env.LINE_PAY_CONFIRM_URL
        }
    
        line.reservePayment(options).then((response) => {
            let reservation = options;
            reservation.transactionId = response.info.transactionId;
    
            console.log('Reservation was made.');
            console.log(reservation);
    
            cache.put(reservation.transactionId, reservation);
            res.redirect(response.info.paymentUrl.web);
        })

    }catch (error){
        console.log(error)
    }
}

