const express = require("express");
const app = express();

const PORT = 3000;
const HOST = "127.0.0.1";

//static file serve
app.use(express.static("public/"));

// req.body
app.use(express.urlencoded({ extended: true }));

// db connection
var connection = require("./config/db");

var multer = require("multer");


const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
 
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage ,  limits: { fileSize: 2 * 1024 * 1024 },});

app.get("/", (req, res) => {
  res.render("Job_application_form.ejs");
});

app.post("/saveform", upload.single("userresume"), async (req, res) => {
try{
  const { username, useremail, usermobile,position } = req.body;




  var sql = `insert  into jobapplication (username,useremail,usermobile,position,userresume) values('${username}','${useremail}','${usermobile}','${position}','${req.file.filename}')`;
  console.log(sql);
  await connection.execute(sql);
  res.redirect('/applicationdata')

}
catch(err)
{
 console.log(err);
 console.log("data insrt failed");
}

});



app.get('/applicationdata', async (req, res) => {


    try {

        var sql = `select * from jobapplication`;
        const [result] = await connection.execute(sql);
        console.log(result)

        const obj = { data: result }
        res.render('applicationdata.ejs', obj);

        console.log("Data Fetched Successfully..")


    } catch (err) {
        console.log(err);
        console.log("Data faild to fetch..")
        return;
    }
})

app.get('/delete/:id', async (req, res) => {

    try {

        var id = req.params.id;

        var sql = `delete from jobapplication where user_id='${id}'`;
        await connection.execute(sql);
        // res.send("<h1>Deleted...</h1>" + id)


        res.redirect('/applicationdata')


    } catch (err) {
        console.log(err)
        console.log("Faild to Delete Products")
    }


})


app.get('/edit/:id', async (req, res) => {

    try {
        var id = req.params.id;
        console.log(id);

        var sql = `select * from jobapplication where user_id='${id}'`

        //execute method return-  [rows,fileds]
        const [result] = await connection.execute(sql);
        console.log(result[0])


        const obj = { data: result[0] }

        res.render('UpdateForm.ejs', obj)
        // res.send("EDit Product" + id);


    } catch (err) {
        console.log(err)
        console.log("Data faild to fetched ....Edit User")
    }
})


app.post('/updateform', upload.single("userresume"),async (req, res) => {


    try {

      const { username,useremail, usermobile,position,user_id } = req.body;
        console.log("req.file.filename",req.file);


     if (req.file && req.file.filename) {
            const sql = `UPDATE jobapplication
                         SET userresume = ?
                         WHERE user_id = ?`;
            await connection.execute(sql, [req.file.filename, user_id]);
        }

        // Update other fields
        const sql2 = `UPDATE jobapplication
                      SET username = ?,
                          useremail = ?,
                          usermobile = ?,
                          position = ?
                      WHERE user_id = ?`;
        await connection.execute(sql2, [username, useremail, usermobile, position, user_id]);

        // res.send("Updated .....")

        res.redirect('/applicationdata')

    } catch (err) {
        console.log(err)
        console.log("Faild to update product data")
    }
})




app.listen(PORT, HOST, () => {
  console.log("Server is Up");
});
