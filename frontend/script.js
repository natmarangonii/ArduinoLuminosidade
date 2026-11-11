
const API = "http://localhost:3000/medicoes";

// Criar graficos
function criarGrafico(id, nome, cor) {

    return new Chart(document.getElementById(id), {
        type: "line",

        data: {
            labels: [],
            datasets: [{
                label: nome,
                data: [],
                borderColor: cor,
                backgroundColor: cor,
                tension: 0.3
            }]
        },

        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

const graficoTemperatura = criarGrafico(
    "graficoTemperatura",
    "Temperatura (°C)",
    "#d97757"
);

const graficoUmidade = criarGrafico(
    "graficoUmidade",
    "Umidade (%)",
    "#5398c7"
);

const graficoLuminosidade = criarGrafico(
    "graficoLuminosidade",
    "Luminosidade",
    "#d5a83e"
);


// Atualizar grafico
function atualizarGrafico(grafico, horarios, valores) {

    grafico.data.labels = horarios;
    grafico.data.datasets[0].data = valores;
    grafico.update();
}


// Buscar medicoes
async function carregarDados() {

    const status = document.getElementById("status");

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Erro HTTP " + resposta.status);
        }

        const medicoes = await resposta.json();

        if (!Array.isArray(medicoes)) {
            throw new Error("Resposta invalida da API");
        }

        if (medicoes.length === 0) {
            status.textContent = "Nenhuma medicao cadastrada.";
            return;
        }

        // Ordenar pelo ID
        medicoes.sort((a, b) => a.id - b.id);

        const ultimas = medicoes.slice(-20);
        const atual = ultimas[ultimas.length - 1];

        document.getElementById("temperatura").textContent =
            atual.temperatura + " °C";

        document.getElementById("umidade").textContent =
            atual.umidade + " %";

        document.getElementById("luminosidade").textContent =
            atual.luminosidade;

        const horarios = ultimas.map(m =>
            new Date(m.data).toLocaleTimeString("pt-BR")
        );

        atualizarGrafico(
            graficoTemperatura,
            horarios,
            ultimas.map(m => Number(m.temperatura))
        );

        atualizarGrafico(
            graficoUmidade,
            horarios,
            ultimas.map(m => Number(m.umidade))
        );

        atualizarGrafico(
            graficoLuminosidade,
            horarios,
            ultimas.map(m => Number(m.luminosidade))
        );

        status.textContent = "Dados atualizados!";

    } catch (erro) {

        console.error(erro);
        status.textContent = "Erro ao conectar com a API.";
    }
}

// Carregar inicialmente
carregarDados();

// Atualizar a cada 10 segundos
setInterval(carregarDados, 10000);
