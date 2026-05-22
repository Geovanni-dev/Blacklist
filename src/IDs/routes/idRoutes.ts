import { Router } from "express"; // importação do express
import idController from "../controller/idController.js";

const router = Router();

router.get("/:id", idController.getId); // rota para buscar o id
router.post("/", idController.createId); // rota para criar o id

export default router;