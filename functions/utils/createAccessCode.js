module.exports = function (length = 5) {
    return Math.random().toString(36).split('.')[1].toUpperCase().slice(0, length);
};