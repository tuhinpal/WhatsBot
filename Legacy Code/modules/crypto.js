// Coded by Sumanjay (https://github.com/cyberboysumanjay)
const axios = require('axios');

async function getPrice(cryptoCode) {
    cryptoCode = cryptoCode.toUpperCase()
    var mainconfig = {
        method: 'get',
        url: 'https://public.coindcx.com/market_data/current_prices'
    }
    return axios(mainconfig)
        .then(async function (response) {
            var data = response.data
            var cryptoCodeINR = cryptoCode + "INR"
            if (data[cryptoCode] != undefined || data[cryptoCodeINR] != undefined) {
                cryptoCode = data[cryptoCode] == undefined ? cryptoCodeINR : cryptoCode
                var out = ({
                    name: cryptoCode,
                    price: data[cryptoCode]
                })
                return out
            } else {
                return "unsupported"
            }
        })
        .catch(function (error) {
            return "error"
        })
}


module.exports = {
    getPrice
}