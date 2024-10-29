const express = require("express");
const dbConnect = require('./config/mongo');
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/commerce'));
app.use('/api', require('./routes/webCommerce'));
app.use('/api', require('./routes/user'));

require('./docs/swagger')(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
  dbConnect();
});