const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
//const url = process.env.MONGO_URL;
const url ="mongodb+srv://dbadmin:austintheboss69@cluster0-wbbfa.azure.mongodb.net/test?retryWrites=true&w=majoritynod";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoose;
  












