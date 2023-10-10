const { createSuccessResponse, createErrorResponse } = require('../../response');
const API_URL = process.env.API_URL;
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger'); 

//// imports 
// router.post('/fragments', async (req, res, next) => {
//   //code...
//   }
  
//   module.exports = router;

module.exports = async (req, res) => {
  console.log(Buffer.isBuffer(req.body));
  if (!Buffer.isBuffer(req.body)) {
    res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
  } else {
    try {
      const myFragment = new Fragment({ ownerId: req.user, type: req.get('Content-Type') });

      logger.info('before save');
      await myFragment.save();
      logger.info('after save');

      await myFragment.setData(req.body);
      logger.info('after saveData');

      // logger.debug({ myFragment }, 'Created Fragment');
      // res.setHeader('Location', API_URL || req.header('host') + '/fragments/' + myFragment.id);
      logger.debug({ myFragment }, 'Created Fragment');
    res.setHeader('Location', API_URL + '/v1/fragments/' + myFragment.id);
      res.setHeader('Content-Type', myFragment.type);

      res.status(201).json(
        createSuccessResponse({
          fragment: myFragment,
        })
      );
    } catch (err) {
      res.status(400).json(createErrorResponse(400, 'Something when Wrong: ', err));
    }
  }
};