const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()


const app = express()
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())






// const uri = "mongodb+srv://ideal-CRUD-and-JWT:idealcrudandjwt123456789@cluster0.3negq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3negq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  console.log('Connected to database');
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});





app.get('/', (req, res) => {
    res.send('Hello World! Its for CRUD Operations')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})