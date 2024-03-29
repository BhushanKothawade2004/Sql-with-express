const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require('uuid');

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
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
});

//ADD Route
app.get("/user/new", (req, res) => {
  res.render("new.ejs")
});

//Post Route
app.post("/user", (req, res) => {
  let {username, email, password} = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}', '${username}', '${email}', '${password}')`;
  try{
    connection.query(q, (err, user) => {
      if(err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    res.send("some error in databse");
  }
});

app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try{
    connection.query(q, (err, users) => {
      if(err) throw err;
      res.render("user.ejs", { users });
    });
  } catch (err){
    res.send("Some error in database");
  };
});

app.get("/user/:id/edit", (req, res) => {
  let id = req.params.id;
  console.log(id)
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    })
  } catch (err){
    res.send("Some error in database");
  };
});

//update Route
app.patch("/user/:id", (req, res) => {
  let id = req.params.id;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user where id='${id}'`
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if (formPass != user.password) {
          res.send("Wrong Password")
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/");
        });
      }
    });
  } catch (err){
    res.send("Some error in database");
  };
});

//delete route
app.get("/user/:id/delete", (req, res) => {
  let id = req.params.id;
  let q = `SELECT * FROM user WHERE id='${id}'`;
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0]
      res.render("delete.ejs", { user });
    }); 
  } catch (err){
    res.send("Some error in database");
  };
}) 

app.delete("/user/:id", (req, res) => { 
  let id = req.params.id;
  let{password, email} = req.body;
  let q = `SELECT * FROM user where id='${id}'`
  try{
    connection.query(q, (err, result) => {
      if(err) throw err;
      let user = result[0];
      if(password !== user.password || email !== user.email) {
        res.send("Wrong Password");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
          if(err) throw err;
          res.redirect("/user");
        })
      }
    })
  } catch (err){
    res.send("Some error in database");
  };
})

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

 