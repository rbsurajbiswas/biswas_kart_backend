const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers')

/* GET ALL ORDERS */
router.get('/', (req, res) => {
  database.table('orders_details as od')
      .join([
        {
          table: 'orders as o',
          on: 'o.id = od.order_id'
        },
        {
          table: 'products as p',
          on: 'p.id = od.product_id'
        },
        {
          table: 'users as u',
          on: 'u.id = o.user_id'
        }
      ])
      .withFields(['o.id','p.title as name','p.description','p.price','u.username'])
      .sort({id: 1})
      .getAll()
      .then(orders =>{
        if (orders.length > 0) {
          res.status(200).json(orders);
        }
        else {
          res.json({message: 'No Orders Found'})
        }
      }).catch(err => console.log(err));
});

/* GET SINGLE ORDER */
router.get('/:id', (req, res) => {

  const orderId = req.params.id;



  database.table('orders_details as od')
      .join([
          {
              table: 'orders as o',
              on: 'o.id = od.order_id'
          },
          {
              table: 'products as p',
              on: 'p.id = od.product_id'
          },
          {
              table: 'users as u',
              on: 'u.id = o.user_id'
          }
      ])
      .withFields(['o.id', 'p.title as name', 'p.description', 'p.price', 'u.username', 'p.image', 'od.quantity as quantityOrdered'])
      .filter({'o.id': orderId})
      .getAll()
      .then(orders =>{
        if (orders.length > 0) {
          res.status(200).json(orders);
        }
        else {
          res.json({message: `No Order Found With Orders id ${orderId}`})
        }
      }).catch(err => console.log(err));
});

/* PLACE A NEW ORDER */
router.post('/newOrder', (req, res) => {

  let {userId, products} = req.body;

  if (userId !== null && userId >0 && !isNaN(userId))
  {
    database.table('orders')
        .insert({
          user_id: userId
        }).then(newOrderId => {

          if (newOrderId > 0) {
            products.forEach(async (p) => {
              let data = await database.table('products')
                  .filter({id: p.id})
                  .withFields(['quantity'])
                  .get();

              let incart = parseInt(p.incart);


              //reduce the pieces ordered from the quantity column in database

              if (data.quantity > 0) {
                data.quantity = data.quantity - incart;

                if (data.quantity < 0) {
                  data.quantity = 0;
                }

              }
              else {
                data.quantity = 0;
              }

              // Insert order details

              database.table('orders_details')
                  .insert({
                    order_id: newOrderId,
                    product_id: p.id,
                    quantity: incart
                  }).then( () => {
                    database.table('products')
                        .filter({id: p.id})
                        .update({
                          quantity: data.quantity
                        }).then(() => {}).catch(err => console.log(err))
              }).catch(err => console.log(err))
            });
          }
          else {
            res.json({message: 'New Order Failed While Adding Order Details', success: false})
          }
          res.json({
            message: `Order Successfully Placed With Order id ${newOrderId}`,
            success: true,
            order_id: newOrderId,
            products: products
          });

    }).catch(err => console.log(err))
  }
  else {
    res.json({message: 'New Order Failed', success: false});
  }

});

/* PAYMENT */
router.post('/payment', (req, res) => {
  setTimeout(() => {
    res.status(200).json({success: true});
  }, 3000);
});


module.exports = router;