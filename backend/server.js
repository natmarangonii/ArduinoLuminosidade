
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.use(routes);

const porta = 3000;

app.listen(porta, "0.0.0.0", () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`);
});
