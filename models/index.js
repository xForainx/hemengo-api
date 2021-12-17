const Locker = require('./Locker')
const Product = require('./Product')
const MatrixElement = require('./MatrixElement')
const Order = require('./Order')
const User = require('./User')
const Status = require('./Status')
const VendingMachine = require('./VendingMachine')
const ProductCategory = require('./ProductCategory')
const Producer = require('./Producer')
const City = require('./City')

/**
 * Locker ressource associations.
 * Example: a locker with productId 1 (aka tomatoes) at matrixElementId 1 (aka "A1" cell).
 */
Locker.belongsTo(Product)
Locker.belongsTo(MatrixElement)
//******************************************************************************


/**
 * Order ressource associations.
 * Example: an order with userId 1 (aka eric@mail.com) with a statusId 1 
 * (aka "confirmed"), that can be picked up at vendingMachineId 1 
 * (aka 3edacac4-c31e-4edf-83f2-2a515c0577b7 in "Bayonne"). The order id is matched
 * on join table level with products id 1, 2 and 5 (aka tomatoes, potatoes and apples).
 * When picking up an order, something reads the order's products, then it reads the 
 * vending machine's lockers and look for the ones with the requested product in it 
 * (product belongs to locker) and unlock it so the user can pickup product.
 */
Order.belongsTo(User)
Order.belongsTo(Status)
Order.belongsTo(VendingMachine)
// Create join table order_product with orders.id and products.id as FKs.
// One order can have many products (and each product is in one locker).
Order.belongsToMany(Product, { through: "order_product" })
//******************************************************************************


/**
 * Vending machine ressource associations.
 * Example: a vending machine with cityId 1 (aka in "Bayonne") and made
 * of lockers id 1, 2, 4 (aka locker "A1" with tomatoes in it (i.e productId), 
 * locker "B1" with apples, locker "D1" with honey).
 */
VendingMachine.belongsTo(City)
// Create join table vendingmachine_locker with vendingmachines.id and lockers.id as FKs.
// One vending machine has many lockers (and each locker has one product).
VendingMachine.belongsToMany(Locker, { through: "vendingmachine_locker" })
//******************************************************************************


/**
 * Product ressource associations.
 * Example: a product with productCategoryId 1 (aka "fruits"). Therefore one 
 * product can have only one category.
 */
Product.belongsTo(ProductCategory)
//******************************************************************************


/**
 * Producer ressource associations.
 * Example: a producer with cityId 1 (aka work in "Bayonne"), on join table level 
 * the producer id is matched with productCategoryId 1 (aka "fruits"), 
 * 2 (aka "honey") and 7 (aka "wine"), so this producer is a fruits, honey and 
 * wine productor.
 */
Producer.belongsTo(City)
// Create join table producer_productcategory with producers.id and productcategories.id as FKs.
// One producer can produce many kind of products (honey, fruits, vegetables...).
Producer.belongsToMany(ProductCategory, { through: "producer_productcategory" })
//******************************************************************************


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
