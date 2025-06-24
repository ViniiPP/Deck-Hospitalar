# 🏥 Deck-Hospitalar: Gestão e Monitoramento

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Raspberry Pi](https://img.shields.io/badge/Raspberry%20Pi-4-A22846?style=for-the-badge&logo=raspberry-pi&logoColor=white)

**Sistema web para gestão de pacientes hospitalares e monitoramento de ambientes em tempo real através de sensores IoT, com funcionalidade completa de CRUD, frontend em HTML/CSS/JS puros e backend em Java com Spring Boot.**

---

## 📋 Sumário

- [Funcionalidades](#-funcionalidades)
- [Hardware e Sensores Utilizados](#-hardware-e-sensores-utilizados)
- [Arquitetura da Solução](#-arquitetura-da-solução)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
- [Rotas da API (Exemplos)](#-rotas-da-api-exemplos)
- [Banco de Dados](#-banco-de-dados)
- [Deploy (Sugestão)](#-deploy-sugestão)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)
- [Autor](#-autor)

## ✨ Funcionalidades

- **Gestão de Pacientes (CRUD):** Funcionalidade completa para Criar, Ler, Atualizar e Deletar registros de pacientes.
- **Monitoramento IoT em Tempo Real:** Coleta de dados de múltiplos parâmetros ambientais:
  - **Temperatura e Umidade** com o sensor `DHT11`.
  - **Nível de Ruído** com o módulo `LM393`.
  - **Luminosidade** com o sensor `LDR`.
  - **Qualidade do Ar** com o sensor de gases `MQ-135`.
- **Gateway IoT:** Uso do **Raspberry Pi 4** para ler os dados do Arduino e transmiti-los para o servidor.
- **Comunicação Assíncrona:** O back-end recebe dados via **RabbitMQ** e notifica o front-end via **WebSocket**.
- **Segurança:** Autenticação baseada em **JWT (JSON Web Tokens)** com Spring Security.
- **Dashboard Web:** Interface leve e direta construída com HTML, CSS e JavaScript para visualização dos dados.

## 🔌 Hardware e Sensores Utilizados

- **Gateway IoT:** **Raspberry Pi 4**
- **Coletor de Dados:** **Arduino** (ex: Uno, Nano)
- **Sensores:**
  - `DHT11` (Temperatura e Umidade)
  - `LM393` (Nível de Ruído)
  - `LDR` (Luminosidade)
  - `MQ-135` (Qualidade do Ar)

## 🏗️ Arquitetura da Solução

O fluxo de dados desde o mundo físico até a tela do usuário segue estas etapas:

**[Sensores] → [Arduino] → (Serial/USB) → [Raspberry Pi 4] → (Script) → [Back-end (Rota /rasp/send)] → [RabbitMQ] → [Back-end (Listener)] → [WebSocket] → [Front-end]**

Enquanto isso, a gestão de dados pelo usuário funciona em paralelo:

**[Usuário] ↔ [Front-end] ↔ (API REST com JWT) ↔ [Back-end] ↔ [Banco de Dados]**

## 🚀 Tecnologias Utilizadas

### **Back-end**
- Java 17
- Spring Boot
- Spring Security (com JWT)
- Spring Data JPA
- WebSocket
- RabbitMQ
- PostgreSQL
- Maven
- Lombok

### **Front-end**
- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API para requisições HTTP

### **Infraestrutura e DevOps**
- Docker

## 📂 Estrutura do Projeto

```
Deck-Hospitalar/
├── CuraBackEnd-main/
│   ├── Dockerfile
│   ├── pom.xml
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── br/login/api/apilogin/
│   │       │       ├── controllers/
│   │       │       ├── entitys/
│   │       │       ├── repositorys/
│   │       │       ├── services/
│   │       │       ├── DTOS/
│   │       │       ├── Utils/
│   │       │       ├── configs/
│   │       │       └── ApiLoginApplication.java
│   │       └── resources/
│   │           └── application.properties
├── frontEnd/
│   ├── assets 
│   ├── pages 
│   │   ├── dashboard
│   │   ├── login
│   │   └── register
│   │ 
```


## ✅ Pré-requisitos

- Todo o hardware listado acima, montado.
- **Java JDK 17+**
- **Docker** (recomendado para rodar o PostgreSQL e o RabbitMQ)

## 🔧 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/ViniiPP/Deck-Hospitalar.git](https://github.com/ViniiPP/Deck-Hospitalar.git)
    cd Deck-Hospitalar
    ```
2.  **Configure o Hardware:** Monte o circuito com Arduino e sensores e execute no Raspberry Pi o script para enviar os dados para o back-end (via rota `/rasp/send`).
3.  **Configure e rode o Back-end:**
    ```bash
    cd CuraBackEnd-main/
    
    # Crie o seu arquivo de configuração a partir do exemplo
    cp src/main/resources/application.example.properties src/main/resources/application.properties
    
    # Edite o application.properties com os seus dados (banco, rabbitmq, etc)
    
    # Rode a aplicação usando o Maven Wrapper
    ./mvnw spring-boot:run
    ```
    O servidor será iniciado na porta definida (normalmente `8080`).

4.  **Acesse o Front-end:**
    O front-end é servido diretamente pelo back-end. Com o servidor Spring Boot rodando, abra o seu navegador e acesse:
    `http://localhost:8080/`

## 🔗 Rotas da API (Exemplos)

- `POST /auth/signup`: Cria um novo usuário.
- `POST /auth/signin`: Realiza o login e retorna um token JWT.
- `GET /status`: Verifica o status do back-end.
- `POST /rasp/send`: Rota para o Raspberry Pi enviar os dados dos sensores.

## 📈 Banco de Dados

O projeto utiliza **PostgreSQL** com Spring Data JPA. As entidades principais são:
* `UsuarioEntity`
* `SensorEntity`
* `DadosEntity`
* `GenericEntity`

A configuração da conexão está em `application.properties`.

## 🎯 Front-end - Componentes Principais

* **index.html**: Estrutura da página e interface principal.
* **style.css**: Estilização customizada do sistema.
* **script.js**: Lógica de interação com a API via Fetch API e manipulação do DOM para exibir os dados.


## 🙌 Contribuindo

1.  Faça um Fork do repositório
2.  Crie uma nova branch (`git checkout -b feature/sua-feature`)
3.  Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4.  Faça push para a branch (`git push origin feature/sua-feature`)
5.  Abra um Pull Request


Desenvolvido por **Vinícius Pereira Polli & Roberto Jacobs**.
