const { createSuccessResponse, createErrorResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const API_URL = process.env.API_URL;

module.exports = async (req, res) => {
  let fragment;

  try {
    fragment = new Fragment(await Fragment.byId(req.user, req.params.id));
  } catch (err) {
    return res.status(404).json(createErrorResponse(404, 'Error identifying the fragment by id'));
  }

  if (!Buffer.isBuffer(req.body)) {
    return res.status(415).json({ error: 'Buffer is not supported' });
  }

  fragment.type = req.get('Content-Type');

  try {
    await fragment.setData(req.body);
    await fragment.save();

    const requestedFragment = await Fragment.byId(req.user, fragment.id);
    console.log('requestedFragment', requestedFragment);

    res.set('Location', `${API_URL}/v1/fragments/${fragment.id}`);
    res.set('content-type', fragment.type);

    return res.status(200).json(
      createSuccessResponse({
        fragment: fragment,
        formats: fragment.formats,
      })
    );
  } catch (err) {
    res.status(400).json(createErrorResponse(400, 'A fragments type can not be changed after it is created.'));
  }
};
