const express = require('express')
const { MongoClient } = require('mongodb');
const cors=require('cors');
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

        //GET foods API
        app.get('/foods',async(req,res)=>{
            const cursor=foodCollection.find({});
           const foods=await cursor.toArray();
           res.send(foods);
        })
        
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