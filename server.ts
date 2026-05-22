import { app } from "./src/app.js"; // importação do servidor configurado na classe Server do arquivo src/app.ts

const PORT = process.env.PORT || 3000; // porta utilizada pelo servidor

app.listen(PORT, () => console.log(`Server rodando na zona ${PORT}`));