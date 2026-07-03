import prisma from '../../lib/prisma.js';
import type { Request, Response } from 'express';
import { z } from 'zod';

//=========schema zod

// schema para adicionar um id
const addIdSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(/^[0-9]+$/, 'O ID deve conter apenas números')
    .min(4, 'id deve ter no minimo 4 caracteres'),

  server: z.coerce
    .number()
    .int()
    .min(1000, 'server deve ter no minimo 4 numeros')
    .max(9999, 'server deve ter no maximo 4 numeros')
    .optional(), // Converte para número e valida se é um inteiro de 4 dígitos

  descricao: z
    .string()
    .trim()
    .min(4, 'descricao deve ter no minimo 4 caracteres')
    .optional(),
});

//schema para buscar/deletar um id
const searchIdSchema = z.object({
  id: z
    .string()
    .trim()
    .min(4, 'id deve ter no minimo 4 caracteres')
    .transform((val) => {
      const idClear = val.match(/\d+/); // Extrai a primeira sequência numérica dentro do id e ignora formatos como 74694823 (1278)

      if (idClear) {
        return idClear[0];
      }

      return val; // Retorna a string original caso não possua dígitos, forçando o Zod a falhar
    }),
});

//schema para add ids em massa
const idsSchema = z.array(
  z.object({
    id: z
      .string()
      .trim()
      .regex(/^[0-9]+$/, 'O ID deve conter apenas números')
      .min(4, 'id deve ter no minimo 4 caracteres'),

    server: z.coerce
      .number()
      .int()
      .min(1000, 'server deve ter no minimo 4 numeros')
      .max(9999, 'server deve ter no maximo 4 numeros')
      .optional(), // Converte para número e valida se é um inteiro de 4 dígitos

    descricao: z
      .string()
      .trim()
      .min(4, 'descricao deve ter no minimo 4 caracteres')
      .optional(),
  }),
);

//========== classe para controlar as rotas
class IdController {
  //================funçao para buscar o id
  async showId(req: Request, res: Response) {
    // funçao para buscar o id
    try {
      const { id } = searchIdSchema.parse(req.params); // parse para verificar se o id e valido
      const idSeach = await prisma.id.findUnique({
        // busca o id no banco de dados
        where: { id },
      });
      //verifica se o id existe
      if (!idSeach) {
        return res.status(404).json({ error: 'Id nao encontrado' });
      }

      const finalId = `${idSeach.id}${
        idSeach.server ? ` (${idSeach.server})` : ''
      }${idSeach.descricao ? `, conta ${idSeach.descricao}` : ''}`;

      return res.json({ id: finalId, descricao: idSeach.descricao }); // retorna o id encontrado
    } catch (error) {
      if (error instanceof z.ZodError) {
        // se o erro for do zod
        return res.status(400).json({
          error: 'Erro de validação',
          detalhes: error.flatten().fieldErrors, // funçao para imprimir os erros
        });
      }
      console.log(error); // se n for do zod
      return res.status(500).json({ error: 'Erro ao buscar id' });
    }
  }

  //============== função para adicionar um novo id no Postgre
  async storeId(req: Request, res: Response) {
    // funçao para criar o id
    try {
      const { id, server, descricao } = addIdSchema.parse(req.body); // parse para verificar se o id e valido
      const idSeach = await prisma.id.findUnique({
        // busca o id no banco de dados
        where: { id },
      });
      //verifica se o id existe
      if (idSeach) {
        return res.status(400).json({ error: 'Id ja cadastrado' }); // se o id ja existir
      }
      const newId = await prisma.id.create({
        // cria o id no banco de dados
        data: {
          id,
          server: server ?? null, // se n for adicionando server, cria um id sem server
          descricao: descricao ?? null, // se n for adicionando descricao, cria um id sem descricao tbm
        },
      });

      return res.json(newId); // retorna o id criado
    } catch (error) {
      if (error instanceof z.ZodError) {
        // se o erro for do zod
        return res.status(400).json({
          error: 'Erro de validação',
          detalhes: error.flatten().fieldErrors, // funçao para imprimir os erros
        });
      }
      console.log(error); // se n for do zod
      return res.status(500).json({ error: 'Erro ao criar id' });
    }
  }

  //================ funçao para deletar o id
  async destroyId(req: Request, res: Response) {
    // funçao para deletar o id
    try {
      const { id } = searchIdSchema.parse(req.params); // parse para verificar se o id e valido
      const idSearch = await prisma.id.findUnique({
        // busca o id no banco de dados
        where: { id },
      });
      if (!idSearch) {
        // verifica se o id existe
        return res.status(404).json({ error: 'Id nao encontrado' });
      }
      const deletedId = await prisma.id.delete({
        // deleta o id no banco de dados
        where: { id },
      });
      return res.json({ message: `Id ${deletedId.id} deletado com sucesso` }); // retorna a mensagem
    } catch (error) {
      // se der erro
      if (error instanceof z.ZodError) {
        // se o erro for do zod
        return res.status(400).json({
          error: 'Erro de validação',
          detalhes: error.flatten().fieldErrors, // funçao para imprimir os erros
        });
      }
      console.log(error); // se n for do zod
      return res.status(500).json({ error: 'Erro ao deletar id' });
    }
  }

  //================funçao pra add Ids em massa
  async storeIds(req: Request, res: Response) {
    try {
      const idList = idsSchema.parse(req.body); // parse para verificar se os ids são validos
      const idSearch = await prisma.id.findMany({
        // busca os ids no banco de dados
        where: {
          // verifica se os ids ja existem
          id: {
            in: idList.map((entry) => entry.id),
          },
        },
      });
      if (idSearch.length > 0) {
        // se existirem ids cadastrados retorna um erro
        const idsCadastrados = idSearch.map((id) => id.id).join(', '); // variavel que gera uma string com os ids cadastrados
        return res.status(400).json({
          error: `Os seguintes ids ja foram cadastrados: ${idsCadastrados}`,
        });
      }
      const newIds = await prisma.id.createMany({
        // add os ids no banco de dados
        data: idList.map((entry) => ({
          id: entry.id, // pega o id
          server: entry.server ?? null, // se n for adicionando server, cria um id sem server
          descricao: entry.descricao ?? null, // se n for adicionando descricao, cria um id sem descricao tbm
        })),
      });
      return res.json(newIds); // retorna os ids criados
    } catch (error) {
      // tratamento de erros
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Erro de validação',
          detalhes: error.format(), // funçao para imprimir os erros de validação em array
        });
      }
      console.log(error); // se n for do zod
      return res.status(500).json({ error: 'Erro ao criar ids' });
    }
  }

  /*  - Pensei em fazer um PUT, mas como o ID é chave primária, o Prisma ia reclamar.
        - Regra de negócio: se cadastrar o ID errado, deleta e cria de novo no painel.
        - Bem mais limpo e evita gambiarra com o banco de dados.*/
}

export const idController = new IdController();
