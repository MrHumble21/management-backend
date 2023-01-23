import express from "express";
import { Op } from "sequelize";
import { CreateUser } from "./db/db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
// middile wares
import  cors  from "cors";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

app.use(cors());
//  routes

var whitelist = ['https://front-i.vercel.app/', 'https://front-i.vercel.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// test route
app.get("/", function (req, res) {
  console.log("request came");
  res.json({ connection: "Assalamu Alaykum My dear Brother or Sister Welcome to Users management system" });
});

// create user route
app.post("/create_user", async function (req, res) {
  try {
    console.log('kirdi')
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      time: Date(),
      userId: req.body.id,
    };

    const token = jwt.sign(data, jwtSecretKey);
    console.log(token);
    let newUser = CreateUser.create(req.body);
    (await newUser).save();
    CreateUser.sync();
    console.log("user created");
    res.json({ response: "user has been created successfully" });
  } catch (error) {
    console.log(error);
  }
});



// login user
app.post("/login", async (req, res) => {
  // console.log(req.body);
 try {
  let login = await CreateUser.findOne({
    where: { email: req.body.values.email },
  });
  if (
    login.dataValues.email === req.body.values.email &&
    login.dataValues.password === req.body.values.password
  ) {
    if (login.dataValues.status === false) {
      res.sendStatus(200);
    } else if (login.dataValues.status === true) {
      res.sendStatus(401)
    }
  } else {
    res.sendStatus(404);
  }
 } catch (error) {
  res.send(400)
 }
});

// delete user
app.post("/delete_user", async function (req, res) {
  res.json({ response: "user has been deleted successfully" });
  try {
    CreateUser.destroy({
      where: {
        id: {
          [Op.or]: [req.body.id],
        },
      },
    });
    console.log("deleted");
  } catch (error) {
    console.log(error);
  }
});

// delete selected users
app.post("/delete_selected_users", async function (req, res) {
  res.json({ response: "selected users has been deleted successfully" });
  try {
    CreateUser.destroy({
      where: {
        id: {
          [Op.or]: [req.body.selectedUsers],
        },
      },
    });
    console.log("selected users has been deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// delete all users
app.post("/delete_all", async function (req, res) {
  res.json({ response: "all users have been deleted successfully" });
  try {
    CreateUser.destroy({ where: {}, truncate: true });
    console.log("all users has been deleted successfully");
  } catch (error) {
    console.log(error);
  }
});

// block user
app.post("/block_user", async function (req, res) {
  res.json({ response: "user has been blocked successfully" });
  const user = await CreateUser.findOne({ where: { id: req.body.id } });
  // Change everyone without a last name to "Doe"
  await CreateUser.update(
    { status: !user.dataValues.status },
    {
      where: {
        id: req.body.id,
      },
    }
  );
  console.log(user.dataValues);
});

// fetch all users
app.get("/all_users", async function (req, res) {
  const users = await CreateUser.findAll();
  res.json(JSON.stringify(users, null, 2));
});

// start server
app.listen(8080, () => {
  console.log("app listening on port 8080");
});
