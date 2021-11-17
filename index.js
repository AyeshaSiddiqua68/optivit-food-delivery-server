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

app.get('/', (req, res) => {
    res.send('Running Optivit Healthy Food Server');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ksgka.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("database connected successfully");
        const database = client.db('food_delivery');
        const foodCollection = database.collection('services');
        const orderCollection = database.collection("order");

        // load all services: get api
        app.get("/services", async (req, res) => {
            const services = await foodCollection.find({}).toArray();
            res.json(services);
        });

        // load a single data: get api
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










        //     //GET foods API
        //     app.get('/foods', async (req, res) => {
        //         const cursor = foodCollection.find({});
        //         const foods = await cursor.toArray();
        //         res.send(foods);
        //     })

        //     //post api
        //     app.post('/foods',async(req,res)=>{
        //         const food=req.body;
        //         console.log('hit the post api',food);
        //         const result=await foodCollection.insertOne(food);
        //         console.log(result);
        //         res.json(result)
        //     })

        //     //place orders 
        //     app.post('/placeOrder', async (req, res) => {
        //         console.log(req.body);
        //         const result = await orderCollection.insertOne(req.body);
        //         console.log(result);
        //     });

        //     //Add customer
        //     app.post("/addCustomer", async (req, res) => {
        //         console.log(req.body);
        //         const result = await customerCollection.insertOne(req.body);
        //         res.send(result);
        //     });

        //     //Get all customers
        //     app.get("/allCustomers", async (req, res) => {
        //         const result = await customerCollection.find({}).toArray();
        //         res.send(result);
        //         console.log(object);
        //     })

        //     //Get all orders
        //     app.get("/allFoods", async (req, res) => {
        //         const result = await orderCollection.find({}).toArray();
        //         res.send(result);
        //     });

        //     //Delete order
        //     app.delete("/deleteFood/:id", async (req, res) => {
        //         console.log(req.params.id);
        //         const result = await orderCollection.deleteOne({
        //             _id: new ObjectID(req.params.id)
        //         });
        //         res.send(result);
        //     });
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log('Running optivit on port', port)
});