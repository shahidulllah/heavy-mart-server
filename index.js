const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//Middleware
app.use(cors({
    origin: [
        'https://heavy-mart.web.app',
        'https://heavy-mart.firebaseapp.com'
    ]
}));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qcso25z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const productCollection = client.db('productsDB').collection('products');

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const productData = await productCollection
                .find()
                .skip(page * size)
                .limit(size)
                .toArray();
            res.send(productData);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const productData = await productCollection.findOne(query);
            res.send(productData);
        })

        app.get('/productsCount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        })

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Heavey mart is running..')
})
app.listen(port, () => {
    console.log(`Heavy Mart is running on port ${port}`);
})
