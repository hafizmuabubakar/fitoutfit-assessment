const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@mean.01zg0zw.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


app.use(express.json());

app.use(routes)

app.listen(port, async () => {
  await client.connect();
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  console.log(`Server is running on port ${port}`);
});
