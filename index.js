const express = require('express')
const app = express()
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/user");
var cors = require('cors');

//
function toStringArray(array) {
  arr =[];
  for( i = 0; i<array.length; i++) {
      arr[i]= String(array[i].phoneNumber);
  }
  return arr;
}

mongoose.connect('mongodb://vijay18399:dilse18399@ds351428.mlab.com:51428/users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });


  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("MongoDB database connection established successfully!");
  });
  
  connection.on("error", err => {
    console.log(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    process.exit();
  });


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/create_user', function (req, res) {
    let newuser = User(req.body);
    newuser.save((err, user) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ msg: err });
      }
      console.log(user);
      return res.status(201).json(user);
    });
  })
app.get('/numbers', function (req, res) {
    User.find({},{ phoneNumber: 1,'_id': false },  (err, user) => {
      if (user) {
        return res.status(201).json(toStringArray(user));
      }
    });
})

app.get('/users', function (req, res) {
  User.find({}, (err, users) => {
    if (users) {
      return res.status(201).json(users);
    }
  });
})







app.listen(3000)