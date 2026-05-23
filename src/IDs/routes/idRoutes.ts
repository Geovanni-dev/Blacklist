import { Router } from "express"; // importação da rota do express
import { idController } from "../controller/idController.js"; // importação do controller
import { rateLimitMiddleware } from "../../middlewares/rateLimit.js"; // importação do middleware rateLimit

const router = Router(); // criação da rota


//=================== rotas

router.get("/:id", rateLimitMiddleware.middleware(), idController.showId); // rota para buscar o id
router.post("/add", idController.storeId); // rota para criar o id
router.delete("/:id", idController.destroyId); // rota para deletar o id


export const idRoutes = router;