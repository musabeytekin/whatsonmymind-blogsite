const search = (searchKey, query, req) => {
  if (req.query.search) {
    let queryObj = {};
    console.log("query search: ", query, "-----");
    const regex = new RegExp(req.query.search, "i");
    queryObj[searchKey] = regex;

    return query.where(queryObj);
  }

  return query;
};
const populate = (query, populate) => {
  return query.populate(populate);
};

const sort = (query, req) => {
  const sortKey = req.query.sort;
  if (sortKey === "most-liked") return query.sort("-likeCount"); // there is an error
  return query.sort(`-createdAt`);
};

const getPaginatorVariables = async (req, total) => {
  let page = req.query.page || 1;
  let limit = req.query.limit || 5;

  const start = (page - 1) * limit;
  const end = page * limit;

  const pagination = {};

  if (start > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  if (end < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  return {
    pagination,
    start,
    limit,
  };
};

const paginate = async (model, query, req) => {
  const total = model.countDocuments();

  const { pagination, start, limit } = await getPaginatorVariables(req, total);

  return {
    query: query.skip(start).limit(limit),
    pagination: Object.keys(pagination).length === 0 ? undefined : pagination,
  };
};

module.exports = {
  search,
  populate,
  sort,
  paginate
};
