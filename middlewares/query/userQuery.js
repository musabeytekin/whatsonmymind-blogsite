const errorWrapper = require("../../helpers/errors/errorWrapper");
const { search, populate, sort } = require("../../helpers/query/queryHelper");

const userQuery = (model, options=undefined) => {
  return errorWrapper(async (req, res, next) => {
    let query = model.find({});
    if (req.params.id) query = model.findById(req.params.id);

    if (!req.params.id) {
      query = search("name", query, req);
      query = sort(query, req);
    }
    // query = await search("title", query, req);

    if (options && options.population)
      query = populate(query, options.population);

    // console.log(query);

    const result = await query;

    res.result = {
      success: true,
      count: result.length,
      data: result,
    };

    return next();
  });
};

module.exports = {
  userQuery,
};
