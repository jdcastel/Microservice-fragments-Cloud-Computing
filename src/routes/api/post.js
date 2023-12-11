const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const express = require('express');
const router = express.Router();

//Fix a1 Use API_URL
const API_URL = process.env.API_URL;

router.post('/fragments', async (req, res) => {
  try {
    const contentType = req.headers['content-type'];

    if (!Buffer.isBuffer(req.body)) {
      return res.status(415).json({ error: 'Buffer is not supported' });
    }

    if (!Fragment.isSupportedType(contentType)) {
      return res.status(415).json({ error: 'Media type is not supported' });
    }

    const fragment = new Fragment({ ownerId: req.user, type: contentType });
    await fragment.setData(req.body);
    await fragment.save();

    const successMsg = createSuccessResponse({
      fragment,
    });

    res.set('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.status(201).json(successMsg);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Error posting fragment'));
  }
});

module.exports = router;
