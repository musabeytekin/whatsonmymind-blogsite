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

module.exports = {
  search,
  populate,
  sort,
};
