const express = require("express");
const router = express.Router();
const uuid = require("uuid");

const users = require("../../users");

//*cambio el app por router
//router.get("/api/users", (req, res) => res.json(users));
//*como la ruta la paso en el index, ahora puedo solo poner / en la ruta:
router.get("/", (req, res) => res.json(users));

//* y acá lo mismo, puedo obviar toda la ruta:
//router.get("/api/users/:id", (req, res) => {
router.get("/:id", (req, res) => {
  const userExists = users.some((user) => user.id === parseInt(req.params.id));

  if (userExists) {
    res.json(users.filter((user) => user.id === parseInt(req.params.id)));
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

//*crear un user
router.post("/", (req, res) => {
  // res.send(req.body)
  //*para hacer esto, en el postman, en headers:
  //Content-Type: application/json
  //*y en body:
  // {
  //   "id": 4,
  //   "name": "Totoro",
  //   "status": "active",
  //   "email": "gato_gordo@email.com"
  // }

  //*esto sin embargo no va a funcionar así directamente. Antes el body-parser era un npm que se instalaba, ahora viene nativo. Lo vamos a pasar por el index

  //*el res.send solo lo muestra, pero no lo grabaría, para eso hacemos:
  const newUser = {
    //*por qué usamos la v4: https://en.wikipedia.org/wiki/Universally_unique_identifier#:~:text=Version%2D1%20UUIDs%20are%20generated,version%2D4%20UUIDs%20are%20generated
    id: uuid.v4(),
    name: req.body.name,
    status: req.body.status, //podría pasarle 'active' y que todos los nuevos estén activos
    email: req.body.email,
  };

  if (!newUser.name || !newUser.email || !newUser.status) {
    return res.status(400).json({ message: "Missing fields." });
  } else {
    users.push(newUser);
    res.json(users);
  }
});

//*update un user
router.put("/:id", (req, res) => {
  //*primero chequeo que el id exista, igual que hice antes
  const userExists = users.some((user) => user.id === parseInt(req.params.id));

  if (userExists) {
    const updateUser = req.body;
    //*puedo hacer un loop a través de los usuarios, y el que coincide el id,lo selecciono
    users.forEach((user) => {
      if (user.id === parseInt(req.params.id)) {
        //*necesito chequear si el dato viene. Si no, dejo el que estaba
        user.name = updateUser.name ? updateUser.name : user.name;
        user.email = updateUser.email ? updateUser.email : user.email;
        user.status = updateUser.status ? updateUser.status : user.status;

        res.json({ message: "updated user Nº" + user.id });
      }
    });
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

//*delete user: se puede copiar el get user
router.delete("/:id", (req, res) => {
  const userExists = users.some((user) => user.id === parseInt(req.params.id));

  if (userExists) {
    //*devuelvo los que no sean ese id
    res.json({
      message: `deleted user`,
      users: users.filter((user) => user.id !== parseInt(req.params.id)),
    });
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

module.exports = router;
