const express = require("express");
const Storage = require("./modules/db.js");
const server = express();
const PORT = 8080;

server.use(express.json());
server.use(express.static("public"));

const db = new Storage();

server.post("/login", async (req, res)=>{
    let user = req.body.username;
    let pass = req.body.password;
    let role = req.body.role;
    
    let userFound = await db.checkUser(user, pass, role);
    console.log(userFound);
    if(userFound.length > 0){
        if(userFound.length > 1){
            console.log("Database error, duplicates found!");
            console.log(userFound);
            res.status(500).end();
        } else {
            console.log(`Found ${userFound[0].user_id}`);
            res.status(200).json({id: userFound[0].user_id}).end();
        }
        
    } else {
        console.log("User not found");
        res.status(403).end();
    }
});

server.listen(PORT, ()=>{
    console.log(`Listening to ${PORT}`);
})

