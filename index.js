//use path module
const path = require('path');
//use express module
const express = require('express');
//use hbs view engine
const hbs = require('hbs');
//use bodyParser middleware
const bodyParser = require('body-parser');
//use mysql database
const mysql = require('mysql');
const app = express(); 
//Create Connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'crud_db'
});
//connect to database
conn.connect((err) =>{
  if(err) throw err;
  console.log('Mysql Connected...');
});
//set views file
app.set('views',path.join(__dirname,'views'));
//set view engine
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//set folder public as static folder for static file
app.use('/assets',express.static(__dirname + '/public'));
// this is the line that generates the error
hbs.registerPartials(__dirname + '/views/partials');
//route for homepage
app.get('/',(req, res) => {
  let sql = "SELECT * FROM product";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product_view',{
      results: results
    });
  });
});
//----------------------------------MODUL PRODUK--------------------------------------------------
//route for insert data
app.post('/save',(req, res) => {
  let data = {product_name: req.body.product_name, product_price: req.body.product_price};
  let sql = "INSERT INTO product SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
//route for update data
app.post('/update',(req, res) => {
  let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
//route for delete data
app.post('/delete',(req, res) => {
  let sql = "DELETE FROM product WHERE product_id="+req.body.product_id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/');
  });
});
//route for profil
app.get('/profil',(req, res) => {
  res.render('profil_view');
});
//route for gallery
app.get('/gallery',(req, res) => {
  res.render('gallery_view'); 
}); 
//----------------------------------MODUL KATEGOORI--------------------------------------------------
//route for kategori
app.get('/kategori',(req, res) => {
  let sql = "SELECT * FROM kategori";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('kategori_view',{
      results: results
    });
  });
});
//route for save kategori
app.post('/save_Kategori',(req, res)=>{ 
  let data = {nama: req.body.nama, kode_kat: req.body.kode_kat};
  let sql = "INSERT INTO kategori SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/kategori');
  });
});
//route for update kategori
app.post('/update_kategori',(req,res)=>{
  let sql = "UPDATE kategori SET kode_kat='"+req.body.kode_kat+"', nama='"+req.body.nama+"' WHERE id="+req.body.id;
  let query = conn.query(sql,(err, results)=>{
    if (err) throw err;
      res.redirect('/kategori');
  });
});
//route for delete_kategori
app.post('/delete_kategori',(req, res) => {
  let sql = "DELETE FROM kategori WHERE id="+req.body.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/kategori');
  });
});
//----------------------------------MODUL CUSTOMER--------------------------------------------------
//route for customer
app.get('/customer',(req, res) => { 
  let sql = "SELECT * FROM customer";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('customer_view',{
      results: results
    });
  });
});
//route for save customer
app.post('/save_customer',(req, res)=>{ 
  let data = {
    nama: req.body.nama, 
    alamat: req.body.alamat,  
    notlp: req.body.notlp,
    nohp: req.body.nohp,
    pos: req.body.pos
  };
  let sql = "INSERT INTO customer SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/customer');
  });
});
//route for update customer
app.post('/update_customer',(req,res)=>{
  let sql = "UPDATE customer SET alamat='"+req.body.alamat+"', notlp='"+req.body.notlp+"', nohp='"+req.body.nohp+"', pos='"+req.body.pos+"', nama='"+req.body.nama+"' WHERE id="+req.body.id;
  let query = conn.query(sql,(err, results)=>{
    if (err) throw err;
      res.redirect('/customer');
  });
});
//route for delete_customer
app.post('/delete_customer',(req, res) => {
  let sql = "DELETE FROM customer WHERE id="+req.body.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/customer');
  });
});
//----------------------------------MODUL PENJUALAN--------------------------------------------------
//route for Penjualan
app.get('/penjualan',(req, res) => { 
  var moment = require('moment');
  let sql = "SELECT penjualan.id, customer.nama as customer, product.product_name as produk, kategori.kode_kat as kode, kategori.nama as kategori, product.product_price as harga, penjualan.qty, penjualan.total, penjualan.tanggal FROM penjualan INNER JOIN kategori ON penjualan.kategori = kategori.id INNER JOIN customer ON penjualan.customer = customer.id INNER JOIN product ON penjualan.prodauct = product.product_id";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('penjualan_view',{
      results: results
    });
  });
});
// filterKategori
app.post('/filterKategori',(req, res)=>{
   let sql = "SELECT kode_kat, nama as kategori FROM kategori";
   let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('/penjualan_view');
  });
});
//route for save Penjualan
app.post('/save_Penjualan',(req, res)=>{ 
  let data = {
    nama: req.body.nama, 
    alamat: req.body.alamat,  
    notlp: req.body.notlp,
    nohp: req.body.nohp,
    pos: req.body.pos
  };
  let sql = "INSERT INTO Penjualan SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/Penjualan');
  });
});
//route for update Penjualan
app.post('/update_Penjualan',(req,res)=>{
  let sql = "UPDATE Penjualan SET alamat='"+req.body.alamat+"', notlp='"+req.body.notlp+"', nohp='"+req.body.nohp+"', pos='"+req.body.pos+"', nama='"+req.body.nama+"' WHERE id="+req.body.id;
  let query = conn.query(sql,(err, results)=>{
    if (err) throw err;
      res.redirect('/Penjualan');
  });
});
//route for delete_Penjualan
app.post('/delete_Penjualan',(req, res) => {
  let sql = "DELETE FROM Penjualan WHERE id="+req.body.id+"";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/Penjualan');
  });
});

//server listening
app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
