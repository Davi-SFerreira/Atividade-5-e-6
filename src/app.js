import express from 'express';
import rotasEntregas from './routes/index.routes.js';

const app = express();
app.use(express.json());

app.use(rotasEntregas); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});