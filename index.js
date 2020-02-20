const express = require('express')
const app = express()
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./models/user");
var Message = require("./models/Message");
var cors = require('cors');
var jwt = require("jsonwebtoken");
var port = process.env.PORT || 3000;
var jwtSecret = "some secret"
//
function toStringArray(array) {
  arr =[];
  for( i = 0; i<array.length; i++) {
      arr[i]= String(array[i].phoneNumber);
  }
  return arr;
}

function createToken(user) {
  return jwt.sign(
    { id: user._id, Name: user.Name, phoneNumber: user.phoneNumber , Gender: user.Gender , BirthDate: user.BirthDate },
    jwtSecret,
    {
      expiresIn: 86400 // 86400 expires in 24 hours
    }
  );
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

app.post('/login', function (req, res) {

  User.findOne({ phoneNumber: req.body.phoneNumber }, (err, user) => {
    if (user) {
      User.updateOne({ phoneNumber: { $eq: req.body.phoneNumber } }, req.body, (err, data) => {
        if(data){
          return res.status(201).json( {token : createToken(data)});
        }
        if (err) {
          return res.status(400).json({ msg: err });
        }
      });
    }
    else{
      let newuser = User(req.body);
      newuser.save((err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ msg: err });
        }
        console.log(user);
        return res.status(201).json( {token : createToken(user)});
      });
    }
    if (err) {
      return res.status(400).json({ msg: err });
    }

  });
  

  })
app.get('/numbers', function (req, res) {
    User.find({},{ phoneNumber: 1,'_id': false },  (err, user) => {
      if (user) {
        return res.status(201).json(toStringArray(user));
      }
    });
})


app.get('/messages/:from/:to', function (req, res) {

  if (req.params.to && req.params.from) {
    to = req.params.to;
    from = req.params.from;
    q1 = {
      $and: [{ to: { $eq: to } }, { from: { $eq: from } }]
    };
    q2 = {
      $and: [{ to: { $eq: from } }, { from: { $eq: to } }]
    };

    query = { $or: [q1, q2] };

    Message.find(query, (err, messages) => {
      if (messages) {
        console.log(messages);
        return res.status(201).json(messages);
      }
    });
  } else {
    return res.status(400).json({ msg: " invalid query attempted" });
  }
})

app.get('/', function (req, res) {
      return res.status(201).json("API Working");
})

app.get('/users', function (req, res) {
  User.find({}, (err, users) => {
    if (users) {
      return res.status(201).json(users);
    }
  });
})







app.listen(port);