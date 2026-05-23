import { Router } from "express"; // importação da rota do express
import IdController from "../controller/idController.js"; // importação do controller
import { rateLimitMiddleware } from "../../middlewares/rateLimit.js"; // importação do middleware rateLimit

const router = Router(); // criação da rota


//=================== rotas

router.get("/:id", rateLimitMiddleware.middleware(), IdController.showId); // rota para buscar o id
router.post("/add", IdController.storeId); // rota para criar o id
router.delete("/:id", IdController.destroyId); // rota para deletar o id


export default router; // exportação da rota