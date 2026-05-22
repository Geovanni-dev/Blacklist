import { Router } from "express"; // importação da rota do express
import idController from "../controller/idController.js"; // importação do controller

const router = Router(); // criação da rota


//=================== rotas

router.get("/:id", idController.showId); // rota para buscar o id
router.post("/", idController.storeId); // rota para criar o id
router.delete("/:id", idController.destroyId); // rota para deletar o id


export default router; // exportação da rota