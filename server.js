const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* CONEXÃO MONGODB */
mongoose.connect(
  "mongodb+srv://unex:unex1234@pedro.eq0kx7m.mongodb.net/chamados"
)
.then(() => console.log("✅ Mongo conectado"))
.catch(err => console.log(err));

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