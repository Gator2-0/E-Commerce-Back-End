const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

//Get all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag, as: 'productIds'}]
    });
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get one tag by id
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      
      include: [{model: Product, through: ProductTag, as: 'productIds'}]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!'});
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
   /* req.body should look like this...
    {
      tag_name: "white-red",
      productIds: [1, 2, 3, 4]
    }
  */
 try {
  const tagData = await Tag.create(req.body);
  console.log("req.body.productIds.length");
  console.log(req.body.productIds.length);

    if(req.body.productIds.length){
      console.log("in If statement");
      const productTagIdArr = req.body.productIds.map((product_id) => {
        return {
          product_id,
          tag_id: tagData.id,
        };
      });
      console.log(productTagIdArr);
      ProductTag.bulkCreate(productTagIdArr);
    }
  res.status(200).json(tagData);

 } catch (err) {
  res.status(400).json(err);
 }
});

// update a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try{
    const tagData = await Tag.update(req.body, {
     where: {
        id: req.params.id,
      },
    })
    const productTags = ProductTag.findAll({ where: { tag_id: req.params.id } });
    const productTagIds = await productTags.map(({ product_id }) => product_id);
    const newProductTags = req.body.productIds
      .filter((product_id) => !productTagIds.includes(product_id))
      .map((product_id) => {
        return {
          product_id,
          tag_id: req.params.id,
        };
      });
    
    const productTagsToRemove = await productTags
      .filter(({ product_id }) => !req.body.productIds.includes(product_id))
      .map(({ id }) => id);

    if(productTagsToRemove.length){
      console.log('inside if statement')
      await ProductTag.destroy({ where: { id: productTagsToRemove } });
      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(tagData);
  }
  catch(err){
    console.log(err);
    res.status(400).json(err);
  }

});

// delete on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag with this id!'});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
