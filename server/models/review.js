var db = require("./db");

var Review = db.model("Review",{
    title : String,
    user : String,
    textarea_form : String
});

module.exports = Review;