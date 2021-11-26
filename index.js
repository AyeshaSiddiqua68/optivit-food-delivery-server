//all imported packages and ports
const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//testing server (GET API)
app.get('/', (req, res) => {
    res.send('Running Optivit Healthy Food Server');
});

//connection to database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//client connection
async function run() {
    try {
        await client.connect();
        // console.log("database connected successfully");
        const database = client.db('food_delivery');
        const foodCollection = database.collection('services');
        const orderCollection = database.collection("order");

        // load all services(GET API)
        app.get("/services", async (req, res) => {
            const services = await foodCollection.find({}).toArray();
            res.json(services);
        });

        // load a single service (GET API)
        app.get("/singleservice/:id", async (req, res) => {
            const id = req.params.id;
            const result = await foodCollection.findOne({ _id: ObjectId(id) });
            res.json(result);
        });


        // Order an item (POST API)
        app.post("/book", async (req, res) => {
            const book = req.body;
            const result = await orderCollection.insertOne(book);
            res.json(result.insertedId);
        });

        //load a specific user's all ordered items (GET API)
        app.get("/myorders/:email", async (req, res) => {
            const email = req.params.email;
            const services = await orderCollection.find({ email }).toArray();
            res.send(services);
        });


        // deletion of ordered item(DELETE API)
        app.delete("/deletion/:id", async (req, res) => {
            const id = req.params.id;
            const result = await orderCollection.deleteOne({ _id: ObjectId(id) });
            res.json(result.deletedCount);
        });


        // load all ordered items(GET API)
        app.get("/orders", async (req, res) => {
            const services = await orderCollection.find({}).toArray();
            res.send(services);
        });

        // Order confirmation (PUT API)
        app.patch("/confirmation/:id", async (req, res) => {
            const id = req.params.id;
            const updateDoc = {
                $set: {
                    status: "Confirmed",
                },
            };
            const result = await orderCollection.updateOne(
                { _id: ObjectId(id) },
                updateDoc
            );
            res.json(result.modifiedCount);
        });


        //add a new food item (POST API)
        app.post("/addService", async (req, res) => {
            const service = req.body;
            const result = await foodCollection.insertOne(service);
            res.json(result);
        });


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

//port listening
app.listen(port, () => {
    console.log('Running optivit on port', port)
});