const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);
  if (fragment) {
    let msg = {
      fragment: fragment,
    };
    let successMsg = createSuccessResponse(msg);
    res.status(200).json(successMsg);
  } else {
    res.status(404).json(createErrorResponse(
      404, "Fragment does not found"
    ));
  }
};