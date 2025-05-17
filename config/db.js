var mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'test',
    password: '',
    port: 3306
})

const testconnection = async () => {
    try {
        const result = await pool.getConnection();
        // console.log(result)
        console.log("Connection Successfully")
    } catch (err) {
        console.log(err)
        console.log("Db Connection Faild")
        return;
    }

}

testconnection()


module.exports=pool;