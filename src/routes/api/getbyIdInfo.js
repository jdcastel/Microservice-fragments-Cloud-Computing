const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);

    const successMsg = createSuccessResponse({
      fragment,
    });

    res.status(200).json(successMsg);
  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Error getting the fragment by information'));
  }
};
