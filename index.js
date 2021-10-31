const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("database connected successfully");
        const database = client.db('food_delivery');
        const foodCollection = database.collection('foods');
        const customerCollection = client.db("food_delivery").collection("customer");
        const orderCollection = client.db("food_delivery").collection("orders");

        //GET foods API
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })

        //post api
        app.post('/foods',async(req,res)=>{
            const food=req.body;
            console.log('hit the post api',food);
            const result=await foodCollection.insertOne(food);
            console.log(result);
            res.json(result)
        })

        //place orders 
        app.post('/placeOrder', async (req, res) => {
            console.log(req.body);
            const result = await orderCollection.insertOne(req.body);
            console.log(result);
        });

        //Add customer
        app.post("/addCustomer", async (req, res) => {
            console.log(req.body);
            const result = await customerCollection.insertOne(req.body);
            res.send(result);
        });

        //Get all customers
        app.get("/allCustomers", async (req, res) => {
            const result = await customerCollection.find({}).toArray();
            res.send(result);
            console.log(object);
        })

        //Get all orders
        app.get("/allFoods", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        });

        //Delete order
        app.delete("/deleteFood/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id: new ObjectID(req.params.id)
            });
            res.send(result);
        });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Optivit Healthy Food Server');
})

app.listen(port, () => {
    console.log('Running optivit on port', port)
});