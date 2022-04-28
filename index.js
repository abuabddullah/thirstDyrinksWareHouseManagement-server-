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
      // res.send(items);
      res.send("get all items");
    });


    // get no of cout of all items of db
    app.get('/itemsCount', async (req, res) => {
      const count = await itemsCollection.estimatedDocumentCount();
      // res.send({count});
      res.send("{itemsCount}");
    });


    // get single item by id from db
    app.get('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await itemsCollection.findOne(query);
      // res.send(item);
      res.send("get single item");
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