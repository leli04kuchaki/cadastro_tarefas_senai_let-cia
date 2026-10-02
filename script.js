const campoTarefa = document.getElementById("campo-tarefa");
const horaInicio = document.getElementById("hora-inicio");
const horaFim = document.getElementById("hora-fim");
const botaoAdicionar = document.getElementById("botao-adicionar");
const listaTarefas = document.getElementById("lista-tarefas");
const contadorTarefas = document.getElementById("contador-tarefas");
const botaoTema = document.getElementById("botao-tema");

const botaoTodas = document.getElementById("botao-todas");
const botaoFavoritas = document.getElementById("botao-favoritas");
const botaoPendentes = document.getElementById("botao-pendentes");
const botaoConcluidas = document.getElementById("botao-concluidas");
const botaoLimparConcluidas = document.getElementById("botao-limpar-concluidas");

// Carrega as tarefas salvas do localStorage
let tarefas = JSON.parse(localStorage.getItem("minhas_tarefas")) || [];
let filtroAtual = "todas";

function salvarNoLocalStorage() {
    localStorage.setItem("minhas_tarefas", JSON.stringify(tarefas));
}

function adicionarTarefa() {
    const texto = campoTarefa.value.trim();

    if (texto === "") {
        return;
    }

    const tarefa = {
        id: Date.now(),
        texto: texto,
        inicio: horaInicio.value || null,
        fim: horaFim.value || null,
        favorita: false,
        concluida: false
    };

    tarefas.push(tarefa);
    salvarNoLocalStorage();

    // Limpa os campos
    campoTarefa.value = "";
    horaInicio.value = "";
    horaFim.value = "";

    mostrarTarefas();
}

function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    // Ordena: tarefas favoritas aparecem primeiro no topo
    let tarefasOrdenadas = [...tarefas].sort((a, b) => (b.favorita ? 1 : 0) - (a.favorita ? 1 : 0));

    let tarefasFiltradas = tarefasOrdenadas;

    if (filtroAtual === "favoritas") {
        tarefasFiltradas = tarefasOrdenadas.filter(t => t.favorita);
    } else if (filtroAtual === "pendentes") {
        tarefasFiltradas = tarefasOrdenadas.filter(t => !t.concluida);
    } else if (filtroAtual === "concluidas") {
        tarefasFiltradas = tarefasOrdenadas.filter(t => t.concluida);
    }

    tarefasFiltradas.forEach(function(tarefa) {
        const item = document.createElement("li");
        item.classList.add("item-tarefa");

        if (tarefa.concluida) item.classList.add("concluida");
        if (tarefa.favorita) item.classList.add("favorita");

        // Monta o texto dos horários caso tenham sido informados
        let textoHorario = "";
        if (tarefa.inicio || tarefa.fim) {
            const inicio = tarefa.inicio ? `${tarefa.inicio}` : "--:--";
            const fim = tarefa.fim ? `${tarefa.fim}` : "--:--";
            textoHorario = `<div class="horario-tag"><i class="fa-regular fa-clock"></i> ${inicio} - ${fim}</div>`;
        }

        item.innerHTML = `
            <div class="conteudo-tarefa">
                <span>${tarefa.texto}</span>
                ${textoHorario}
            </div>

            <div class="acoes-tarefa">
                <button
                    class="botao-acao ${tarefa.favorita ? 'favorito-ativo' : ''}"
                    onclick="favoritarTarefa(${tarefa.id})"
                    title="${tarefa.favorita ? 'Remover dos favoritos' : 'Favoritar'}"
                >
                    <i class="${tarefa.favorita ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>

                <button
                    class="botao-acao"
                    onclick="concluirTarefa(${tarefa.id})"
                    title="${tarefa.concluida ? 'Desmarcar' : 'Concluir'}"
                >
                    <i class="fa-solid ${tarefa.concluida ? 'fa-rotate-left' : 'fa-check'}"></i>
                </button>

                <button
                    class="botao-acao excluir"
                    onclick="excluirTarefa(${tarefa.id})"
                    title="Excluir tarefa"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        listaTarefas.appendChild(item);
    });

    atualizarContador();
    atualizarBotoesFiltro();
}

function favoritarTarefa(id) {
    tarefas = tarefas.map(function(tarefa) {
        if (tarefa.id === id) {
            tarefa.favorita = !tarefa.favorita;
        }
        return tarefa;
    });

    salvarNoLocalStorage();
    mostrarTarefas();
}

function concluirTarefa(id) {
    tarefas = tarefas.map(function(tarefa) {
        if (tarefa.id === id) {
            tarefa.concluida = !tarefa.concluida;
        }
        return tarefa;
    });

    salvarNoLocalStorage();
    mostrarTarefas();
}

function excluirTarefa(id) {
    tarefas = tarefas.filter(function(tarefa) {
        return tarefa.id !== id;
    });

    salvarNoLocalStorage();
    mostrarTarefas();
}

function atualizarContador() {
    const quantidade = tarefas.length;

    if (quantidade === 0) {
        contadorTarefas.textContent = "0 tarefas na lista";
    } else if (quantidade === 1) {
        contadorTarefas.textContent = "1 tarefa na lista";
    } else {
        contadorTarefas.textContent = `${quantidade} tarefas na lista`;
    }
}

function atualizarBotoesFiltro() {
    [botaoTodas, botaoFavoritas, botaoPendentes, botaoConcluidas].forEach(btn => btn.classList.remove("ativo"));

    if (filtroAtual === "todas") botaoTodas.classList.add("ativo");
    if (filtroAtual === "favoritas") botaoFavoritas.classList.add("ativo");
    if (filtroAtual === "pendentes") botaoPendentes.classList.add("ativo");
    if (filtroAtual === "concluidas") botaoConcluidas.classList.add("ativo");
}

// Event Listeners
botaoAdicionar.addEventListener("click", adicionarTarefa);

campoTarefa.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        adicionarTarefa();
    }
});

botaoTema.addEventListener("click", function() {
    document.body.classList.toggle("modo-escuro");
    const icone = botaoTema.querySelector("i");

    if (document.body.classList.contains("modo-escuro")) {
        icone.classList.remove("fa-moon");
        icone.classList.add("fa-sun");
    } else {
        icone.classList.remove("fa-sun");
        icone.classList.add("fa-moon");
    }
});

botaoTodas.addEventListener("click", function() {
    filtroAtual = "todas";
    mostrarTarefas();
});

botaoFavoritas.addEventListener("click", function() {
    filtroAtual = "favoritas";
    mostrarTarefas();
});

botaoPendentes.addEventListener("click", function() {
    filtroAtual = "pendentes";
    mostrarTarefas();
});

botaoConcluidas.addEventListener("click", function() {
    filtroAtual = "concluidas";
    mostrarTarefas();
});

botaoLimparConcluidas.addEventListener("click", function() {
    tarefas = tarefas.filter(function(tarefa) {
        return tarefa.concluida === false;
    });

    salvarNoLocalStorage();
    mostrarTarefas();
});

// Renderização inicial
mostrarTarefas();
