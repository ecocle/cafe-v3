const cache = {};

const getFromCache = (key) => {
    const entry = cache[key];
    if (entry && entry.expiration > Date.now()) {
        return entry.data;
    } else {
        return undefined;
    }
};

const setInCache = (key, data, expirationInSeconds) => {
    const expiration = Date.now() + expirationInSeconds * 1000;
    cache[key] = { data, expiration };
};

module.exports = {
    getFromCache,
    setInCache,
};
