// Importa o Express e inicializa o app
const express = require('express');
const app = express();

// Importa o SQLite3
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database/pets.db');

// Permite que o Express receba JSON nas requisições
app.use(express.json());

// Endpoint para listar todos os pets
app.get('/api/pets', (req, res) => {
  const query = 'SELECT * FROM pets';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

// Endpoint para criar um novo pet (POST)
app.post('/api/pets', (req, res) => {
  const { name, age, species, adopted } = req.body;

  // Logando os dados recebidos
  console.log("Recebido:", req.body);
  
  // Verificando se todos os campos necessários foram fornecidos
  if (!name || !age || !species || adopted === undefined) {
    return res.status(400).json({ error: "Campos faltando no corpo da requisição" });
  }

  const query = 'INSERT INTO pets (name, age, species, adopted) VALUES (?, ?, ?, ?)';
  
  // Inserindo o pet no banco de dados
  db.run(query, [name, age, species, adopted], function(err) {
    if (err) {
      // Logando qualquer erro durante a inserção
      console.log("Erro ao inserir no banco:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Logando a resposta de sucesso
    console.log(`Pet inserido com sucesso! ID: ${this.lastID}`);
    // Retornando a resposta com o novo pet
    res.status(201).json({ id: this.lastID, name, age, species, adopted });
  });
});

// Endpoint para atualizar informações de um pet (PUT)
app.put('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, species, adopted } = req.body;
  const query = 'UPDATE pets SET name = ?, age = ?, species = ?, adopted = ? WHERE id = ?';

  db.run(query, [name, age, species, adopted, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Pet atualizado com sucesso!" });
  });
});

// Endpoint para deletar um pet (DELETE)
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM pets WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Pet deletado com sucesso!" });
  });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
