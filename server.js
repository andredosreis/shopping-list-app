const express = require('express');
const app = express();
const path = require('path');

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Definir a rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Iniciar o servidor na porta 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
