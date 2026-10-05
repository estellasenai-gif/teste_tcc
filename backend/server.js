// =====================================================
// CONFIGURAÇÃO DA API
// =====================================================

const API_BASE_URL = "http://localhost:3000";
const TOKEN_KEY = "educlass_token";


// =====================================================
// ESTADO DO SISTEMA
// =====================================================

let state = {

    user: null,

    turmas: [

        {
            id: 1,
            nome: "3º Ano A",
            disciplina: "Matemática",
            horario: "Terça / Quarta / Quinta - 07:00 às 12:20",

            alunos: [
                "Ana Beatriz Pereira dos Santos",
                "Ana Clara de Carvalho Nascimento",
                "Anna Luiza Gomes da Silva",
                "Aquiles Luiz Nunes Bastos",
                "Cainan Bastos da Silva",
                "Derick Luiz Caetano Miguel",
                "Estella de Almeida Rosa",
                "Francisco Gabriel de Oliveira Passos",
                "Gloria Maria Moura Bruno de Carvalho",
                "Heloisa Francisco Dionisio",
                "Henry Guimarães Alves",
                "Ingrid Rani Fortunato dos Santos",
                "João Gabriel da Silva Pereira",
                "João Pedro de Aquino Honorato",
                "João Pedro Martins Ligabo",
                "João Pedro Rodrigues dos Santos",
                "Juan Pedro de Miranda",
                "Julia de Moura Lopes da Silva",
                "Marcos Vinicius Soriano Guatura",
                "Maria Eduarda Felix Inocencio",
                "Maria Isabel da Silva Costa Borges",
                "Mariana de Souza Martins dos Santos",
                "Mariana Silva de Andrade",
                "Miguel Araujo de Godoi Freitas",
                "Nathalia Alves Abdo Rezende",
                "Neil Lopes João Filho",
                "Nicolas Felipe do Nascimento Rosa",
                "Pietro Henrique Gomes de Andrade",
                "Samuel Rodrigues Costa Freire",
                "Victor Hugo do Carmo de Jesus"
            ],

            media: 8.5,
            frequencia: 95

        },

        {
            id: 2,

            nome: "3º Ano B",

            disciplina: "Matemática",

            horario: "Segunda / Quinta / Sexta - 07:00 às 12:20",

            alunos: [
                "Ágatha Gerônimo de Souza",
                "Agatha Mytria Eugênio Galvão",
                "Alicia Souza Reis Fabiano",
                "Ana Clara da Silva Lopes",
                "Ana Clara da Silva Rosa",
                "Ana Clara Rodrigues",
                "Anna Beatriz Gonzaga Fialho",
                "Anna Carolina de Almeida",
                "Anna Livia Rachel dos Santos",
                "Bárbara Guatura Chagas",
                "Gabriel Ivanildo Araujo de Carvalho",
                "Gabriel Luiz Andrade de Oliveira",
                "Gabriela dos Santos Cardoso Alves",
                "José Luiz de Sousa Oliveira",
                "Julia Helena Diniz da Silva",
                "Jullia Bastos Ribeiro",
                "Kalel da Cunha Souza Fernandes",
                "Kauan da Silva Santos",
                "Luiz Guilherme de Alcantara Silva",
                "Maria Clara Dias Baesso",
                "Marianny Orfão Terra",
                "Melissa Espindola",
                "Miguel de Oliveira Rodrigues da Silva",
                "Murilo Gonçalves Parreiras Jannuzzelli",
                "Natalia Aquino de Almeida",
                "Nathan da Silva Santos",
                "Nicoly Souza Marioto",
                "Paola Diniz de Souza",
                "Rafael Massao de Oliveira",
                "Renata Ageu da Silva Cardoso",
                "Yago Andrade Molina",
                "Miguel da Silva Miranda Rodrigues"
            ],

            media: 7.2,
            frequencia: 90

        }

    ],

    avaliacoes: [

        {
            id: 1,
            turmaId: 1,
            titulo: "Prova Bimestral 1",
            data: "2026-10-05",
            peso: 10
        },

        {
            id: 2,
            turmaId: 2,
            titulo: "Trabalho em Grupo",
            data: "2026-10-12",
            peso: 5
        }

    ],

    chamadaStatus: {}

};


// =====================================================
// AUTENTICAÇÃO
// =====================================================

function obterToken() {

    return localStorage.getItem(TOKEN_KEY);

}


function salvarToken(token) {

    localStorage.setItem(TOKEN_KEY, token);

}


function removerToken() {

    localStorage.removeItem(TOKEN_KEY);

}


function toggleAuthMode() {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    if (!loginForm || !registerForm) return;

    loginForm.classList.toggle("hidden");

    registerForm.classList.toggle("hidden");

    limparMensagemAuth();

}


function mostrarMensagemAuth(
    mensagem,
    tipo = "erro"
) {

    const mensagemId =
        document
            .getElementById("registerForm")
            ?.classList.contains("hidden")
            ? "loginMessage"
            : "registerMessage";

    const elemento =
        document.getElementById(mensagemId);

    if (!elemento) {

        alert(mensagem);

        return;

    }

    elemento.textContent = mensagem;

    elemento.className =
        "mt-3 text-sm font-medium " +
        (
            tipo === "sucesso"
                ? "text-green-600"
                : "text-red-600"
        );

}


function limparMensagemAuth() {

    [
        "loginMessage",
        "registerMessage"
    ].forEach(id => {

        const elemento =
            document.getElementById(id);

        if (elemento) {

            elemento.textContent = "";

            elemento.className =
                "mt-3 text-sm font-medium";

        }

    });

}


function emailValido(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}


// =====================================================
// REQUISIÇÕES PARA O BACKEND
// =====================================================

async function fazerRequisicaoAPI(
    endpoint,
    opcoes = {}
) {

    const headers = {

        "Content-Type": "application/json",

        ...(opcoes.headers || {})

    };

    const token = obterToken();

    if (token) {

        headers.Authorization =
            `Bearer ${token}`;

    }

    const resposta =
        await fetch(
            `APIBASEURL{endpoint}`,
            {
                ...opcoes,
                headers
            }
        );

    let dados = {};

    try {

        dados = await resposta.json();

    } catch (erro) {

        dados = {};

    }

    if (!resposta.ok) {

        if (
            resposta.status === 401 &&
            endpoint !== "/api/auth/login"
        ) {

            removerToken();

        }

        throw new Error(
            dados.erro ||
            dados.mensagem ||
            "Não foi possível concluir a operação."
        );

    }

    return dados;

}


// =====================================================
// LOGIN / CADASTRO
// =====================================================

async function handleAuth(event, type) {

    event.preventDefault();

    limparMensagemAuth();

    const submitButton =
        event.submitter;

    if (submitButton) {

        submitButton.disabled = true;

        submitButton.dataset.textoOriginal =
            submitButton.innerHTML;

        submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Aguarde...';

    }

    try {

        // =================================================
        // LOGIN
        // =================================================

        if (type === "login") {

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim()
                    .toLowerCase();

            const senha =
                document
                    .getElementById("loginPassword")
                    .value;

            if (!emailValido(email)) {

                throw new Error(
                    "Digite um e-mail válido. Exemplo: professor@email.com"
                );

            }

            if (!senha) {

                throw new Error(
                    "Digite sua senha."
                );

            }

            const dados =
                await fazerRequisicaoAPI(
                    "/api/auth/login",
                    {
                        method: "POST",

                        body: JSON.stringify({

                            email,
                            senha

                        })

                    }
                );

            salvarToken(dados.token);

            state.user = {

                id: dados.usuario.id,

                name: dados.usuario.nome,

                email: dados.usuario.email

            };

            entrarNoSistema();

            return;

        }


        // =================================================
        // CADASTRO
        // =================================================

        const nome =
            document
                .getElementById("regName")
                .value
                .trim();

        const email =
            document
                .getElementById("regEmail")
                .value
                .trim()
                .toLowerCase();

        const senha =
            document
                .getElementById("regPassword")
                .value;


        if (nome.length < 3) {

            throw new Error(
                "Digite seu nome completo."
            );

        }


        if (!emailValido(email)) {

            throw new Error(
                "Digite um e-mail válido. Exemplo: professor@email.com"
            );

        }


        if (senha.length < 6) {

            throw new Error(
                "A senha deve possuir pelo menos 6 caracteres."
            );

        }


        const dados =
            await fazerRequisicaoAPI(
                "/api/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({

                        nome,
                        email,
                        senha

                    })

                }
            );


        const registerForm =
            document.getElementById(
                "registerForm"
            );

        if (registerForm) {

            registerForm.reset();

        }


        const loginForm =
            document.getElementById(
                "loginForm"
            );

        if (loginForm) {

            loginForm.classList.remove(
                "hidden"
            );

        }


        if (registerForm) {

            registerForm.classList.add(
                "hidden"
            );

        }


        const loginEmail =
            document.getElementById(
                "loginEmail"
            );

        if (loginEmail) {

            loginEmail.value = email;

        }


        const loginMessage =
            document.getElementById(
                "loginMessage"
            );

        if (loginMessage) {

            loginMessage.textContent =
                dados.mensagem ||
                "Conta criada com sucesso! Agora faça login.";

            loginMessage.className =
                "mt-3 text-sm font-medium text-green-600";

        } else {

            alert(
                dados.mensagem ||
                "Conta criada com sucesso! Agora faça login."
            );

        }


    } catch (erro) {

        console.error(
            "Erro na autenticação:",
            erro
        );

        mostrarMensagemAuth(
            erro.message ||
            "Erro ao realizar operação."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.innerHTML =
                submitButton.dataset.textoOriginal ||
                (
                    type === "login"
                        ? "Entrar no Sistema"
                        : "Criar Conta"
                );

        }

    }

}


// =====================================================
// ENTRAR NO SISTEMA
// =====================================================

function entrarNoSistema() {

    if (!state.user) return;

    const userName =
        document.getElementById(
            "userName"
        );

    const userEmail =
        document.getElementById(
            "userEmail"
        );

    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userName) {

        userName.textContent =
            state.user.name;

    }


    if (userEmail) {

        userEmail.textContent =
            state.user.email;

    }


    if (userAvatar) {

        userAvatar.textContent =
            state.user.name
                .charAt(0)
                .toUpperCase();

    }


    document
        .getElementById("authContainer")
        ?.classList.add("hidden");


    document
        .getElementById("appContainer")
        ?.classList.remove("hidden");


    atualizarSistema();

}


// =====================================================
// RESTAURAR SESSÃO
// =====================================================

async function restaurarSessao() {

    const token =
        obterToken();

    if (!token) return;

    try {

        const usuario =
            await fazerRequisicaoAPI(
                "/api/auth/me"
            );

        state.user = {

            id: usuario.id,

            name: usuario.nome,

            email: usuario.email

        };

        entrarNoSistema();

    } catch (erro) {

        removerToken();

        state.user = null;

    }

}


// =====================================================
// LOGOUT
// =====================================================

function logout() {

    removerToken();

    state.user = null;


    document
        .getElementById("appContainer")
        ?.classList.add("hidden");


    document
        .getElementById("authContainer")
        ?.classList.remove("hidden");


    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (loginForm) {

        loginForm.reset();

    }

    limparMensagemAuth();

}


// =====================================================
// INICIALIZAÇÃO
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        restaurarSessao();

    }
);


// ================= DARK MODE =================

function toggleDarkMode() {

    document.documentElement.classList.toggle(
        "dark"
    );

}


// ================= NAVEGAÇÃO =================

function switchTab(tab) {

    document
        .querySelectorAll(".tab-content")
        .forEach(section => {

            section.classList.add(
                "hidden"
            );

        });


    document
        .getElementById(
            "tab-" + tab
        )
        .classList.remove(
            "hidden"
        );


    document
        .querySelectorAll(".nav-btn")
        .forEach(button => {

            button.classList.remove(
                "text-blue-600",
                "bg-blue-50"
            );

            button.classList.add(
                "text-gray-600"
            );

        });


    const active =
        document.getElementById(
            "nav-" + tab
        );

    active.classList.add(
        "text-blue-600",
        "bg-blue-50"
    );

}


// ================= ATUALIZAÇÃO GERAL =================

function atualizarSistema() {

    atualizarDashboard();

    renderTurmas();

    popularSelectsTurma();

    carregarAlunosChamada();

    renderAvaliacoes();

    atualizarFiltroDesempenho();

    renderDesempenhoTurmas();

    renderDesempenhoFrequencia();

    renderResumoRelatorio();

    renderCalendario();

}


// ================= DASHBOARD =================

function atualizarDashboard() {

    document
        .getElementById(
            "dashTotalTurmas"
        )
        .textContent =
        state.turmas.length;


    const totalAlunos =
        state.turmas.reduce(
            (total, turma) =>
                total +
                turma.alunos.length,
            0
        );


    document
        .getElementById(
            "dashTotalAlunos"
        )
        .textContent =
        totalAlunos;


    const frequenciaMedia =
        state.turmas.length
            ? state.turmas.reduce(
                (total, turma) =>
                    total +
                    turma.frequencia,
                0
            ) /
            state.turmas.length
            : 0;


    document
        .getElementById(
            "dashMediaFreq"
        )
        .textContent =
        frequenciaMedia.toFixed(1) +
        "%";


    document
        .getElementById(
            "dashAvaliaPendente"
        )
        .textContent =
        state.avaliacoes.length;


    document
        .getElementById(
            "dashAgendaHoje"
        )
        .innerHTML =
        state.turmas
            .map(turma => `

                <div class="flex items-center justify-between
                            p-3 border rounded-xl">

                    <div>

                        <p class="font-bold text-sm">

                            ${turma.nome}
                            -
                            ${turma.disciplina}

                        </p>

                        <p class="text-xs text-gray-500">

                            ${turma.horario}

                        </p>

                    </div>

                    <span class="text-xs bg-gray-100
                                 dark:bg-gray-700 px-2 py-1 rounded-lg">

                        ${turma.alunos.length} alunos

                    </span>

                </div>

            `)
            .join("");

}


// ================= TURMAS =================

function renderTurmas() {

    const container =
        document.getElementById(
            "listaTurmas"
        );


    if (!container) return;


    container.innerHTML =
        state.turmas
            .map(turma => `

                <div class="bg-white dark:bg-gray-800
                            p-6 rounded-2xl shadow-sm
                            border dark:border-gray-700">

                    <div class="flex justify-between">

                        <div>

                            <span class="text-xs font-semibold
                                         px-2 py-1 rounded-lg
                                         bg-blue-100 text-blue-600">

                                ${turma.disciplina}

                            </span>

                            <h3 class="text-xl font-bold mt-2">

                                ${turma.nome}

                            </h3>

                        </div>

                        <button
                            onclick="removerTurma(${turma.id})"
                            class="text-red-500">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>


                    <p class="text-sm text-gray-500 mt-3">

                        <i class="fa-regular fa-clock mr-1"></i>

                        ${turma.horario}

                    </p>


                    <div class="mt-4 pt-4 border-t">

                        <p class="text-sm font-semibold">

                            ${turma.alunos.length} alunos

                        </p>

                        <p class="text-xs text-gray-500 mt-2">

                            Média:
                            <strong>
                                ${turma.media.toFixed(1)}
                            </strong>

                            • Frequência:
                            <strong>
                                ${turma.frequencia}%
                            </strong>

                        </p>

                    </div>

                </div>

            `)
            .join("");

}


// ================= SALVAR TURMA =================

function salvarTurma(event) {

    event.preventDefault();


    const novaTurma = {

        id: Date.now(),

        nome:
            document.getElementById(
                "nomeTurma"
            ).value,

        disciplina:
            document.getElementById(
                "disciplinaTurma"
            ).value,

        horario:
            document.getElementById(
                "horarioTurma"
            ).value,

        alunos: [

            "Aluno Exemplo 1",

            "Aluno Exemplo 2",

            "Aluno Exemplo 3"

        ],

        media: 0,

        frequencia: 100

    };


    state.turmas.push(
        novaTurma
    );


    atualizarSistema();

    closeModal(
        "modalTurma"
    );

    event.target.reset();

}


// ================= REMOVER TURMA =================

function removerTurma(id) {

    state.turmas =
        state.turmas.filter(
            turma =>
                turma.id !== id
        );


    state.avaliacoes =
        state.avaliacoes.filter(
            avaliacao =>
                avaliacao.turmaId !== id
        );


    atualizarSistema();

}


// ================= SELECTS =================

function popularSelectsTurma() {

    const options =
        state.turmas
            .map(turma => `

                <option value="${turma.id}">

                    ${turma.nome}
                    -
                    ${turma.disciplina}

                </option>

            `)
            .join("");


    const chamadaSelect =
        document.getElementById(
            "chamadaSelectTurma"
        );

    const avaliacoesSelect =
        document.getElementById(
            "avaliacoesSelectTurma"
        );

    const modalSelect =
        document.getElementById(
            "modalSelectTurma"
        );


    if (chamadaSelect) {

        chamadaSelect.innerHTML =
            options;

    }


    if (avaliacoesSelect) {

        avaliacoesSelect.innerHTML =
            options;

    }


    if (modalSelect) {

        modalSelect.innerHTML =
            options;

    }

}


// ================= CHAMADA =================

function carregarAlunosChamada() {

    const select =
        document.getElementById(
            "chamadaSelectTurma"
        );


    if (!select || !select.value) return;


    const turma =
        state.turmas.find(
            t =>
                t.id ===
                Number(select.value)
        );


    const tbody =
        document.getElementById(
            "tabelaChamada"
        );


    if (!tbody) return;


    if (!turma) {

        tbody.innerHTML = "";

        return;

    }


    tbody.innerHTML =
        turma.alunos
            .map(
                (aluno, index) => `

                <tr class="border-b dark:border-gray-700">

                    <td class="p-3">

                        ${index + 1}

                    </td>

                    <td class="p-3 font-medium">

                        ${aluno}

                    </td>

                    <td class="p-3 text-center">

                        <button
                            onclick="marcarPresenca(this, 'P')"
                            class="px-3 py-1 bg-green-500
                                   text-white rounded-lg mr-1">

                            P

                        </button>

                        <button
                            onclick="marcarPresenca(this, 'F')"
                            class="px-3 py-1 bg-gray-200
                                   rounded-lg mr-1">

                            F

                        </button>

                        <button
                            onclick="marcarPresenca(this, 'J')"
                            class="px-3 py-1 bg-gray-200
                                   rounded-lg">

                            J

                        </button>

                    </td>

                </tr>

            `
            )
            .join("");

}


// ================= MARCAR PRESENÇA =================

function marcarPresenca(
    button,
    status
) {

    const botoes =
        button.parentElement
            .querySelectorAll(
                "button"
            );


    botoes.forEach(botao => {

        botao.className =
            "px-3 py-1 bg-gray-200 rounded-lg mr-1";

    });


    if (status === "P") {

        button.className =
            "px-3 py-1 bg-green-500 text-white rounded-lg mr-1";

    }


    if (status === "F") {

        button.className =
            "px-3 py-1 bg-red-500 text-white rounded-lg mr-1";

    }


    if (status === "J") {

        button.className =
            "px-3 py-1 bg-amber-500 text-white rounded-lg mr-1";

    }

}


// ================= SALVAR CHAMADA =================

function salvarChamada() {

    alert(
        "Chamada salva com sucesso!"
    );

}


// ================= AVALIAÇÕES =================

function renderAvaliacoes() {

    const select =
        document.getElementById(
            "avaliacoesSelectTurma"
        );


    if (!select || !select.value) return;


    const turmaId =
        Number(select.value);


    const lista =
        state.avaliacoes.filter(
            avaliacao =>
                avaliacao.turmaId ===
                turmaId
        );


    const tbody =
        document.getElementById(
            "tabelaAvaliacoes"
        );


    if (!tbody) return;


    if (!lista.length) {

        tbody.innerHTML = `

            <tr>

                <td colspan="5"
                    class="p-6 text-center text-gray-400">

                    Nenhuma avaliação cadastrada.

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        lista
            .map(avaliacao => {

                const turma =
                    state.turmas.find(
                        t =>
                            t.id ===
                            avaliacao.turmaId
                    );


                return `

                    <tr class="border-b dark:border-gray-700">

                        <td class="p-4 font-semibold">

                            ${avaliacao.titulo}

                        </td>

                        <td class="p-4">

                            ${turma?.nome || ""}

                        </td>

                        <td class="p-4">

                            ${avaliacao.data}

                        </td>

                        <td class="p-4">

                            Peso ${avaliacao.peso}

                        </td>

                        <td class="p-4 text-right">

                            <button
                                onclick="removerAvaliacao(${avaliacao.id})"
                                class="text-red-500">

                                <i class="fa-solid fa-trash"></i>

                            </button>

                        </td>

                    </tr>

                `;

            })
            .join("");

}


// ================= SALVAR AVALIAÇÃO =================

function salvarAvaliacao(event) {

    event.preventDefault();


    const novaAvaliacao = {

        id: Date.now(),

        turmaId:
            Number(
                document.getElementById(
                    "avaliacoesSelectTurma"
                ).value
            ),

        titulo:
            document.getElementById(
                "tituloAvaliacao"
            ).value,

        data:
            document.getElementById(
                "dataAvaliacao"
            ).value,

        peso:
            Number(
                document.getElementById(
                    "pesoAvaliacao"
                ).value
            )

    };


    state.avaliacoes.push(
        novaAvaliacao
    );


    renderAvaliacoes();

    closeModal(
        "modalAvaliacao"
    );

    event.target.reset();

}


// ================= REMOVER AVALIAÇÃO =================

function removerAvaliacao(id) {

    state.avaliacoes =
        state.avaliacoes.filter(
            avaliacao =>
                avaliacao.id !== id
        );


    renderAvaliacoes();

}


// ================= FILTRO DE DESEMPENHO =================

function atualizarFiltroDesempenho() {

    const select =
        document.getElementById(
            "filtroDesempenho"
        );


    if (!select) return;


    select.innerHTML = `

        <option value="todas">
            Todas as turmas
        </option>

        ${state.turmas
            .map(turma => `

                <option value="${turma.id}">

                    ${turma.nome}

                </option>

            `)
            .join("")}

    `;

}


// ================= DESEMPENHO =================

function renderDesempenhoTurmas() {

    const container =
        document.getElementById(
            "desempenhoTurmas"
        );


    if (!container) return;


    let turmas =
        [...state.turmas];


    const filtro =
        document.getElementById(
            "filtroDesempenho"
        )?.value;


    if (
        filtro &&
        filtro !== "todas"
    ) {

        turmas =
            turmas.filter(
                turma =>
                    turma.id ===
                    Number(filtro)
            );

    }


    container.innerHTML =
        turmas
            .map(turma => {

                const media =
                    Number(
                        turma.media
                    ) || 0;


                const frequencia =
                    Number(
                        turma.frequencia
                    ) || 0;


                const quantidadeAvaliacoes =
                    state.avaliacoes.filter(
                        avaliacao =>
                            avaliacao.turmaId ===
                            turma.id
                    ).length;


                let situacao = {

                    texto: "Excelente",

                    classe:
                        "bg-green-100 text-green-700",

                    icone:
                        "fa-circle-check"

                };


                if (
                    media < 7 ||
                    frequencia < 75
                ) {

                    situacao = {

                        texto: "Atenção",

                        classe:
                            "bg-red-100 text-red-700",

                        icone:
                            "fa-triangle-exclamation"

                    };

                } else if (
                    media < 8 ||
                    frequencia < 85
                ) {

                    situacao = {

                        texto: "Acompanhar",

                        classe:
                            "bg-amber-100 text-amber-700",

                        icone:
                            "fa-clock"

                    };

                }


                return `

                    <div class="bg-white
                                dark:bg-gray-800
                                border
                                dark:border-gray-700
                                rounded-2xl
                                p-6">

                        <div class="flex
                                    flex-col
                                    md:flex-row
                                    md:items-center
                                    justify-between
                                    gap-4
                                    mb-5">

                            <div class="flex items-center gap-3">

                                <div class="w-12 h-12 rounded-xl
                                            bg-blue-100
                                            dark:bg-blue-900/30
                                            text-blue-600
                                            flex items-center justify-center">

                                    <i class="fa-solid fa-users text-xl"></i>

                                </div>

                                <div>

                                    <h4 class="text-lg font-bold">

                                        ${turma.nome}

                                    </h4>

                                    <p class="text-sm text-gray-500">

                                        ${turma.disciplina}

                                    </p>

                                </div>

                            </div>


                            <span class="px-3 py-1.5 rounded-lg
                                         text-xs font-bold
                                         ${situacao.classe}">

                                <i class="fa-solid
                                          ${situacao.icone} mr-1"></i>

                                ${situacao.texto}

                            </span>

                        </div>


                        <div class="grid
                                    grid-cols-2
                                    md:grid-cols-4
                                    gap-3
                                    mb-6">

                            <div class="bg-gray-50
                                        dark:bg-gray-700/40
                                        p-4 rounded-xl">

                                <p class="text-xs text-gray-500">

                                    Média

                                </p>

                                <p class="text-2xl font-bold
                                          text-blue-600">

                                    ${media.toFixed(1)}

                                </p>

                            </div>


                            <div class="bg-gray-50
                                        dark:bg-gray-700/40
                                        p-4 rounded-xl">

                                <p class="text-xs text-gray-500">

                                    Frequência

                                </p>

                                <p class="text-2xl font-bold
                                          text-green-600">

                                    ${frequencia}%

                                </p>

                            </div>


                            <div class="bg-gray-50
                                        dark:bg-gray-700/40
                                        p-4 rounded-xl">

                                <p class="text-xs text-gray-500">

                                    Alunos

                                </p>

                                <p class="text-2xl font-bold">

                                    ${turma.alunos.length}

                                </p>

                            </div>


                            <div class="bg-gray-50
                                        dark:bg-gray-700/40
                                        p-4 rounded-xl">

                                <p class="text-xs text-gray-500">

                                    Avaliações

                                </p>

                                <p class="text-2xl font-bold">

                                    ${quantidadeAvaliacoes}

                                </p>

                            </div>

                        </div>


                        <div class="mb-5">

                            <div class="flex
                                        justify-between
                                        text-sm
                                        font-semibold
                                        mb-2">

                                <span>

                                    Média da turma

                                </span>

                                <span>

                                    ${media.toFixed(1)} / 10

                                </span>

                            </div>


                            <div class="w-full
                                        h-3
                                        bg-gray-200
                                        dark:bg-gray-700
                                        rounded-full
                                        overflow-hidden">

                                <div
                                    class="h-full
                                           bg-blue-600
                                           rounded-full
                                           transition-all"

                                    style="width:${media * 10}%">

                                </div>

                            </div>

                        </div>


                        <div>

                            <div class="flex
                                        justify-between
                                        text-sm
                                        font-semibold
                                        mb-2">

                                <span>

                                    Frequência

                                </span>

                                <span>

                                    ${frequencia}%

                                </span>

                            </div>


                            <div class="w-full
                                        h-3
                                        bg-gray-200
                                        dark:bg-gray-700
                                        rounded-full
                                        overflow-hidden">

                                <div
                                    class="h-full
                                           bg-green-500
                                           rounded-full
                                           transition-all"

                                    style="width:${frequencia}%">

                                </div>

                            </div>

                        </div>

                    </div>

                `;

            })
            .join("");

}


// ================= FREQUÊNCIA =================

function renderDesempenhoFrequencia() {

    const container =
        document.getElementById(
            "desempenhoFrequencia"
        );


    if (!container) return;


    container.innerHTML =
        state.turmas
            .map(turma => {

                const frequencia =
                    Number(
                        turma.frequencia
                    ) || 0;


                let barra =
                    "bg-green-500";

                let texto =
                    "text-green-600";


                if (frequencia < 75) {

                    barra =
                        "bg-red-500";

                    texto =
                        "text-red-600";

                } else if (
                    frequencia < 85
                ) {

                    barra =
                        "bg-amber-500";

                    texto =
                        "text-amber-600";

                }


                return `

                    <div>

                        <div class="flex
                                    justify-between
                                    text-sm
                                    font-semibold
                                    mb-2">

                            <span>

                                ${turma.nome}

                            </span>

                            <span class="${texto}">

                                ${frequencia}%

                            </span>

                        </div>


                        <div class="w-full
                                    h-3
                                    bg-gray-200
                                    dark:bg-gray-700
                                    rounded-full
                                    overflow-hidden">

                            <div
                                class="${barra}
                                       h-full
                                       rounded-full"

                                style="width:${frequencia}%">

                            </div>

                        </div>


                        <p class="text-xs
                                  text-gray-400
                                  mt-1">

                            ${turma.alunos.length}
                            alunos matriculados

                        </p>

                    </div>

                `;

            })
            .join("");

}


// ================= RESUMO =================

function renderResumoRelatorio() {

    if (!state.turmas.length) return;


    const media =
        state.turmas.reduce(
            (total, turma) =>
                total +
                Number(
                    turma.media || 0
                ),
            0
        ) /
        state.turmas.length;


    const frequencia =
        state.turmas.reduce(
            (total, turma) =>
                total +
                Number(
                    turma.frequencia || 0
                ),
            0
        ) /
        state.turmas.length;


    const alunos =
        state.turmas.reduce(
            (total, turma) =>
                total +
                turma.alunos.length,
            0
        );


    const mediaElemento =
        document.getElementById(
            "relatorioMediaGeral"
        );

    const frequenciaElemento =
        document.getElementById(
            "relatorioFrequenciaGeral"
        );

    const alunosElemento =
        document.getElementById(
            "relatorioTotalAlunos"
        );


    if (mediaElemento) {

        mediaElemento.textContent =
            media.toFixed(1);

    }


    if (frequenciaElemento) {

        frequenciaElemento.textContent =
            frequencia.toFixed(1) +
            "%";

    }


    if (alunosElemento) {

        alunosElemento.textContent =
            alunos;

    }

}


// ================= CALENDÁRIO =================

function renderCalendario() {

    const grid =
        document.getElementById(
            "gradeCalendario"
        );


    if (!grid) return;


    let html = "";


    for (
        let dia = 1;
        dia <= 31;
        dia++
    ) {

        html += `

            <div class="h-20
                        border
                        dark:border-gray-700
                        rounded-xl
                        p-2">

                <span class="text-sm font-semibold">

                    ${dia}

                </span>


                ${
                    dia === 15
                        ? `

                            <span class="block
                                         mt-2
                                         text-xs
                                         bg-red-100
                                         text-red-600
                                         p-1
                                         rounded">

                                Feriado

                            </span>

                        `
                        : ""
                }

            </div>

        `;

    }


    grid.innerHTML =
        html;

}


// ================= MODAIS =================

function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.remove(
        "hidden"
    );

    modal.classList.add(
        "flex"
    );

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add(
        "hidden"
    );

    modal.classList.remove(
        "flex"
    );

}


// =====================================================
// INICIALIZAÇÃO FINAL
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const data =
            document.getElementById(
                "chamadaData"
            );


        if (data) {

            data.value =
                new Date()
                    .toISOString()
                    .split("T")[0];

        }

    }
);