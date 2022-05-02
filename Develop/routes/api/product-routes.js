const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products --- TROUBLESHOOT ROUTE (SEQUALIZE EAGER LOADING ERROR)
router.get('/', async (req, res) => {
  // find all products
  try {
    const productData = await Product.findAll( {
      include: [{model: Tag, through: ProductTag, as: 'tags-to-product'}]
      //Add category data
    });
    console.log("Get Route Retrieved Successfully");
    res.status(200).json(productData);
  } catch(err) {
    res.status(500).json(err);
    console.log("Something went wrong");
  }
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const singleProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag, as: 'product_tags'}]
      // INCLUDE CATEGORY DATA
    });

    if (!singleProduct) {
      res.status(400).json({message: "No product found with this ID!"});
      return;
    }

    res.status(200).json(singleProduct);
  }catch (err){
    res.status(500).json(err);
    console.log("Something went wrong")
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
try {
  const singleProduct = await Product.destroy({
    where: {
      id: req.params.id
    }
  });

  if (!singleProduct) {
    res.status(400).json({message: 'No product found with this ID.'});
    return;
  };

  res.status(200).json(singleProduct)
  console.log("The product has been deleted.")
}catch (err) {
res.status(500).json(err);
}
});

module.exports = router;