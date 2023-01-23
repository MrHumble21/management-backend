import moment from "moment/moment.js";
import { Sequelize, Op, Model, DataTypes } from "sequelize";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "path/to/database.sqlite",
  // logging: console.log,
});

try {
  await sequelize.authenticate();
  // console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Valid
class User extends Model {
  otherPublicField;
}

export const CreateUser = User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    confirmedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLoginTime: {
      type: DataTypes.STRING,
      defaultValue: moment().format("MMMM Do YYYY, h:mm:ss a"),
      allowNull: false,
    },
  },
  {
    sequelize,

    // don't forget to enable timestamps!
    timestamps: true,

    // I don't want createdAt
    createdAt: true,

    // I want updatedAt to actually be called updateTimestamp
    updatedAt: "updateTimestamp",
  }
);

// const user = new User({
//   name: "Abdulboriy",
//   surname: "Malikov",
//   email: "abdulboriy@gmail.com",
//   status: false,
// });

// const user2 = new User({
//   name: "Solixa",
//   surname: "Abdurasulova",
//   email: "solixa@gmail.com",
//   status: false,
// });

// user.save();
// user2.save();
await User.sync();
