import { PrismaClient } from "@prisma/client"; //importação do PrismaClient para interagir com o banco de dados

const prisma = new PrismaClient(); // criação de uma instância do PrismaClient para realizar operações no banco de dados

export default prisma; // exportação da instância do PrismaClient para ser utilizada em outros arquivos do projeto, permitindo a interação com o banco de dados de forma centralizada