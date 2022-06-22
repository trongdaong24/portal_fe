import axios from "axios";

const client = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json"
  }
});

client.test = function() {
  console.log("test");
};

export default client;
