const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'my_app',
    password: "mysql@11",
  });

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
}

app.get("/", (req, res) => {
    let q = "select count(*) from user";
    try{
      connection.query(q, (err, result) => {
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", { count });
      })
    } catch (err){
      res.send("Some error in database");
    };
})

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try{
    connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("user.ejs", { users });
    })
  } catch (err){
    res.send("Some error in database");
  };
});

app.get("/user/:id/edit", (req, res) => {
  let id = req.params
  res.render("edit.ejs");
});

app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
});

// let q = "INSERT INTO user (id, username, email, password) values (?, ?, ?, ?)";
// let data = [3056, "newuser", "newuser@yahoo.in", "gvaen$agrijf@6630"];
//   try{
//     connection.query(q, data, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//     })
//   } catch (err){
//     console.log(err);
//   };
//   connection.end();

