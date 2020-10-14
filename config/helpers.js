const Mysqli = require('mysqli');

let conn = new Mysqli({
    host: 'localhost',
    post: 3306,
    user: 'shop',
    passwd: '12345',
    db: 'online_shop'
})
let db = conn.emit(false, '');

module.exports = {
    database: db
};
