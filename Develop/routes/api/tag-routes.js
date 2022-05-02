const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//TROUBLESHOOT PRODUCT DATA INCLUSIONS

router.get('/', async (req, res) => {
  // find all tags
  try {
    const tagData = await Tag.findAll( 
    //   {
    //   include: [{model: Product, through: ProductTag, as: "product_tags" }]
    // }
    );
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
    //   {
    //   // include: [{ model: Tag, through: ProductTag, as: 'product_tags'}]
    //   // INCLUDE PRODUCT DATA
    // }
    );

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
  Tag.create(req.body)
  .then((tag) => {
    res.status(200).json(tag);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    //Find all associated tags from ProductTag
    return ProductTag.findAll({where: {product_id: req.params.id }});
  })
  .then((singleTags) => {
    //get list of current tag_ids
    const singleTags = singleTags.map(({ tag_id }) => tag_id);
    //create filtered list of new tag_ids
    const newTags = req.body.tagIds
    .filter((tag_id) => !productTagIds.includes(tag_id))
    .map((tag_id) => {
      return {
        product_id: req.params.id,
        tag_id,
      };
    });
    //Figure out which ones to remove
    const tagsToRemove = singleTags
    .filter(({tag_id}) => !req.body.tagIds.includes(tag_id))
    .map(({ id }) => id);

    //Run both actions
    return Tag.findAll([
      Tag.destroy({ where: {id: tagsToRemove }}),
      Tag.bulkCreate(newTags),
    ]);
  })

  .then((updatedTags) => res.json(updatedTags))
  .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
