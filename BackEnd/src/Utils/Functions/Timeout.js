const route = async (ms) => new Promise(res => setTimeout(res, ms))

module.exports = route