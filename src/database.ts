import mongoose, {ConnectOptions} from "mongoose";
mongoose
  .connect("mongodb://localhost:27017/jwt-tutorial", {
    autoIndex: true,
  } as ConnectOptions)
  .then( async (db) => {
    console.log("Database Server Connected Successfuly.");
  })
  .catch((err) => {
    console.log("Error Connectiong to the Database::", err);
  });