const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


/* CONEXÃO COM O NOVO MONGODB */
mongoose.connect(
  "mongodb+srv://HiperSol:HiperSol7@cluster0.kje1avo.mongodb.net/chamados?retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
  console.log("✅ Conectado ao Novo Banco HiperSol!");
}).catch((err) => {
  console.log("❌ Erro ao conectar no novo banco:", err);
});

/* MODELO DO CHAMADO COM NOVO CAMPO */
const Chamado = mongoose.model("Chamado", {
  cliente: String,
  telefone: String,
  problema: String,
  cidade: String,
  marcaInversor: String, // Adicionado conforme solicitado
  data: {
    type: Date,
    default: Date.now
  }
});

/* CRIAR CHAMADO */
app.post("/chamado", async (req, res) => {
  const chamado = await Chamado.create(req.body);
  res.send(chamado);
});

/* LISTAR CHAMADOS */
app.get("/chamados", async (req, res) => {
  const chamados = await Chamado.find().sort({ data: -1 });
  res.send(chamados);
});

/* ATUALIZAR CHAMADO (ROTA DE EDIÇÃO) */
app.put("/chamado/:id", async (req, res) => {
  const chamado = await Chamado.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(chamado);
});

/* DELETAR (MARCAR COMO RESOLVIDO) */
app.delete("/chamado/:id", async (req, res) => {
  await Chamado.findByIdAndDelete(req.params.id);
  res.send({ ok: true });
});

app.listen(3000, () =>
  console.log("🚀 Servidor rodando em http://localhost:3000")
);