const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const dbFile = 'db.json';

// Função para ler o banco de dados
const readDB = () => {
    const data = fs.readFileSync(dbFile);
    return JSON.parse(data);
};

// Função para escrever no banco de dados
const writeDB = (data) => {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

// Rota para listar usuários
app.get('/usuarios', (req, res) => {
    const db = readDB();
    res.json(db.usuarios);
});

// Rota para obter um usuário específico
app.get('/usuarios/:id', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario);
});

//Rota para obter pessoas de um usuário
app.get('/usuarios/:id/pessoas', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(usuario.pessoas || []);
});

//Rota para obter um pessoa de um usuário por id
app.get('/usuarios/:id/pessoas/:pessoaId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id.toString() === req.params.id);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const pessoa = usuario.pessoas.find(p => p.id === req.params.pessoaId);
    if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(pessoa);
});



// Rota para adicionar um usuário
app.post('/usuarios', (req, res) => {
    const db = readDB();
    const novoUsuario = { id: Date.now(), ...req.body, pessoas: [], compras: [] };
    db.usuarios.push(novoUsuario);
    writeDB(db);
    res.status(201).json(novoUsuario);
});

// Rota para atualizar um usuário
app.put('/usuarios/:id', (req, res) => {
    const db = readDB();
    const index = db.usuarios.findIndex(u => u.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Usuário não encontrado' });
    db.usuarios[index] = { ...db.usuarios[index], ...req.body };
    writeDB(db);
    res.json(db.usuarios[index]);
});

// Rota para deletar um usuário
app.delete('/usuarios/:id', (req, res) => {
    const db = readDB();
    db.usuarios = db.usuarios.filter(u => u.id != req.params.id);
    writeDB(db);
    res.json({ message: 'Usuário removido com sucesso' });
});

// Rota para adicionar uma pessoa a um usuário
app.post('/usuarios/:id/pessoas', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    const novaPessoa = { id: Date.now().toString(), ...req.body };
    usuario.pessoas.push(novaPessoa);
    writeDB(db);
    res.status(201).json(novaPessoa);
});

// Rota para atualizar uma pessoa
app.put('/usuarios/:id/pessoas/:pessoaId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    const pessoa = usuario.pessoas.find(p => p.id == req.params.pessoaId);
    if (!pessoa) return res.status(404).json({ error: 'Pessoa não encontrada' });
    Object.assign(pessoa, req.body);
    writeDB(db);
    res.json(pessoa);
});

// Rota para deletar uma pessoa
app.delete('/usuarios/:id/pessoas/:pessoaId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    usuario.pessoas = usuario.pessoas.filter(p => p.id != req.params.pessoaId);
    writeDB(db);
    res.json({ message: 'Pessoa removida com sucesso' });
});

// Rota para adicionar uma compra a um usuário
app.post('/usuarios/:id/compras', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    const novaCompra = { id: Date.now().toString(), ...req.body };
    usuario.compras.push(novaCompra);
    writeDB(db);
    res.status(201).json(novaCompra);
});

// Rota para atualizar uma compra
app.put('/usuarios/:id/compras/:compraId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    const compra = usuario.compras.find(c => c.id == req.params.compraId);
    if (!compra) return res.status(404).json({ error: 'Compra não encontrada' });
    Object.assign(compra, req.body);
    writeDB(db);
    res.json(compra);
});

// Rota para deletar uma compra
app.delete('/usuarios/:id/compras/:compraId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    usuario.compras = usuario.compras.filter(c => c.id != req.params.compraId);
    writeDB(db);
    res.json({ message: 'Compra removida com sucesso' });
});

// Rota para listar compras de um usuário
app.get('/usuarios/:id/compras', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id == req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(usuario.compras);
});

app.get('/usuarios/:id/compras/:compraId', (req, res) => {
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id.toString() === req.params.id);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const compra = usuario.compras.find(c => c.id === req.params.compraId);
    if (!compra) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    res.json(compra);
});


//buscar parcelas de uma compra
app.get('/usuarios/:id/compras/:compraId/parcelas', (req, res) =>{
    const db = readDB();
    const usuario = db.usuarios.find(u => u.id.toString() === req.params.id);
    if(!usuario){
        return res.status(404).json({error: 'Usuário não encontrado'});
    }

    const compra = usuario.compras.find(c => c.id === req.params.compraId);
    if(!compra) {
        return res.status(404).json({error: 'Compra não encontrada'});
    }

    res.json(compra.parcelas);
})

//adicionar parcela em uma compra
app.post('/usuarios/:id/compras/:compraId/parcelas', (req, res) => {
  const db = readDB();
  const usuario = db.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const compra = usuario.compras.find(c => c.id === req.params.compraId);
  if (!compra) return res.status(404).json({ error: 'Compra não encontrada' });

  if (!compra.parcelas) {
    compra.parcelas = [];
}

  const novaParcela = { id: Date.now().toString(), ...req.body };
  compra.parcelas.push(novaParcela);

  writeDB(db);
  res.status(201).json(novaParcela);
});

app.get('/usuarios/:id/parcelas/mes/:ano/:mes', (req, res) => {
  const db = readDB();
  const usuario = db.usuarios.find(u => u.id == req.params.id);
  if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

  const ano = parseInt(req.params.ano);
  const mes = parseInt(req.params.mes) - 1; // JS usa mês de 0 a 11

  const parcelasDoMes = [];

  usuario.compras?.forEach(compra => {
    compra.parcelas?.forEach(parcela => {
      const data = new Date(parcela.dataVencimento);
      if (data.getFullYear() === ano && data.getMonth() === mes) {
        parcelasDoMes.push(parcela);
      }
    });
  });

  res.json(parcelasDoMes);
});



app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
