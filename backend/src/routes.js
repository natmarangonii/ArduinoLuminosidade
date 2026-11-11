
const express = require("express");
const mysql = require("mysql2/promise");

const router = express.Router();

// Conexao com MariaDB
const db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "estufa",
    port: 3306
});

// Rota inicial
const rotaInicial = (req, res) => {
    res.json("Back-end respondendo");
};

// Receber dados do ESP32
const comandos = async (req, res) => {
    try {
        const { temperatura, umidade, luminosidade } = req.body;

        if (
            [temperatura, umidade, luminosidade].some(
                valor => typeof valor !== "number" ||
                !Number.isFinite(valor)
            )
        ) {
            return res.status(400).json({
                erro: "Dados invalidos"
            });
        }

        // Salvar no MariaDB
        const [resultado] = await db.execute(
            `INSERT INTO Medicao
            (temperatura, umidade, luminosidade)
            VALUES (?, ?, ?)`,
            [temperatura, umidade, luminosidade]
        );

        console.log("Medicao recebida:", req.body);

        res.status(201).json({
            mensagem: "Dados recebidos",
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao salvar medicao"
        });
    }
};

// Listar medicoes
const listarMedicoes = async (req, res) => {
    try {
        const [medicoes] = await db.execute(
            "SELECT * FROM Medicao ORDER BY data ASC, id ASC"
        );

        res.json(medicoes);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar medicoes"
        });
    }
};

// Rotas
router.get("/", rotaInicial);
router.post("/comandos", comandos);
router.get("/medicoes", listarMedicoes);



module.exports = router;
