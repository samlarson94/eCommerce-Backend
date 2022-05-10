const router = require('express').Router();
const { Category, Product, Tag } = require('../../models');
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
    const singleCategory = await Category.findByPk(req.params.id, {
    });

    if (!singleCategory) {
      res.status(400).json({message: "No category found with this ID."});
      return;
    }
    res.status(200).json(singleCategory);
      
    }catch{
      res.status(500).json(err);
      console.log("Something went wrong")
  }
});

router.post('/', async (req, res) => {
  // create a new category
 Category.create(req.body)
 .then((category) => {
   if (req.body.id.length) {
     const categoryIdArr = req.body.id.map((category_id) => {
       return {
         category_id: category.id,
       };
     });
     return Category.bulkCreate(categoryIdArr);

   }
   res.status(200).json(category);
 })
.then((categoryIds) => res.status(200).json(categoryIds))
.catch((err) => {
  console.log(err);
  res.status(400).json(err);
});
});

// ===== WORK FROM HERE =======
router.put('/:id', (req, res) => {
  // update a category by its `id` value
  //Create new 
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
})});

//Delete existing ID Review this section
const categoryToRemove = categoryIds
.filter(({id}) => !req.body.id.includes(id))
.map(({ id }) => id);

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
