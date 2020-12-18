const axios = require('axios');

async function mainF(cityname) {

    var mainconfig = {
        method: 'get',
        url: `https://weather-api-tuhin.vercel.app/api?query=${cityname}`
    }
    return axios(mainconfig)
        .then(async function(response) {
            var data = response.data
            var out = ({
                place: `${data.location.city}, ${data.location.region}, ${data.location.country}`,
                today_forcast: data.forecasts[0],
                current_observation: data.current_observation.condition
            })
            return out
        })
        .catch(function(error) {
            return "error"
        })
}
module.exports = {
    mainF,
}