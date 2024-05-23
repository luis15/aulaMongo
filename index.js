const express = require("express");
const app = express();
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const uri = process.env.MONGO;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  await client.connect();
  const collection = client.db("biblioteca").collection("livros");
  const livros = await collection.find().toArray();
  console.log(livros);
  await client.close();
  res.render("index", { livros: livros });
});

app.get("/cadastrar", (req, res) => {
  res.render("cadastrar");
});

app.post("/cadastrar", async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("biblioteca").collection("livros");
    const livros = await collection.insertOne(req.body);
    console.log(livros);
    await client.close();
    res.render("sucesso");
  } catch (err) {
    res.render("erro", { erro: err.message });
  }
});

app.listen(3000, () => {
  console.log("Servidor iniciado");
});
