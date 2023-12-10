const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  try {
    const { user, params: { id } } = req;
    await Fragment.delete(user, id);

  } catch (err) {
    res.status(404).json(createErrorResponse(404, 'Error deleting the fragment the id is not found'));
  }
  return res.status(200).json(createSuccessResponse());
};