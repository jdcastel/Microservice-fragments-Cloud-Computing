const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger'); 
const { Fragment } = require('../../model/fragment');
const express = require('express');
const router = express.Router();
//Fix a1 Use API_URL
const API_URL = process.env.API_URL;

  router.post('/fragments', async (req, res) => {
    logger.debug({ user: req.user });
    logger.debug({ body: req.body });

    const contentType = req.headers['content-type'];

    if (!Buffer.isBuffer(req.body)) {
      res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
    } else if(Fragment.isSupportedType(contentType)){
        const fragment = new Fragment({ ownerId: req.user, type: contentType });
        try {
        await fragment.setData(req.body);
        await fragment.save();

        res.set('Location', `http://${API_URL}/v1/fragments/${fragment.id}`);
        let msg = {
          fragment: fragment,
        };
        let successMsg = createSuccessResponse(msg);
        res.status(201).json(successMsg);
      } catch (err) {
        //You can send back a 5xx here
        res.status(500).json(createErrorResponse(500, err));
      }
    } else {
      res.status(415).json(createErrorResponse(415, 'Error posting the fragment'));
    }
  });
  
  module.exports = router;