/* =========================================================
   DADOS INICIAIS
========================================================= */

const defaultData = {

    user: {

        name: "",

        email: "",

        password: "",

        subject: "Professor",

        phone: "",

        city: "",

        bio: ""

    },


    classes: [

        {
            id: 1,
            name: "9º Ano A",
            subject: "Matemática",
            students: 28,
            room: "Sala 04",
            schedule: "Segunda e quarta • 08:00"
        },

        {
            id: 2,
            name: "8º Ano B",
            subject: "Matemática",
            students: 25,
            room: "Sala 07",
            schedule: "Terça e quinta • 10:00"
        },

        {
            id: 3,
            name: "7º Ano A",
            subject: "Matemática",
            students: 30,
            room: "Sala 03",
            schedule: "Quarta e sexta • 13:30"
        }

    ],


    evaluations: [

        {
            name: "Prova de Frações",
            className: "9º Ano A",
            date: "2026-04-15",
            max: 10
        },

        {
            name: "Atividade de Geometria",
            className: "8º Ano B",
            date: "2026-04-17",
            max: 10
        }

    ],


    events: [

        {
            title: "Prova de Matemática",
            date: "2026-04-15",
            time: "08:00 - 09:40"
        },

        {
            title: "Reunião Pedagógica",
            date: "2026-04-17",
            time: "14:00 - 15:30"
        },

        {
            title: "Entrega de trabalhos",
            date: "2026-04-27",
            time: "23:59"
        }

    ]

};



/* =========================================================
   CARREGAR DADOS
========================================================= */

let data =
    JSON.parse(
        localStorage.getItem(
            "eduOrganizaData"
        )
    ) || defaultData;



let currentPage =
    "dashboard";



let calendarDate =
    new Date(
        2026,
        3,
        1
    );



/* =========================================================
   INICIALIZAÇÃO
========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                document
                    .getElementById("splash")
                    .classList.add("hidden");


                const logged =
                    localStorage.getItem(
                        "eduOrganizaLogged"
                    );


                if (
                    logged === "true" &&
                    data.user.email
                ) {

                    showApp();

                } else {

                    showAuth();

                }

            },
            1200
        );


        setupNavigation();

        renderAll();

    }
);



/* =========================================================
   SALVAR DADOS
========================================================= */

function saveData() {

    localStorage.setItem(
        "eduOrganizaData",
        JSON.stringify(data)
    );

}



/* =========================================================
   LOGIN / CADASTRO
========================================================= */

function showAuth() {

    document
        .getElementById("auth")
        .classList.remove("hidden");


    document
        .getElementById("app")
        .classList.add("hidden");

}



function showApp() {

    document
        .getElementById("auth")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    updateUserUI();


    navigate(
        "dashboard"
    );

}



/* =========================================================
   MOSTRAR LOGIN
========================================================= */

function showLogin() {

    document
        .getElementById("login-form")
        .classList.remove("hidden");


    document
        .getElementById("register-form")
        .classList.add("hidden");

}



/* =========================================================
   MOSTRAR CADASTRO
========================================================= */

function showRegister() {

    document
        .getElementById("login-form")
        .classList.add("hidden");


    document
        .getElementById("register-form")
        .classList.remove("hidden");

}



/* =========================================================
   CADASTRAR PROFESSOR
========================================================= */

function register() {


    const name =
        document
            .getElementById(
                "register-name"
            )
            .value
            .trim();


    const email =
        document
            .getElementById(
                "register-email"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "register-password"
            )
            .value;



    if (
        !name ||
        !email ||
        !password
    ) {

        showToast(
            "Preencha todos os campos."
        );

        return;
    }



    data.user.name =
        name;


    data.user.email =
        email;


    data.user.password =
        password;



    saveData();



    localStorage.setItem(
        "eduClassLogged",
        "true"
    );



    updateUserUI();



    showToast(
        `Conta criada! Bem-vindo(a), ${name}!`
    );



    setTimeout(
        () => {

            showApp();

        },
        500
    );

}



/* =========================================================
   LOGIN
========================================================= */

function login() {


    const email =
        document
            .getElementById(
                "login-email"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "login-password"
            )
            .value;



    if (
        !email ||
        !password
    ) {

        showToast(
            "Informe seu e-mail e senha."
        );

        return;
    }



    if (
        !data.user.email
    ) {

        showToast(
            "Nenhuma conta cadastrada. Crie sua conta primeiro."
        );

        return;
    }



    if (
        email !==
        data.user.email
    ) {

        showToast(
            "E-mail incorreto."
        );

        return;
    }



    if (
        password !==
        data.user.password
    ) {

        showToast(
            "Senha incorreta."
        );

        return;
    }



    localStorage.setItem(
        "eduClassLogged",
        "true"
    );



    /*
       Atualiza nome, avatar e perfil
       antes de abrir o sistema.
    */

    updateUserUI();



    showToast(
        `Bem-vindo(a), ${data.user.name}!`
    );



    setTimeout(
        () => {

            showApp();

        },
        400
    );

}



/* =========================================================
   LOGOUT
========================================================= */

function logout() {


    localStorage.removeItem(
        "eduClassLogged"
    );


    document
        .getElementById("app")
        .classList.add("hidden");


    showAuth();


    showLogin();

}



/* =========================================================
   NAVEGAÇÃO
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(".nav-item")
        .forEach(
            item => {

                item.addEventListener(
                    "click",
                    () => {

                        navigate(
                            item.dataset.page
                        );


                        closeSidebar();

                    }
                );

            }
        );

}



function navigate(page) {

    currentPage =
        page;



    document
        .querySelectorAll(
            ".content-section"
        )
        .forEach(
            section => {

                section.classList.remove(
                    "active"
                );

            }
        );



    const target =
        document.getElementById(
            page
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }



    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.page === page
                );

            }
        );



    const titles = {

        dashboard: [
            `Olá, ${data.user.name || "Professor"}!`,
            "Aqui está um resumo da sua rotina."
        ],

        classes: [
            "Minhas turmas",
            "Gerencie suas turmas e alunos."
        ],

        attendance: [
            "Chamada",
            "Registre a presença das suas turmas."
        ],

        evaluations: [
            "Avaliações",
            "Organize provas e atividades."
        ],

        calendar: [
            "Calendário",
            "Planeje seus compromissos e aulas."
        ],

        reports: [
            "Relatórios",
            "Acompanhe o desempenho das suas turmas."
        ],

        profile: [
            "Meu perfil",
            "Suas informações profissionais."
        ]

    };



    if (
        titles[page]
    ) {

        document
            .getElementById(
                "page-title"
            )
            .textContent =
            titles[page][0];


        document
            .getElementById(
                "page-subtitle"
            )
            .textContent =
            titles[page][1];

    }



    renderAll();

}



/* =========================================================
   MENU MOBILE
========================================================= */

function toggleSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.toggle(
            "open"
        );

}



function closeSidebar() {

    document
        .getElementById(
            "sidebar"
        )
        .classList.remove(
            "open"
        );

}



/* =========================================================
   ATUALIZAR TODA A INTERFACE DO PROFESSOR
========================================================= */

function updateUserUI() {


    /*
       PEGA SEMPRE O NOME ATUAL SALVO.

       Se o professor mudar o nome,
       data.user.name muda e essa função
       atualiza todos os lugares.
    */

    const name =
        data.user.name?.trim()
        || "Professor";



    /*
       Pega somente a primeira letra.
    */

    const initial =
        name
            .charAt(0)
            .toUpperCase();



    /* ==========================================
       NOME NO TOPO
    ========================================== */

    const userName =
        document.getElementById(
            "user-name"
        );


    if (userName) {

        userName.textContent =
            name;

    }



    /* ==========================================
       AVATAR DO TOPO
    ========================================== */

    const userAvatar =
        document.getElementById(
            "user-avatar"
        );


    if (userAvatar) {

        userAvatar.textContent =
            initial;

    }



    /* ==========================================
       NOME DO PERFIL
    ========================================== */

    const profileName =
        document.getElementById(
            "profile-name"
        );


    if (profileName) {

        profileName.textContent =
            name;

    }



    /* ==========================================
       AVATAR DO PERFIL
    ========================================== */

    const profileAvatar =
        document.getElementById(
            "profile-avatar"
        );


    if (profileAvatar) {

        profileAvatar.textContent =
            initial;

    }



    /* ==========================================
       DISCIPLINA DO PERFIL
    ========================================== */

    const profileSubject =
        document.getElementById(
            "profile-subject"
        );


    if (profileSubject) {

        profileSubject.textContent =
            data.user.subject?.trim()
            || "Professor";

    }



    /* ==========================================
       TÍTULO DO DASHBOARD
    ========================================== */

    const pageTitle =
        document.getElementById(
            "page-title"
        );


    if (
        pageTitle &&
        currentPage === "dashboard"
    ) {

        pageTitle.textContent =
            `Olá, ${name}!`;

    }



    /* ==========================================
       DADOS DETALHADOS DO PERFIL
    ========================================== */

    const profileDetails =
        document.getElementById(
            "profile-details"
        );


    if (
        profileDetails
    ) {

        profileDetails.innerHTML = `

            <div
                style="
                    display:grid;
                    grid-template-columns:
                        1fr 1fr;
                    gap:18px;
                "
            >

                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        Nome
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        ${escapeHTML(name)}
                    </p>

                </div>


                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        E-mail
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        ${
                            escapeHTML(
                                data.user.email
                                ||
                                "Não informado"
                            )
                        }
                    </p>

                </div>


                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        Disciplina
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        ${
                            escapeHTML(
                                data.user.subject
                                ||
                                "Não informado"
                            )
                        }
                    </p>

                </div>


                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        Telefone
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        ${
                            escapeHTML(
                                data.user.phone
                                ||
                                "Não informado"
                            )
                        }
                    </p>

                </div>


                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        Cidade
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        ${
                            escapeHTML(
                                data.user.city
                                ||
                                "Não informado"
                            )
                        }
                    </p>

                </div>


                <div>

                    <small
                        style="
                            color:var(--muted)
                        "
                    >
                        Perfil
                    </small>

                    <p
                        style="
                            margin-top:5px
                        "
                    >
                        Professor
                    </p>

                </div>

            </div>


            <div
                style="
                    margin-top:25px;
                    padding:15px;
                    border-radius:10px;
                    background:
                        var(--surface-2);
                "
            >

                <small
                    style="
                        color:var(--muted)
                    "
                >
                    Sobre você
                </small>


                <p
                    style="
                        margin-top:7px;
                        line-height:1.6;
                        font-size:13px;
                    "
                >
                    ${
                        escapeHTML(
                            data.user.bio
                            ||
                            "Adicione uma breve descrição sobre você."
                        )
                    }
                </p>

            </div>

        `;

    }

}



/* =========================================================
   TURMAS
========================================================= */

function renderClasses() {


    const container =
        document.getElementById(
            "class-grid"
        );


    if (!container) {
        return;
    }



    if (
        !data.classes.length
    ) {

        container.innerHTML = `

            <div class="card">

                Nenhuma turma cadastrada.

            </div>

        `;

        return;
    }



    container.innerHTML =
        data.classes
            .map(
                (c, index) => `

                    <div
                        class="class-card"
                    >

                        <div
                            class="class-card-top"
                        >

                            <div
                                class="class-color"
                            >
                                ${index + 1}
                            </div>


                            <button
                                class="text-btn"
                                onclick="deleteClass(${c.id})"
                            >
                                Excluir
                            </button>

                        </div>


                        <h3>
                            ${escapeHTML(c.name)}
                        </h3>


                        <p>
                            ${escapeHTML(c.subject)}
                        </p>


                        <p>
                            ${escapeHTML(c.room)}
                        </p>


                        <div
                            class="class-footer"
                        >

                            <span>
                                👥
                                ${c.students}
                                alunos
                            </span>


                            <span>
                                ${escapeHTML(c.schedule)}
                            </span>

                        </div>

                    </div>

                `
            )
            .join("");

}



/* =========================================================
   MODAL NOVA TURMA
========================================================= */

function openClassModal() {


    openModal(`

        <div
            class="modal-header"
        >

            <div>

                <h2>
                    Nova turma
                </h2>

                <p
                    style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:4px;
                    "
                >
                    Cadastre uma turma para organizar suas aulas.
                </p>

            </div>


            <button
                class="close-modal"
                onclick="closeModal()"
            >
                ×
            </button>

        </div>


        <div class="form-group">

            <label>
                Nome da turma
            </label>

            <input
                id="class-name"
                class="input"
                placeholder="Ex.: 9º Ano A"
            >

        </div>


        <div class="form-group">

            <label>
                Disciplina
            </label>

            <input
                id="class-subject"
                class="input"
                placeholder="Ex.: Matemática"
            >

        </div>


        <div class="form-group">

            <label>
                Número de alunos
            </label>

            <input
                id="class-students"
                class="input"
                type="number"
                min="1"
                value="25"
            >

        </div>


        <div class="form-group">

            <label>
                Sala / local
            </label>

            <input
                id="class-room"
                class="input"
                placeholder="Ex.: Sala 04"
            >

        </div>


        <div class="form-group">

            <label>
                Horário
            </label>

            <input
                id="class-schedule"
                class="input"
                placeholder="Ex.: Segunda e quarta • 08:00"
            >

        </div>


        <button
            class="primary-btn"
            onclick="saveClass()"
        >
            Criar turma
        </button>

    `);

}



/* =========================================================
   SALVAR TURMA
========================================================= */

function saveClass() {


    const name =
        document
            .getElementById(
                "class-name"
            )
            .value
            .trim();


    const subject =
        document
            .getElementById(
                "class-subject"
            )
            .value
            .trim();


    const students =
        Number(
            document
                .getElementById(
                    "class-students"
                )
                .value
        );


    const room =
        document
            .getElementById(
                "class-room"
            )
            .value
            .trim();


    const schedule =
        document
            .getElementById(
                "class-schedule"
            )
            .value
            .trim();



    if (
        !name ||
        !subject
    ) {

        showToast(
            "Informe o nome e a disciplina."
        );

        return;
    }



    data.classes.push({

        id: Date.now(),

        name,

        subject,

        students:
            students || 0,

        room:
            room ||
            "Não informado",

        schedule:
            schedule ||
            "Horário não definido"

    });



    saveData();


    closeModal();


    renderAll();


    showToast(
        "Turma cadastrada!"
    );

}



/* =========================================================
   EXCLUIR TURMA
========================================================= */

function deleteClass(id) {


    if (
        !confirm(
            "Deseja realmente excluir esta turma?"
        )
    ) {

        return;

    }



    data.classes =
        data.classes.filter(
            c => c.id !== id
        );


    saveData();


    renderAll();


    showToast(
        "Turma removida."
    );

}



/* =========================================================
   CHAMADA
========================================================= */

function renderAttendance() {


    const select =
        document.getElementById(
            "attendance-class"
        );


    if (!select) {
        return;
    }



    if (
        !data.classes.length
    ) {

        select.innerHTML =
            `<option>
                Nenhuma turma
            </option>`;

        return;

    }



    select.innerHTML =
        data.classes
            .map(
                c => `

                    <option
                        value="${c.id}"
                    >
                        ${escapeHTML(c.name)}
                    </option>

                `
            )
            .join("");



    const classId =
        Number(
            select.value
        );


    const selected =
        data.classes.find(
            c => c.id === classId
        );


    if (!selected) {
        return;
    }



    const students =
        generateStudents(
            selected.students
        );



    document
        .getElementById(
            "attendance-table"
        )
        .innerHTML = `

            <table>

                <thead>

                    <tr>

                        <th>
                            Aluno
                        </th>

                        <th>
                            Situação
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${

                        students
                            .map(
                                (name, i) => `

                                    <tr>

                                        <td>

                                            <div
                                                class="student"
                                            >

                                                <div
                                                    class="student-avatar"
                                                >
                                                    ${i + 1}
                                                </div>

                                                ${name}

                                            </div>

                                        </td>


                                        <td>

                                            <select
                                                class="attendance-select"
                                            >

                                                <option>
                                                    Presente
                                                </option>

                                                <option>
                                                    Falta
                                                </option>

                                                <option>
                                                    Justificada
                                                </option>

                                            </select>

                                        </td>

                                    </tr>

                                `
                            )
                            .join("")

                    }

                </tbody>

            </table>

        `;

}



/* =========================================================
   GERAR ALUNOS DE EXEMPLO
========================================================= */

function generateStudents(
    count
) {


    const names = [

        "Ana",
        "Bruno",
        "Carlos",
        "Daniela",
        "Eduardo",
        "Fernanda",
        "Gabriel",
        "Helena",
        "Isabela",
        "João",
        "Karina",
        "Lucas",
        "Mariana",
        "Nicolas",
        "Olivia",
        "Pedro",
        "Rafael",
        "Sofia",
        "Thiago",
        "Valentina",
        "victor"

    ];



    const result = [];



    for (
        let i = 0;
        i < count;
        i++
    ) {

        result.push(

            names[
                i % names.length
            ]
            +
            " "
            +
            String.fromCharCode(
                65 + (i % 26)
            )
            +
            "."

        );

    }



    return result;

}



/* =========================================================
   SALVAR CHAMADA
========================================================= */

function saveAttendance() {

    showToast(
        "Chamada salva com sucesso!"
    );

}



/* =========================================================
   AVALIAÇÕES
========================================================= */

function renderEvaluations() {


    const list =
        document.getElementById(
            "evaluation-list"
        );


    if (!list) {
        return;
    }



    if (
        !data.evaluations.length
    ) {

        list.innerHTML = `

            <tr>

                <td colspan="5">
                    Nenhuma avaliação cadastrada.
                </td>

            </tr>

        `;

        return;

    }



    list.innerHTML =
        data.evaluations
            .map(
                e => `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(e.name)}
                            </strong>

                        </td>


                        <td>
                            ${escapeHTML(e.className)}
                        </td>


                        <td>
                            ${formatDate(e.date)}
                        </td>


                        <td>
                            ${e.max}
                        </td>


                        <td>

                            <span
                                class="badge purple"
                            >
                                Planejada
                            </span>

                        </td>

                    </tr>

                `
            )
            .join("");

}



/* =========================================================
   MODAL AVALIAÇÃO
========================================================= */

function openEvaluationModal() {


    const options =
        data.classes
            .map(
                c => `

                    <option>
                        ${escapeHTML(c.name)}
                    </option>

                `
            )
            .join("");



    openModal(`

        <div
            class="modal-header"
        >

            <div>

                <h2>
                    Nova avaliação
                </h2>

                <p
                    style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:4px;
                    "
                >
                    Cadastre uma prova ou atividade.
                </p>

            </div>


            <button
                class="close-modal"
                onclick="closeModal()"
            >
                ×
            </button>

        </div>


        <div class="form-group">

            <label>
                Nome da atividade
            </label>

            <input
                id="evaluation-name"
                class="input"
                placeholder="Ex.: Prova de Frações"
            >

        </div>


        <div class="form-group">

            <label>
                Turma
            </label>

            <select
                id="evaluation-class"
                class="input"
            >

                ${options}

            </select>

        </div>


        <div class="form-group">

            <label>
                Data
            </label>

            <input
                id="evaluation-date"
                class="input"
                type="date"
            >

        </div>


        <div class="form-group">

            <label>
                Nota máxima
            </label>

            <input
                id="evaluation-max"
                class="input"
                type="number"
                value="10"
            >

        </div>


        <div class="form-group">

            <label>
                Descrição
            </label>

            <textarea
                id="evaluation-description"
                class="input"
                placeholder="Conteúdos ou observações..."
            ></textarea>

        </div>


        <button
            class="primary-btn"
            onclick="saveEvaluation()"
        >
            Salvar avaliação
        </button>


        <button
            class="outline-btn"
            style="margin-top:10px"
            onclick="generateActivitySuggestion()"
        >
            ✨ Gerar sugestão de atividade (IA)
        </button>

    `);

}



/* =========================================================
   SALVAR AVALIAÇÃO
========================================================= */

function saveEvaluation() {


    const name =
        document
            .getElementById(
                "evaluation-name"
            )
            .value
            .trim();


    const className =
        document
            .getElementById(
                "evaluation-class"
            )
            .value;


    const date =
        document
            .getElementById(
                "evaluation-date"
            )
            .value;


    const max =
        document
            .getElementById(
                "evaluation-max"
            )
            .value;



    if (
        !name ||
        !date
    ) {

        showToast(
            "Preencha nome e data."
        );

        return;
    }



    data.evaluations.push({

        name,

        className,

        date,

        max:
            Number(max) || 10

    });



    saveData();


    closeModal();


    renderAll();


    showToast(
        "Avaliação cadastrada!"
    );

}



/* =========================================================
   SUGESTÃO IA
========================================================= */

function generateActivitySuggestion() {

    showToast(
        "Sugestão: atividade prática com resolução de problemas em grupos."
    );

}



/* =========================================================
   CALENDÁRIO
========================================================= */

function renderCalendar() {


    const grid =
        document.getElementById(
            "calendar-grid"
        );


    if (!grid) {
        return;
    }



    const year =
        calendarDate.getFullYear();


    const month =
        calendarDate.getMonth();



    const monthNames = [

        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"

    ];



    document
        .getElementById(
            "calendar-title"
        )
        .textContent =
        `${monthNames[month]} ${year}`;



    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();



    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();



    let html = "";



    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        html += `
            <div class="day"></div>
        `;

    }



    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {


        const dateString =

            `year-{
                String(month + 1)
                    .padStart(2,"0")
            }-${
                String(day)
                    .padStart(2,"0")
            }`;



        const hasEvent =

            data.events.some(
                e =>
                    e.date === dateString
            )

            ||

            data.evaluations.some(
                e =>
                    e.date === dateString
            );



        html += `

            <div
                class="
                    day

                    ${
                        hasEvent
                            ? "event"
                            : ""
                    }

                    ${
                        day === 15 &&
                        month === 3 &&
                        year === 2026
                            ? "today"
                            : ""
                    }
                "
                onclick="
                    selectCalendarDay(
                        '${dateString}'
                    )
                "
            >

                ${day}

                ${
                    hasEvent
                        ?
                        `<div class="event-dot"></div>`
                        :
                        ""
                }

            </div>

        `;

    }



    grid.innerHTML =
        html;



    renderEvents();

}



/* =========================================================
   EVENTOS
========================================================= */

function renderEvents() {


    const list =
        document.getElementById(
            "event-list"
        );


    if (!list) {
        return;
    }



    const events = [

        ...data.events.map(
            e => ({
                ...e,
                type: "Evento"
            })
        ),

        ...data.evaluations.map(
            e => ({
                title: e.name,
                date: e.date,
                time: "Avaliação",
                type: "Avaliação"
            })
        )

    ]
    .sort(
        (a,b) =>
            a.date.localeCompare(
                b.date
            )
    );



    if (
        !events.length
    ) {

        list.innerHTML = `

            <p
                style="
                    color:var(--muted);
                    font-size:12px
                "
            >
                Nenhum evento cadastrado.
            </p>

        `;

        return;

    }



    list.innerHTML =
        events
            .map(
                e => `

                    <div
                        class="event-item"
                    >

                        <strong>
                            ${escapeHTML(e.title)}
                        </strong>

                        <span>
                            ${formatDate(e.date)}
                            •
                            ${escapeHTML(e.time)}
                        </span>

                    </div>

                `
            )
            .join("");

}



/* =========================================================
   MÊS ANTERIOR
========================================================= */

function previousMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() - 1
    );


    renderCalendar();

}



/* =========================================================
   PRÓXIMO MÊS
========================================================= */

function nextMonth() {

    calendarDate.setMonth(
        calendarDate.getMonth() + 1
    );


    renderCalendar();

}



/* =========================================================
   SELECIONAR DIA
========================================================= */

function selectCalendarDay(
    date
) {


    const events =
        data.events.filter(
            e =>
                e.date === date
        );


    const evaluations =
        data.evaluations.filter(
            e =>
                e.date === date
        );



    if (
        !events.length &&
        !evaluations.length
    ) {

        showToast(
            `Nenhum compromisso em ${formatDate(date)}.`
        );

        return;
    }



    showToast(
        `${
            events.length +
            evaluations.length
        } item(ns) em ${formatDate(date)}.`
    );

}



/* =========================================================
   NOVO EVENTO
========================================================= */

function openEventModal() {


    openModal(`

        <div
            class="modal-header"
        >

            <div>

                <h2>
                    Novo evento
                </h2>

                <p
                    style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:4px;
                    "
                >
                    Adicione um compromisso ao calendário.
                </p>

            </div>


            <button
                class="close-modal"
                onclick="closeModal()"
            >
                ×
            </button>

        </div>


        <div class="form-group">

            <label>
                Nome do evento
            </label>

            <input
                id="event-name"
                class="input"
                placeholder="Ex.: Reunião pedagógica"
            >

        </div>


        <div class="form-group">

            <label>
                Data
            </label>

            <input
                id="event-date"
                class="input"
                type="date"
            >

        </div>


        <div class="form-group">

            <label>
                Horário
            </label>

            <input
                id="event-time"
                class="input"
                placeholder="Ex.: 14:00 - 15:00"
            >

        </div>


        <button
            class="primary-btn"
            onclick="saveEvent()"
        >
            Adicionar ao calendário
        </button>

    `);

}



/* =========================================================
   SALVAR EVENTO
========================================================= */

function saveEvent() {


    const title =
        document
            .getElementById(
                "event-name"
            )
            .value
            .trim();


    const date =
        document
            .getElementById(
                "event-date"
            )
            .value;


    const time =
        document
            .getElementById(
                "event-time"
            )
            .value
            .trim();



    if (
        !title ||
        !date
    ) {

        showToast(
            "Informe o nome e a data."
        );

        return;
    }



    data.events.push({

        title,

        date,

        time:
            time ||
            "Horário não definido"

    });



    saveData();


    closeModal();


    renderAll();


    showToast(
        "Evento adicionado!"
    );

}



/* =========================================================
   EDITAR PERFIL
========================================================= */

function editProfile() {


    openModal(`

        <div
            class="modal-header"
        >

            <div>

                <h2>
                    Editar perfil
                </h2>

                <p
                    style="
                        color:var(--muted);
                        font-size:12px;
                        margin-top:4px;
                    "
                >
                    Atualize suas informações.
                </p>

            </div>


            <button
                class="close-modal"
                onclick="closeModal()"
            >
                ×
            </button>

        </div>


        <div class="form-group">

            <label>
                Nome completo
            </label>

            <input
                id="profile-edit-name"
                class="input"
                value="${escapeAttribute(data.user.name)}"
                placeholder="Seu nome completo"
            >

        </div>


        <div class="form-group">

            <label>
                Disciplina principal
            </label>

            <input
                id="profile-edit-subject"
                class="input"
                value="${escapeAttribute(data.user.subject)}"
                placeholder="Ex.: Matemática"
            >

        </div>


        <div class="form-group">

            <label>
                Telefone
            </label>

            <input
                id="profile-edit-phone"
                class="input"
                value="${escapeAttribute(data.user.phone)}"
                placeholder="(00) 00000-0000"
            >

        </div>


        <div class="form-group">

            <label>
                Cidade
            </label>

            <input
                id="profile-edit-city"
                class="input"
                value="${escapeAttribute(data.user.city)}"
                placeholder="Sua cidade"
            >

        </div>


        <div class="form-group">

            <label>
                Sobre você
            </label>

            <textarea
                id="profile-edit-bio"
                class="input"
                placeholder="Conte um pouco sobre você..."
            >${escapeHTML(data.user.bio)}</textarea>

        </div>


        <button
            class="primary-btn"
            onclick="saveProfile()"
        >
            Salvar alterações
        </button>

    `);

}



/* =========================================================
   SALVAR PERFIL
========================================================= */

function saveProfile() {


    /*
       PEGAMOS O NOVO NOME
    */

    const newName =
        document
            .getElementById(
                "profile-edit-name"
            )
            .value
            .trim();



    const newSubject =
        document
            .getElementById(
                "profile-edit-subject"
            )
            .value
            .trim();



    const newPhone =
        document
            .getElementById(
                "profile-edit-phone"
            )
            .value
            .trim();



    const newCity =
        document
            .getElementById(
                "profile-edit-city"
            )
            .value
            .trim();



    const newBio =
        document
            .getElementById(
                "profile-edit-bio"
            )
            .value
            .trim();



    /*
       NÃO PERMITE NOME VAZIO
    */

    if (!newName) {

        showToast(
            "Digite seu nome completo."
        );

        return;
    }



    /*
       ATUALIZA O OBJETO PRINCIPAL
    */

    data.user.name =
        newName;


    data.user.subject =
        newSubject;


    data.user.phone =
        newPhone;


    data.user.city =
        newCity;


    data.user.bio =
        newBio;



    /*
       SALVA NO LOCAL STORAGE
    */

    saveData();



    /*
       FECHA O MODAL
    */

    closeModal();



    /*
       ATUALIZA TODA A INTERFACE.

       Isso faz o nome mudar:
       - no Dashboard
       - no topo
       - no avatar
       - no Perfil
       - nos detalhes do Perfil
    */

    updateUserUI();



    /*
       Atualiza também o título do Dashboard.
    */

    if (
        currentPage ===
        "dashboard"
    ) {

        document
            .getElementById(
                "page-title"
            )
            .textContent =
            `Olá, ${data.user.name}!`;

    }



    showToast(
        "Perfil atualizado com sucesso!"
    );

}



/* =========================================================
   MODAL
========================================================= */

function openModal(
    content
) {


    document
        .getElementById(
            "modal-content"
        )
        .innerHTML =
        content;



    document
        .getElementById(
            "modal"
        )
        .classList.remove(
            "hidden"
        );

}



function closeModal() {

    document
        .getElementById(
            "modal"
        )
        .classList.add(
            "hidden"
        );

}



function closeModalOutside(
    event
) {

    if (
        event.target.id ===
        "modal"
    ) {

        closeModal();

    }

}



/* =========================================================
   TEMA
========================================================= */

function toggleTheme() {


    document
        .body
        .classList.toggle(
            "dark"
        );



    const dark =
        document
            .body
            .classList.contains(
                "dark"
            );



    localStorage.setItem(
        "eduOrganizaTheme",
        dark
            ? "dark"
            : "light"
    );



    const label =
        document.getElementById(
            "theme-label"
        );


    if (label) {

        label.textContent =
            dark
                ? "Escuro"
                : "Claro";

    }

}



/* =========================================================
   CARREGAR TEMA
========================================================= */

if (
    localStorage.getItem(
        "eduOrganizaTheme"
    ) === "dark"
) {

    document
        .body
        .classList.add(
            "dark"
        );

}



/* =========================================================
   ATUALIZAR ESTATÍSTICAS
========================================================= */

function updateStats() {


    const classes =
        document.getElementById(
            "stat-classes"
        );


    const students =
        document.getElementById(
            "stat-students"
        );


    const evaluations =
        document.getElementById(
            "stat-evaluations"
        );



    if (classes) {

        classes.textContent =
            data.classes.length;

    }



    if (students) {

        students.textContent =
            data.classes.reduce(
                (
                    total,
                    c
                ) =>

                    total +
                    Number(
                        c.students ||
                        0
                    ),

                0
            );

    }



    if (evaluations) {

        evaluations.textContent =
            data.evaluations.length;

    }

}



/* =========================================================
   IMPRIMIR RELATÓRIO
========================================================= */

function printReport() {

    window.print();

}



/* =========================================================
   TOAST
========================================================= */

let toastTimeout;



function showToast(
    message
) {


    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}



/* =========================================================
   FORMATAR DATA
========================================================= */

function formatDate(
    dateString
) {


    if (!dateString) {
        return "";
    }



    const [
        year,
        month,
        day
    ] =
        dateString.split("-");



    return `day/{month}/${year}`;

}



/* =========================================================
   SEGURANÇA HTML
========================================================= */

function escapeHTML(
    value
) {


    return String(
        value || ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}



/* =========================================================
   SEGURANÇA PARA ATRIBUTOS
========================================================= */

function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    )
    .replaceAll(
        "\n",
        " "
    );

}



/* =========================================================
   RENDERIZAÇÃO GERAL
========================================================= */

function renderAll() {


    updateStats();


    updateUserUI();


    renderClasses();


    renderAttendance();


    renderEvaluations();


    renderCalendar();

}