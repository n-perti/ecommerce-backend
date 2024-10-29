const mongoose = require("mongoose");

/* Commerce scheme 
- Nombre del comercio (String)
- CIF (String)
- Dirección (String)
- E-mail (String)
- Teléfono de contacto (String)
- Id de página (Number)
*/

const commerceScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  cif: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  pageId: {
    type: Number,
    required: true,
  },
  token: {
    type: String
  },
});

module.exports = mongoose.model("commerce", commerceScheme);
