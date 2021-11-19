const Locker                = require('./Locker')
const Product               = require('./Product')
const MatrixElement         = require('./MatrixElement')
const Order                 = require('./Order')
const User                  = require('./User')
const Status                = require('./Status')
const VendingMachine        = require('./VendingMachine')
const ProductCategory       = require('./ProductCategory')
const Producer              = require('./Producer')
const City                  = require('./City')

Locker.belongsTo(Product)
Locker.belongsTo(MatrixElement)

Order.belongsTo(User)
Order.belongsTo(Status)
Order.belongsTo(VendingMachine)

Product.belongsTo(ProductCategory)

Producer.belongsTo(City)

VendingMachine.belongsTo(City)

module.exports = {
    Locker,
    Product,
    MatrixElement,
    Order,
    User,
    Status,
    VendingMachine,
    ProductCategory,
    Producer,
    City
}
