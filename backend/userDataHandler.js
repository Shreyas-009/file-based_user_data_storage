const fs = require("fs");

const USER_FILE = "users.json";

// Function to read existing users
function readUsers() {
  try {
    const data = fs.readFileSync(USER_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

// Function to save users
function saveUsers(users) {
  fs.writeFileSync(USER_FILE, JSON.stringify(users, null, 2));
}

// Function to add a new user
function addUser(user) {
  const users = readUsers();

  const exist = users.find((savedUser)=> savedUser.email === user.email)
  if(exist){
    console.log("User already exists!");
    return false;
  }
  
  users.push(user);
  saveUsers(users);
  console.log("User has been saved!");
  return true;
}

// Function to find a user by username and password
function findUser(email, password) {
  const users = readUsers();
  return users.find(
    (user) => user.email === email && user.password === password
  );
}

module.exports = { addUser, findUser };
