const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const cacheMiddleware = (req, res, next) => {
    try {
        if (myCache.has('photosComments')) {
            return res.send(myCache.get('photosComments'))
        }
        return next();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    cacheMiddleware,
    myCache,
};