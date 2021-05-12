const linepay = require("./controller/linepay.controller");

module.exports = function(app,io){

    app.get("/", (req, res) => {
        res.render("index.ejs");
    })

    //POST
    app.post("/pay-reserve", linepay.pay_reserve);

}