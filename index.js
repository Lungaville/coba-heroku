const express = require('express')
const app = express()
const db = require('./db/db')
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads");
    },
    filename: (req, file, callback) => {
        const filename = file.originalname.split(".");
        const extension = filename[1];
        callback(null, Date.now() + "." + extension);
    }
});
const upload = multer({
    storage: storage
});

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())


app.post("/register", upload.single("propic"), async function (req, res) {
    // const pp = ;
    // console.log(req.file);
    // if(req.file){

    // }

    const conn = await db.getConnection()
    try {

        const result = await db.executeQuery(conn, `insert into user values(NULL, '${req.body.username}' ,'${req.body.password}',NULL,'${req.file.filename}' )`)
        conn.release()
        if (result) {
            return res.json(`Inserted id ${result.insertId}`)
        }
    } catch (error) {
        conn.release()
        return res.json(error)

    }
})

app.post("/login", async function (req, res) {
    console.log(req.body);
    const conn = await db.getConnection()
    try {
        const result = await db.executeQuery(conn, `select * from user where username = '${req.body.username}'and password= '${req.body.password}' )`)
        if (result.length > 0) {
            let user = result[0]
            delete user.password;
            var token = jwt.sign(user, process.env.SECRET_JWT);
            const updateToken = await db.executeQuery(conn, `update user set token = ${token} where id= ${result.id} )`)
            if (updateToken) {
                user.token = token;
                conn.release();
                return res.json(user)
            }
        }
    } catch (error) {
        conn.release()
        return res.json(error)
    }
})

app.listen(3000, function () {
    console.log("listening to port 3000")
})

