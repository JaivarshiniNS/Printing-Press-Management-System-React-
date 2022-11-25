const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const _pathname = path.resolve();


app.listen(port, () => console.log(`Listening on port ${port}`));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
app.use(express.static(_pathname + '/productImage'))

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'printing_press'
})


// Login
app.post('/login', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        const payload = req.body.payload;
        connection.query(`SELECT * from cus_login where username='${payload.username}' AND password='${payload.password}'`, (err, rows) => {
            connection.release()
            if (rows.length > 0) {
                return res.send('Success')
            } else {
                return res.send('Invalid Login');
            }
        })
    })
})


// Add
app.post('/add_emp', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `INSERT INTO Employee_Details(EmployeeName,Emailid,Mobileno,Department,Designation,DOJ)
        VALUES('${params.emp_name}','${params.emp_mail}','${params.emp_mobileno}','${params.emp_department}','${params.designation}','${params.doj}')`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Added')
            } else {
                console.log(err)
                return res.send('NotAdded');
            }
        })
    })
});

//Update
app.post('/edit_emp', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `update Employee_Details SET EmployeeName='${params.emp_name}',Emailid='${params.emp_mail}',Mobileno='${params.emp_mobileno}',
        Department='${params.emp_department}',Designation='${params.designation}',DOJ='${params.doj}' where 	Employee_id=${params.emp_id}`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send("Updated")
            } else {
                return res.send('Server Error');
            }
        })
    })
});
//Get All EMployee
app.get('/get_emplist', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `select * from Employee_Details`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Get BY id
app.get('/get_list/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `select * from Employee_Details where Employee_id='${params}'`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Delete Employee
app.delete('/dlt_emp/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `Delete from Employee_Details where Employee_id=${params}`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Deleted');
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Get Category
app.get('/get_category', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `select * from product_category`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});


var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './productImage');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var resume =multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './Resume');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

var post = multer({
    storage: resume
});



app.post('/productdetails', upload.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err

            const sql = `Insert into product_image(filename,path)VALUES('${req.file.filename}','${req.file.path}')`;
            connection.query(sql, (err, rows) => {
                if (rows) {
                    const query1 = `SELECT * FROM product_image WHERE id= LAST_INSERT_ID()`;
                    connection.query(query1, (err, data) => {
                        connection.release()
                        if (data) {
                            return res.send(data);
                        }
                    })
                } else {
                    return res.send('Failed');
                }
            })
        })
    }
});

app.post('/postresume', post.single('image'), (req, res) => {
    if (!req.file) {
        console.log("No file upload");
    } else {
        pool.getConnection((err, connection) => {
            if (err) throw err

            const sql = `Insert into resume(filename,path)VALUES('${req.file.filename}','${req.file.path}')`;
            connection.query(sql, (err, rows) => {
                if (rows) {
                    const query1 = `SELECT * FROM resume WHERE id= LAST_INSERT_ID()`;
                    connection.query(query1, (err, data) => {
                        connection.release()
                        if (data) {
                            return res.send(data);
                        }
                    })
                } else {
                    return res.send('Failed');
                }
            })
        })
    }
});

//Get Purchase Details
app.get('/get_materiallist', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `select * from purchase_details`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//stock update
app.post('/edit_stock', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `update purchase_details SET Instock='${params.stock}' where id=${params.materialid}`
        connection.query(sql, (err, rows) => {
            console.log(sql);
            connection.release()
            if (rows) {
                return res.send("Updated")
            } else {
                return res.send('Server Error');
            }
        })
    })
});
//Add stock
app.post('/add_stock', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `INSERT INTO purchase_details(material_type,material_name,Instock)
        VALUES('${params.materialtype}','${params.materialname}','${params.stock}')`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Added')
            } else {
                console.log(err)
                return res.send('NotAdded');
            }
        })
    })
});

//Get ProductList
app.get('/get_productlist', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `select * from product_details`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Delete Product
app.delete('/dlt_product/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `Delete from product_details where id=${params}`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Deleted');
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Add Product
app.post('/add_prod', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `INSERT INTO product_details(category,product_name,descriptions,instock,price,GST,imageid,imagepath)
        VALUES('${params.category}','${params.productname}','${params.descriptions}','${params.instock}','${params.price}','${params.GST}','${params.imageid}','${params.imagepath}')`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Added')
            } else {
                console.log(err)
                return res.send('NotAdded');
            }
        })
    })
});

//Get product by ID
app.get('/get_prodlist/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `select * from product_details where id='${params}'`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Update Product
app.post('/edit_prod', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `update product_details SET category='${params.category}',product_name='${params.productname}',descriptions='${params.descriptions}',
        instock='${params.instock}',price='${params.price}',GST='${params.GST}',imageid='${params.imageid}',imagepath='${params.imagepath}' where 	id=${params.id}`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send("Updated")
            } else {
                return res.send('Server Error');
            }
        })
    })
});

app.get('/dashboarddetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err
        let temp = [];
        let data1;
        let data2;
        let data3;
        let data4;

        const sql = `SELECT  (
            SELECT COUNT(*)
            FROM   product_details
            ) AS count1,
            (
            SELECT COUNT(*)
            FROM   purchase_details
            ) AS count2,
            (
                SELECT COUNT(*)
                FROM   Employee_Details
                ) AS count3,
                (
                    SELECT COUNT(*)
                    FROM   order_details
                    ) AS count4
    FROM    dual`;

        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })

    })
});

//Get category based Product
app.post('/cat_prod', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `select * from product_details where category='${params}'`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                console.log(err)
                return res.send('Failed');
            }
        })
    })
});

//Checkout
app.post('/checkout', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload;
        const sql = `INSERT INTO order_details(product_id,product_name,quantity,username,mobileno,address,status,totalamount,cardno,cvv,expirydate,expiryyear)
        VALUES('${params.prodid}','${params.productname}','${params.quantity}','${params.username}','${params.mobile}',
        '${params.address}','${params.status}','${params.totalamount}','${params.cardno}','${params.cvv}','${params.expirydate}','${params.expiryyear}')`
        connection.query(sql, (err, rows) => {
            if (rows) {
                const query1 = `update product_details SET instock='${params.remainstock}' where id='${params.prodid}'`;
                connection.query(query1, (err, data) => {
                    connection.release()
                    if (data) {
                        return res.send('Added');
                    }
                })  
            } else {
                return res.send('NotAdded');
            }
        })
    })
});

//Job
app.post('/job', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `INSERT INTO applyjob(employeename,mobileno,emailid,degree,resumeid,resumepath)
        VALUES('${params.Empname}','${params.mobileno}','${params.emailid}','${params.Degree}','${params.resumeid}','${params.resumepath}')`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send('Added')
            } else {
                console.log(err)
                return res.send('NotAdded');
            }
        })
    })
});


//Get Resume
app.get('/getjob', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `select * from applyjob`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Order Status Update
app.post('/prod_status', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.body.payload
        const sql = `update order_details SET status='${params.status}' where order_id=${params.id}`
        console.log(sql);
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send("Updated")
            } else {
                return res.send('Server Error');
            }
        })
    })
});

//Get Order
app.get('/getorder', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err

        const params = req.params.id
        const sql = `select * from order_details`
        connection.query(sql, (err, rows) => {
            connection.release()
            if (rows) {
                return res.send(rows)
            } else {
                return res.send('Server Error');
            }
        })
    })
});


