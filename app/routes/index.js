const auth                  = require('./auth')
const locker                = require('./locker')
const product               = require('./product')
const matrixElement         = require('./matrixElement')
const order                 = require('./order')
const user                  = require('./user')
const status                = require('./status')
const vendingMachine        = require('./vendingMachine')
const productCategory       = require('./productCategory')
const producer              = require('./producer')
const city                  = require('./city')

module.exports = {
    auth,
    locker,
    product,
    matrixElement,
    order,
    user,
    status,
    vendingMachine,
    productCategory,
    producer,
    city
}