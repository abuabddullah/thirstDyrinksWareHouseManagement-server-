const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken');


const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("ThirstyDrinksDB").collection("items");
    console.log("Connected to MongoDB");
    


    // get all items from db as per pagination
    app.get('/items', async (req, res) => {
      const currentPage = parseInt(req.query.currentPage);
      const perPageProducts = parseInt(req.query.perPageProducts);
      const query = {};
      const cursor = itemsCollection.find(query);
      let items;
      if (currentPage || perPageProducts) {
        items = await cursor.skip(currentPage * perPageProducts).limit(perPageProducts).toArray();
      } else {
        items = await cursor.toArray();
      }
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


    // delete an item by id in db
    app.delete('/items/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });



    // generating decoded mail-token during login
    app.post('/login', async (req, res) => {
      const email = req.body;
      const accessToken = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
      res.send({ accessToken });
    });



    // allowing data to get asper email
    app.get('/myItems', async (req, res) => {
      const tokenInfo = req.headers.authorization;

      const [email, accessToken] = tokenInfo.split(' ');


      const decodedEmail = verifyToken(accessToken);

      if (email === decodedEmail) {
        const query = { email: email };
        const cursor = itemsCollection.find(query);
        const results = await cursor.toArray();
        res.send(results);
      } else {
        res.send({ error: '403 ! Access Forbidden' });
      }
    })


    // verifying access token with decoded token
    function verifyToken(accessToken) {
      let email;
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (error, decoded) {
        if (error) {
          email = 'invalid email';
        } else if (decoded) {
          email = decoded.email;
        }
      })
      return email;
    }



    /**
     * blogs related APIs
     */



    const blogsCollection = client.db("ThirstyDrinksDB").collection("blogs");


    // POST new blog to db
    app.post('/blogs', async (req, res) => {
      const newBlog = req.body;
      const tokenInfo = req.headers.authorization;
      const [email, accessToken] = tokenInfo.split(' ');
      const decodedEmail = verifyToken(accessToken);
      if (email === decodedEmail) {
        const result = await blogsCollection.insertOne(newBlog);
        res.send(result);
      } else {
        res.send({ error: '403 ! Access Forbidden' });
      }
    });



    // get all items from db
    app.get('/blogs', async (req, res) => {
      const query = {};
      const cursor = blogsCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
    });


    // get single blog by id from db
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await blogsCollection.findOne(query);
      res.send(result);
      // res.send("get single item");
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