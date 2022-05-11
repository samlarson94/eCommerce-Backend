const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll( 
      {
      include: [{model: Product, through: ProductTag,
        attributes: ['id', 'product_name', 'price', 'stock'],
    }]
  });
    console.log("Get Route Retrieved Successfully!")
    res.status(200).json(tagData);
  }catch (err) {
    res.status(500).json(err);
    console.log("Something went wrong");
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const singleTag = await Tag.findByPk(req.params.id, 
      {
      include: [{ model: Product, through: ProductTag, 
      attributes: ['id', 'product_name', 'price', 'stock'],
    }]
     
    });

    if (!singleTag) {
      res.status(400).json({message: "No tag found with this ID!"});
      return;
    }
    console.log("Get route found tag successfully!")
    res.status(200).json(singleTag);
  }catch (err){
    res.status(500).json(err);
    console.log("Something went wrong")
  }
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
  // create a new tag
  // req.body should look like this...
  // {
  //   "id":"2",
  //   "tag_name":"pop music"
  // }
  try {
    const tagData = await Tag.create(req.body);
    console.log("Post sent successfully!")
    res.status(200).json(tag);
  }catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
//   // update a tag's name by its `id` value
try {
  const tagInfo = await Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  });
  if (!tagInfo) {
    res.status(404).json({message: "No tag with this id!"});
    return;
  }
  console.log('Update completed successfully.')
  res.status(200).json(tagInfo);
} catch (err) {
console.log("Something went wrong.")
res.status(500).json(err);
}
});



router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const singleTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!singleTag) {
      res.status(400).json( {message: "No tag found with this ID."});
      return;
    };

    res.status(200).json(singleTag)
    console.log("The tag has been successfully deleted.")
  }catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
