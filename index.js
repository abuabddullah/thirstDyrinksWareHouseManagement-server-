const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("ItemsDB").collection("items");
    console.log("Connected to MongoDB");

    // get all items from db
    app.get('/items', async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });


    // get no of cout of all items of db
    app.get('/itemsCount', async (req, res) => {
      const count = await itemsCollection.estimatedDocumentCount();
      res.send({ count });
    });


    // get single item by id from db
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.send(result);
      // res.send("get single item");
    });


    // post new item to db
    app.post('/items', async (req, res) => {
      const newItem = req.body;
      const result = await itemsCollection.insertOne(newItem);
      res.send(result);
    });


    // put and edit an item by id in db
    app.put('/items/:id', async (req, res) => {
      const id = req.params.id;
      const updatedItem = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedItem
      }
      const result = await itemsCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    });
  } finally {

  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World! Its for CRUD Operations')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})