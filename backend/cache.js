const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

const cacheMiddleware = (req, res, next) => {
    try {
        const data = myCache.get('photosComments');
        if (data) {
            res.send(data);
            return;
        }
        next();
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    cacheMiddleware,
    myCache,
};