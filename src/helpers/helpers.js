function getStatus(statusCode) {
    if (isNaN(statusCode)) return;

    let successRegEx = /^2\d\d/g,
        errorRegEx = /^(4|5)\d\d/g;
    
    if (successRegEx.test(statusCode)) return 'success';
    if (errorRegEx.test(statusCode)) return 'error';
    return;
}

export function formatResponse(statusCode, paginateObj, remainingQueries, baseUrl) {
    const { 
        docs,
        limit,
        totalPages,
        page,
        prevPage,
        nextPage,
        hasPrevPage,
        hasNextPage
        } = paginateObj;
    
    let queriesArray = [];
    for (const key in remainingQueries) {
        if (Object.hasOwnProperty.call(remainingQueries, key)) {
            if ( remainingQueries[key] && key !== 'limit' && key !== 'page' ) {
                queriesArray.push(`&${key}=${remainingQueries[key]}`)
            }
        }
    }

    const prevLink = `${baseUrl}?limit=${limit}&page=${prevPage}${queriesArray.length > 0 ? queriesArray.join('') : ''}`;
    const nextLink = `${baseUrl}?limit=${limit}&page=${nextPage}${queriesArray.length > 0 ? queriesArray.join('') : ''}`;

    return {
        status: getStatus(statusCode),
        payload: docs,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? prevLink : null,
        nextLink: hasNextPage ? nextLink : null
    }
}