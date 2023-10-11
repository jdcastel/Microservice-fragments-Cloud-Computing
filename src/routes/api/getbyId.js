const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require("../../model/fragment");

const logger = require("../../logger");
const { createHash } = require('crypto');

module.exports = async (req, res) => {
  try {
    const ownerId = createHash('sha256').update(req.user).digest('hex');
    var id = req.params._id;

    if (id.indexOf(".txt") !== -1) {
      id = id.substring(0, id.indexOf(".txt"));
    }
    var fragment = await Fragment.byId(ownerId, id);

    var data = await fragment.getData();

    logger.debug("Id with data fragments " + id + " is " + data);

    let msg = {
      fragment: fragment,
    };
    let message = createSuccessResponse(msg);
    res.status(201).json(message);
  } catch (err) {
    res.status(404).json(createErrorResponse(
      404, "Fragment doesn't exist"
    ));
  }

};