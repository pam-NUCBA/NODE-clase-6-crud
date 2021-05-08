const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8000;

//*body parser:
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//rutas estáticas:
app.use(express.static(path.join(__dirname, "public")));

//routas api:
app.use("/api/users", require("./routes/api/users"));

app.listen(PORT, () => console.log(`server on ${PORT}`));
