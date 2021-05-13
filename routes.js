const linepay = require("./controller/linepay.controller");

module.exports = function(app,io){

    app.get("/confirm", (req, res) => {
        res.render("confirm.ejs");
    })

    app.get("/cancel", (req, res) => {
        res.render("cancel.ejs");
    })

    app.get("/line-pay", linepay.pay_reserve);
}