const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT;


app.use(cors());
app.use(express.json());

const uri = process.env.URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const db = client.db('zap_shift_data');
        const parcelCollections = db.collection('parcels');

        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email } = req.query;
            if (email) {
                query.senderEmail = email;
            }
            const parcels = await parcelCollections.find(query).toArray();
            res.send(parcels);

        })

        app.post('/parcels', async (req, res) => {
            const query = req.body;
            const parcel = await parcelCollections.insertOne(query);
            res.send(parcel);
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Zap Shift Backend is Running')
})

app.listen(port, () => {
    console.log(`Zap Shift app listening on port ${port}`)
})
