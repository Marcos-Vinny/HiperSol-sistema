const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



mongoose.connect(
  "mongodb+srv://HiperSol:HiperSol7@cluster0.kje1avo.mongodb.net/chamados?retryWrites=true&w=majority&appName=Cluster0"
).then(() => {
  console.log("✅ Conectado ao Novo Banco HiperSol!");
}).catch((err) => {
  console.log("❌ Erro ao conectar no novo banco:", err);
});


const Chamado = mongoose.model("Chamado", {
  cliente: String,
  telefone: String,
  problema: String,
  cidade: String,
  marcaInversor: String, 
  data: {
    type: Date,
    default: Date.now
  }
});


app.post("/chamado", async (req, res) => {
  const chamado = await Chamado.create(req.body);
  res.send(chamado);
});


app.get("/chamados", async (req, res) => {
  const chamados = await Chamado.find().sort({ data: -1 });
  res.send(chamados);
});


app.put("/chamado/:id", async (req, res) => {
  const chamado = await Chamado.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(chamado);
});


app.delete("/chamado/:id", async (req, res) => {
  await Chamado.findByIdAndDelete(req.params.id);
  res.send({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));