const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
     const data = await fragment.getData();
    // console.log(data);
    //Set the content-type header to the fragment's type, then .send() the raw buffer.
    const contentType = req.user.contentType || 'text/plain';
    res.set('Content-Type', contentType);
    res.status(200).json(createSuccessResponse({
      fragment: data + ""
    }));
  } catch (err) {
    res.status(404).json(createErrorResponse(404, err));
  }
};