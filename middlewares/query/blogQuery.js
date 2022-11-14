const errorWrapper = require("../../helpers/errors/errorWrapper");
const {
  search,
  populate,
  sort,
  paginate,
} = require("../../helpers/query/queryHelper");

const blogQuery = (model, options) => {
  return errorWrapper(async (req, res, next) => {
    let query = model.find({});
    if (req.params.id) query = model.findById(req.params.id);

    if (!req.params.id) {
      query = search("title", query, req)
      query = sort(query, req);
    }
    // query = await search("title", query, req);

    if (options && options.population)
      query = populate(query, options.population);

    // console.log(query);

    let pagination;

    const paginationResult = await paginate(model, query, req);


    query = paginationResult.query;
    pagination = paginationResult.pagination
    const result = await query;

    res.result = {
      success: true,
      count: result.length,
      pagination: pagination,
      data: result
    };

    return next();
  });
};

module.exports = {
  blogQuery,
};
