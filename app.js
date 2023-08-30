const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
const routes = require('./routes');

app.use(express.json());

app.use(routes)



mongoose.set("strictQuery", false)

mongoose
  .connect('mongodb+srv://admin:admin@mean.01zg0zw.mongodb.net/')
.then(() => {
    app.listen(port, ()=> {
        console.log('Node API App is running on on port 3000')
    })
    console.log('2 ====> Connected to mongoDB')
}).catch((error)=> {
    console.log(error)
})
