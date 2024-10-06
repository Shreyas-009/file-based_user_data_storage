const express = require("express");
const app = express();
const Port = 8080;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const secret = "secret101";

const { addUser, findUser } = require("./userDataHandler");

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// server running check middleware
app.get("/", (req, res) => {
  res.send("server is working");
});

//register route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  console.log(username, email, password);
  const user = { username, email, password };
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const exist = addUser(user);


  if (!exist) {
    return res.status(409).json({ message: "User already exists" });
  }

  res.status(200).json({ data: user, message: "every thing works fine" });
});

//login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all the required fields" });
  }

  const user = findUser(email, password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res
    .status(200)
    .json({ data: jwt.sign(user, secret), message: "login sucessfull" });
});

app.post("/protected", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: "Aunautherized" });
    res.json({ message: "Access granted", user });
  });
});

// error handeling middlare
app.use("*", (req, res) => {
  res.send("Page Not Available");
});

app.listen(Port, (req, res) => {
  console.log(`Server is Running on Port : ${Port}`);
});
