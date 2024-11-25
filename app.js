const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/storage', express.static('storage'));

app.use('/api', require('./routes/commerce'));
app.use('/api', require('./routes/webCommerce'));
app.use('/api', require('./routes/user'));

require('./docs/swagger')(app);

const port = process.env.PORT || 3000;

const dbConnect = async () => {
  const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI_TEST : process.env.DB_URI;
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(db_uri);
    console.log("Conectado a la BD");
  } catch (error) {
    console.error("Error conectando a la BD:", error);
  }
};

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log("Servidor escuchando en el puerto " + port);
    dbConnect();
  });
} else {
  dbConnect();
}

module.exports = app; // Exporta la instancia de la aplicación