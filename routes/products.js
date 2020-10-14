const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');

/* GET ALL PRODUCTS */
router.get('/', function(req, res) {

    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // CURRENT PAGE NUMBER
    const Limit = (req.query.Limit !== undefined && req.query.Limt !== 0) ? req.query.limit : 12; // ITEM LIMIT PER PAGE

    let startValue;
    let endValue;


    if (page > 0) {
        startValue = (page * Limit) - Limit;
        endValue = page * Limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
          'p.title as name',
          'p.price',
          'p.quantity',
          'p.description',
          'p.image',
          'p.id'
      ])
      .slice(startValue, endValue)
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0){
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: 'NO Products Found'})
        }
      }).catch(err => console.log(err));



});

/*GET SINGLE PRODUCT */
router.get('/:prodId', (req, res) => {

  let productId = req.params.prodId;



  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.images',
        'p.id'
      ])
      .filter({'p.id': productId})
      .get()
      .then(prod => {
        if (prod){
          res.status(200).json(prod);
        } else {
          res.json({message: `NO Product Found With Product id ${productId}`})
        }
      }).catch(err => console.log(err));




});

/*GET ALL PRODUCTS FROM A PERTICULAR CATEGORY */
router.get('/category/:catName', (req, res) =>{


  let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; // CURRENT PAGE NUMBER
  const Limit = (req.query.Limit !== undefined && req.query.Limt !== 0) ? req.query.limit : 10; // ITEM LIMIT PER PAGE

  let startValue;
  let endValue;
  let categoryName = req.params.catName;


  if(page > 0) {
    startValue = (page * Limit) - Limit;
    endValue = page * Limit;
  }
  else {
    startValue = 0;
    endValue = 10;
  }

  database.table('products as p')
      .join([{
        table: 'categories as c',
        on: 'c.id = p.cat_id'
      }])
      .withFields(['c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.id'
      ])
      .slice(startValue, endValue)
      .filter({'c.title': categoryName})
      .sort({id: .1})
      .getAll()
      .then(prods => {
        if (prods.length > 0){
          res.status(200).json({
            count: prods.length,
            products: prods
          });
        } else {
          res.json({message: 'NO Products Found'})
        }
      }).catch(err => console.log(err));



});

module.exports = router;
