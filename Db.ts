import getConfig from '../Config'
import mysql from 'mysql'

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'positive@1234',
    database        : 'printing_press'
})



pool.on('connect', client => {
  console.log('DB Connected')
})
pool.on('error', (err,client) => {
  console.log('Connection error',err)
})

class Mysql {
  static async getClient() {
    return await pool.getConnection((err, connection) => {
      if (err) throw err; connection.release(); 
      console.log('DB is connected'); 
 
 });
  }
  // static async getResult(query: string) {
  //   const client = await Mysql.getClient()
  //   try {
  //     const result = await client.query(query)
  //     return result.rows
  //   } catch (error) {
  //     throw error
  //   }
  //    finally{
  //     client.release()
  //    }
  // }
 

 
}


export default Mysql



