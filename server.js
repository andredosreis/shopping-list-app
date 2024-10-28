const express = require('express');
const axios = require('axios'); // Biblioteca para fazer chamadas HTTP
const app = express();
const path = require('path');

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota para o arquivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Rota para buscar produtos de uma API externa
app.get('/search', async (req, res) => {
    const query = req.query.q; // Termo de pesquisa vindo do front-end

    try {
        // Fazer a requisição à API OpenFoodFacts (ou outra API)
        const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${query}.json`);

        // Processar dados da API, buscando apenas informações essenciais
        const products = response.data.products.map(product => ({
            name: product.product_name,
            brand: product.brands,
            imageUrl: product.image_url,
        }));

        res.json(products); // Enviar os dados processados como resposta JSON
    } catch (error) {
        console.error("Erro ao buscar dados do produto:", error);
        res.status(500).json({ error: 'Erro ao buscar dados do produto' });
    }
});

// Iniciar o servidor na porta 3000 ou variável de ambiente PORT
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
