CREATE DATABASE IF NOT EXISTS educlass;

USE educlass;

-- =========================================
-- PROFESSORES
-- =========================================

CREATE TABLE professores (
    id INT NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    UNIQUE (email)
);

-- =========================================
-- ESCOLAS
-- =========================================

CREATE TABLE escolas (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,
    nome VARCHAR(180) NOT NULL,
    cidade VARCHAR(120),
    estado VARCHAR(80),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_escola_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE
);

-- =========================================
-- TURMAS
-- =========================================

CREATE TABLE turmas (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,
    escola_id INT NULL,
    nome VARCHAR(120) NOT NULL,
    ano_letivo INT,
    turno VARCHAR(40),
    disciplina VARCHAR(120),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_turma_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_turma_escola
        FOREIGN KEY (escola_id)
        REFERENCES escolas(id)
        ON DELETE SET NULL
);

-- =========================================
-- ALUNOS
-- =========================================

CREATE TABLE alunos (
    id INT NOT NULL AUTO_INCREMENT,
    turma_id INT NOT NULL,
    nome VARCHAR(160) NOT NULL,
    data_nascimento DATE NULL,
    matricula VARCHAR(80),
    email VARCHAR(180),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_aluno_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE CASCADE
);

-- =========================================
-- PRESENÇAS
-- =========================================

CREATE TABLE presencas (
    id INT NOT NULL AUTO_INCREMENT,
    aluno_id INT NOT NULL,
    turma_id INT NOT NULL,
    data_aula DATE NOT NULL,
    presente TINYINT(1) NOT NULL DEFAULT 1,
    observacao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_presenca_aluno_data (
        aluno_id,
        data_aula
    ),

    CONSTRAINT fk_presenca_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_presenca_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE CASCADE
);

-- =========================================
-- AVALIAÇÕES
-- =========================================

CREATE TABLE avaliacoes (
    id INT NOT NULL AUTO_INCREMENT,
    turma_id INT NOT NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT,
    data_avaliacao DATE NOT NULL,
    valor_maximo DECIMAL(6,2) NOT NULL DEFAULT 10.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_avaliacao_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE CASCADE
);

-- =========================================
-- NOTAS
-- =========================================

CREATE TABLE notas (
    id INT NOT NULL AUTO_INCREMENT,
    avaliacao_id INT NOT NULL,
    aluno_id INT NOT NULL,
    nota DECIMAL(6,2) NOT NULL,
    observacao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    UNIQUE KEY uk_nota_avaliacao_aluno (
        avaliacao_id,
        aluno_id
    ),

    CONSTRAINT fk_nota_avaliacao
        FOREIGN KEY (avaliacao_id)
        REFERENCES avaliacoes(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_nota_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE CASCADE
);

-- =========================================
-- CALENDÁRIO / EVENTOS
-- =========================================

CREATE TABLE eventos (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,
    turma_id INT NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(60) NOT NULL DEFAULT 'atividade',
    data_evento DATE NOT NULL,
    hora VARCHAR(10),
    status VARCHAR(40) NOT NULL DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_evento_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_evento_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE SET NULL
);

-- =========================================
-- MATERIAIS
-- =========================================

CREATE TABLE materiais (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,
    turma_id INT NULL,
    titulo VARCHAR(180) NOT NULL,
    descricao TEXT,
    link VARCHAR(500),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_material_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_material_turma
        FOREIGN KEY (turma_id)
        REFERENCES turmas(id)
        ON DELETE SET NULL
);

-- =========================================
-- BEM-ESTAR
-- =========================================

CREATE TABLE bem_estar (
    id INT NOT NULL AUTO_INCREMENT,
    professor_id INT NOT NULL,
    data_registro DATE NOT NULL,
    humor VARCHAR(60),
    nivel_estresse INT,
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_bem_estar_professor
        FOREIGN KEY (professor_id)
        REFERENCES professores(id)
        ON DELETE CASCADE
);