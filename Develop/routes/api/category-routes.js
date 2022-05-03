const router = require('express').Router();
const { Category, Product } = require('../../models');
const { restore } = require('../../models/Product');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll( {
      // include: [] --> Add Products
    });
    console.log("Get Route Retrieved Successfully");
    res.status(200).json(categoryData);
  }catch (err) {
    res.status(500).json(err);
    console.log("Something went wrong");
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  try {

  }
 
});

router.post('/', (req, res) => {
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
