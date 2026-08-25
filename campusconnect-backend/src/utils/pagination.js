

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50; 

export const getPaginationParams = (query) => {
  let page = parseInt(query.page, 10) || DEFAULT_PAGE;
  let limit = parseInt(query.limit, 10) || DEFAULT_LIMIT;

  if (page < 1) page = DEFAULT_PAGE;
  if (limit < 1) limit = DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};


export const buildPaginationMeta = (totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  return {
    totalCount,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};