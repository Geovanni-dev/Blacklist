import 'dotenv/config'; // importação do módulo dotenv para carregar as variáveis de ambiente do arquivo .env
import express, { type Express } from 'express'; // importação do express
import { idRoutes } from './IDs/routes/idRoutes.js'; // importação das rotas de IDs
import cors from 'cors'; // importação do módulo cors

//================== classe para criar e configurar o servidor
class Server {
  public app: Express; // definição do tipo da propriedade app como express.Application

  constructor() {
    // verifica se estamos em ambiente de desenvolvimento ou de produção
    if (process.env.NODE_ENV === 'production') {
      console.log = () => {}; // desativa o console.log em produção
    }
    this.app = express(); // criação de uma instância do Express para configurar o servidor
    this.middleware(); // chamada do método para configurar os middlewares
    this.routes(); // chamada do método para configurar as rotas
  }

  private middleware(): void {
    this.app.use(express.json()); // configuração do middleware para parsear o corpo das requisições como JSON
    /*this.app.use(cors()); cors para desenvolvimento*/
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000'; // url do front-end
    this.app.use(
      cors({
        origin: clientUrl.split(',').map((url) => url.trim()), // configura o cors para permitir mais de uma URL
      }),
    );
  }

  private routes(): void {
    // configuração das rotas
    this.app.use('/ids', idRoutes);
    this.app.get('/', (_req, res) => {
      res.json({
        message: 'Servidor subiu com sucesso',
      });
    });
  }
}

export const app = new Server().app; // exportação da classe Server para ser utilizada em outros arquivos do projeto, permitindo a criação e configuração do servidor de forma modular
