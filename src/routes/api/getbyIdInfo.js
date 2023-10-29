const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragment = await Fragment.byId(req.user, req.params.id);
  if (fragment) {
    let msg = {
      fragment: fragment,
    };
    let messageSuccess = createSuccessResponse(msg);
    res.status(200).json(messageSuccess);
  } else {
    let msg = {
      status: 'error',
      error: {
        message: 'no fragment found',
        code: 404,
      },
    };
    res.status(404).json(createErrorResponse(404, msg));
  }
};