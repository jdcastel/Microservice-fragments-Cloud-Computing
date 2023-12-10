const { createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const { params, originalUrl } = req;
    const id = path.basename(originalUrl);
    let extTypeName = path.extname(originalUrl);
    const baseUrl = path.basename(id, extTypeName);
    params.id = baseUrl;

    let fragment, buffer;
    try {
      fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
      buffer = await fragment.getData();
      extTypeName ? (extTypeName = extTypeName.substring(1)) : '';
    } catch (err) {
      return res.status(404).json(createErrorResponse(404, ': Error requesting fragment: ' + err));
    }
    if (extTypeName) {
      try {
        buffer = await fragment.fragmentConversion(buffer, extTypeName, fragment);
        if (buffer == null) {
          return res
            .status(415)
            .json(
              createErrorResponse(
                415,
                `A ${fragment.type} fragment cannot be returned as a ${extTypeName}`
              )
            );
        }
      } catch (err) {
        return res.status(400).json(createErrorResponse(400, `Error during conversion: ${err}`));
      }

      const contentTypeWithExt = fragment.type.replace(/\/[^/]+$/, `/${extTypeName}`);
      res.setHeader('Content-Type', contentTypeWithExt);
    } else {
      res.setHeader('Content-Type', fragment.type);
    }
    res.setHeader('Content-Length', fragment.size);

    return res.status(200).send(buffer);
  } catch (err) {
    return res.status(404).json(createErrorResponse(404, 'Error identifying the fragment by id'));
  }
};
