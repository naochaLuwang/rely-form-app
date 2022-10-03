import dynamic from "next/dynamic";

const connection = {};

const connect = async () => {
  const mongoose = (await import("mongoose")).default;
  if (connection.isConnected) {
    console.log("Database already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;

    if (connection.isConnected === 1) {
      console.log("use previous connection");
      return;
    }
    await mongoose.disconnect();
  }

  const db = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("New database connection");
  connection.isConnected = db.connections[0].readyState;
};

const disconnect = async () => {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === "production") {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log("Not disconnected");
    }
  }
};

const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();

  return doc;
};

const db = { connect, disconnect, convertDocToObj };
export default db;
