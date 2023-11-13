const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const express = require('express');
const router = express.Router();
//Fix a1 Use API_URL
const API_URL = process.env.API_URL;

  router.post('/fragments', async (req, res) => {
    try{ 
      const contentType = req.headers['content-type'];
  
      if (!Buffer.isBuffer(req.body)) {
        res.status(415).json(createErrorResponse(415, 'Unsupported Media Type'));
      } else if(Fragment.isSupportedType(contentType)){
          const fragment = new Fragment({ ownerId: req.user, type: contentType });
          await fragment.setData(req.body);
          await fragment.save();
  
          res.set('Location', `http://${API_URL}/v1/fragments/${fragment.id}`);
          let msg = {
            fragment: fragment,
          };
          let successMsg = createSuccessResponse(msg);
          res.status(201).json(successMsg);
      } else {
        res.status(415).json(createErrorResponse(415, 'Error posting the fragment'));
      }
  }catch(err){
    res.status(404).json(createErrorResponse(404, err));
  }
});
  
  module.exports = router;