// Coded by Sumanjay (https://github.com/cyberboysumanjay)
const axios = require('axios');

async function getShortURL(input) {
    var mainconfig = {
        method: 'get',
        url: `https://da.gd/s?url=${input}` 
    }
    return axios(mainconfig)
        .then(async function (response) {
            var shortened = response.data
            var out = ({
                input: input,
                short: shortened.replace(/\n/g, '')
            })
            return out
        })
        .catch(function (error) {
            return "error"
        })
}

module.exports = {
    getShortURL
}