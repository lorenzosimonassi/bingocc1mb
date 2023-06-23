let timer;
let numerosSorteados = new Set();
let jogoEncerrado = false;

function iniciarTemporizador() {
    if (jogoEncerrado) {
        return;
    }

    timer = setInterval(jogarBingo, 1000);
}

function pararTemporizador() {
    clearInterval(timer);
}

function jogarBingo() {
    if (numerosSorteados.size >= 75) {
        alert("Todos os números já foram sorteados!");
        pararTemporizador();
        return;
    }

    const sortearNumero = () => {
        if (numerosSorteados.size >= 75) {
            pararTemporizador();
            return;
        }

        let numeroSorteado;
        do {
            numeroSorteado = gerarNumero();
        } while (numerosSorteados.has(numeroSorteado));

        numerosSorteados.add(numeroSorteado);
        marcarNumeroSorteado(numeroSorteado);

        const numeroSorteadoElemento = document.createElement("span");
        numeroSorteadoElemento.textContent = numeroSorteado;

        const numerosSorteadosLista = document.getElementById("numeros-sorteados-lista");
        numerosSorteadosLista.appendChild(numeroSorteadoElemento);
        numerosSorteadosLista.appendChild(document.createElement("br"));

        if (verificarCartelasCompletas()) {
            declararVencedor();
            pararTemporizador();
        }

        if (jogoEncerrado) {
            pararTemporizador();
        }
    };

    sortearNumero();
}

function marcarNumeroSorteado(numero) {
    const cartelas = document.getElementsByClassName("cartela");
    Array.from(cartelas).forEach((cartela) => {
        if (cartela.classList.contains("vencedor")) {
            return; // Ignorar cartela já marcada como vencedor
        }

        const numerosCartela = cartela.getElementsByClassName("numero-vazio");
        Array.from(numerosCartela).forEach((numeroCartela) => {
            if (numeroCartela.textContent.trim() === numero.toString()) {
                numeroCartela.classList.add("numero-presente");
                numeroCartela.classList.remove("numero-vazio");
            }
        });
    });
}

function reiniciarJogo() {
    pararTemporizador();
    jogoEncerrado = false;

    const cartelasContainer = document.getElementById("body_cartelas");
    cartelasContainer.innerHTML = "";

    const numerosSorteadosLista = document.getElementById("numeros-sorteados-lista");
    numerosSorteadosLista.innerHTML = "";

    numerosSorteados = new Set();
}

function gerarCartelaHTML() {
    const nomeJogadorInput = document.getElementById("nome_jogador");
    const nomeJogador = nomeJogadorInput.value.trim();

    if (nomeJogador === "") {
        alert("Por favor, digite o nome do jogador.");
        return;
    }

    const cartela = document.createElement("div");
    cartela.className = "cartela";
    cartela.innerHTML = `
    <h4>${nomeJogador}</h4>
    <table>
      <thead>
        <th>B</th>
        <th>I</th>
        <th>N</th>
        <th>G</th>
        <th>O</th>
      </thead>
      <tbody>
        ${gerarNumerosCartela()}
      </tbody>
    </table>
  `;

    const cartelasContainer = document.getElementById("body_cartelas");
    cartelasContainer.appendChild(cartela);

    nomeJogadorInput.value = "";
}

function gerarNumerosCartela() {
    const numerosCartela = new Set();

    while (numerosCartela.size < 25) {
        const numero = gerarNumero();
        numerosCartela.add(numero);
    }

    const numerosArray = Array.from(numerosCartela);

    let numerosHTML = "";
    let count = 0;
    for (let i = 0; i < 5; i++) {
        numerosHTML += "<tr>";
        for (let j = 0; j < 5; j++) {
            const numeroCartela = numerosArray[count];
            numerosHTML += `<td class="numero-vazio">${numeroCartela}</td>`;
            count++;
        }
        numerosHTML += "</tr>";
    }

    return numerosHTML;
}

function gerarNumero() {
    return Math.floor(Math.random() * 75) + 1;
}

function verificarCartelasCompletas() {
    const cartelas = document.getElementsByClassName("cartela");
    for (const cartela of cartelas) {
        const numerosCartela = cartela.getElementsByClassName("numero-vazio");
        if (numerosCartela.length === 0) {
            return true;
        }
    }
    return false;
}

function declararVencedor() {
    const cartelas = document.getElementsByClassName("cartela");
    for (const cartela of cartelas) {
        const numerosCartela = cartela.getElementsByClassName("numero-vazio");
        if (numerosCartela.length === 0) {
            cartela.classList.add("vencedor");
            const nomeJogadorElemento = cartela.querySelector("h4");
            const nomeJogador = nomeJogadorElemento.textContent.trim();
            jogoEncerrado = true;
            alert(`Parabéns, ${nomeJogador}! Você ganhou o jogo do Bingo!`);
            break;
        }
    }
}