// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category --- One to One
Product.belongsTo(Category,
  {
    foreignKey: 'category_id',
  });

// Categories have many Products --- One to Many
Category.hasMany(Product, 
  {
    foreignKey: 'category_id',
    onDelete: 'CASCADE'
  });
// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag,
  {
    through: {
      model: ProductTag,
      unique: false
    },
    as: 'product_tags'
  });

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product,
  {
    through: {
      model: ProductTag,
      unique: false
    },
    as: 'tags-to-product'
  })

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
