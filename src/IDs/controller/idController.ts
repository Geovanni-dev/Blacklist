import prisma from "../../lib/prisma.js";
import type { Request, Response } from "express";
import { z } from "zod";

//=========schema zod 

// schema para adicionar um id
const addIdSchema = z.object({
    id: z.string().trim().regex(/^[0-9]+$/, "O ID deve conter apenas números").min(4, "id deve ter no minimo 4 caracteres"),

    server: z.coerce.number().int(). 
    min(1000, "server deve ter no minimo 4 numeros").
    max(9999, "server deve ter no maximo 4 numeros").
    optional() // Converte para número e valida se é um inteiro de 4 dígitos
});

//schema para buscar um id
const searchIdSchema = z.object({
    id: z.string().trim().min(4, "id deve ter no minimo 4 caracteres").transform((val) => {
        const idClear = val.match(/\d+/); // Extrai a primeira sequência numérica dentro do id e ignora formatos como 74694823 (1278)
        
        if (idClear) { 
        return idClear[0];
        }
        
        return val;// Retorna a string original caso não possua dígitos, forçando o Zod a falhar
    })
});

//========== classe para controlar as rotas
class IdController { 

    //================funçao para buscar o id
    async showId (req:Request, res:Response) { // funçao para buscar o id
        try {
        const { id } = searchIdSchema.parse(req.params); // parse para verificar se o id e valido
        const idSeach = await prisma.id.findUnique({ // busca o id no banco de dados
            where: { id }
        });
        //verifica se o id existe
        if (!idSeach) {
            return res.status(404).json({ error: "Id nao encontrado" });
        }
        
        const finalId = idSeach.server  // se tiver server, concatena o id com o server na exibição
                ? `${idSeach.id} ${idSeach.server}`
                : idSeach.id;
        
        
        return res.json({ id: finalId }); // retorna o id encontrado
    } catch (error) {
       if (error instanceof z.ZodError) { // se o erro for do zod
            return res.status(400).json({ error: "Erro de validação", 
                detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
        });
        }
        console.log(error); // se n for do zod
        return res.status(500).json({ error: "Erro ao buscar id" });
    }
}


//============== função para adicionar um novo id no Postgre
    async storeId (req:Request, res:Response) { // funçao para criar o id
        try {
            const { id, server } = addIdSchema.parse(req.body); // parse para verificar se o id e valido
            const idSeach = await prisma.id.findUnique({ // busca o id no banco de dados
                where: { id }
            });
            //verifica se o id existe
            if (idSeach) {
                return res.status(400).json({ error: "Id ja cadastrado" }); // se o id ja existir
            }
            const newId = await prisma.id.create({ // cria o id no banco de dados
                data: { 
                    id,
                    server: server ?? null } // se n for adicionando server, cria um id sem server
            });
            
            return res.json(newId); // retorna o id criado
        } catch (error) {
            if (error instanceof z.ZodError) { // se o erro for do zod
                return res.status(400).json({ error: "Erro de validação", 
                    detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
            });
            }
            console.log(error); // se n for do zod
            return res.status(500).json({ error: "Erro ao criar id" });
        }
    }

//================ funçao para deletar o id
    async destroyId (req:Request, res:Response) { // funçao para deletar o id
        try {
        const { id } = searchIdSchema.parse(req.params); // parse para verificar se o id e valido
        const idSearch = await prisma.id.findUnique({ // busca o id no banco de dados
            where: { id }
        });
        if (!idSearch) { // verifica se o id existe
            return res.status(404).json({ error: "Id nao encontrado" });
        }
        const deletedId = await prisma.id.delete({ // deleta o id no banco de dados
            where: { id } 
        });
        return res.json({ message: `Id ${deletedId.id} deletado com sucesso` }); // retorna a mensagem
        } catch (error) { // se der erro
            if (error instanceof z.ZodError) { // se o erro for do zod
                return res.status(400).json({ error: "Erro de validação", 
                    detalhes: error.flatten().fieldErrors // funçao para imprimir os erros
            });
            }
            console.log(error); // se n for do zod
            return res.status(500).json({ error: "Erro ao deletar id" });
        }
    }
    
    /*  - Pensei em fazer um PUT, mas como o ID é chave primária, o Prisma ia reclamar.
        - Regra de negócio: se cadastrar o ID errado, deleta e cria de novo no painel.
        - Bem mais limpo e evita gambiarra com o banco de dados.*/

};

export default new IdController(); // exportação da classe