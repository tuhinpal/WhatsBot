//jshint esversion:8
const axios = require('axios');

async function weather(cityname) {

    let mainconfig = {
        method: 'get',
        url: `https://weather-api-tuhin.vercel.app/api?query=${cityname}`
    };
    return axios(mainconfig)
        .then(async function(response) {
            let data = response.data;
            let out = ({
                place: `${data.location.city}, ${data.location.region}, ${data.location.country}`,
                today_forcast: data.forecasts[0],
                current_observation: data.current_observation.condition
            });
            return out;
        })
        .catch(function(error) {
            return "error";
        });
}

const execute = async (client,msg,args) => {
    msg.delete(true);
    let data = await weather(args.join(' '));
    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened to fetch Weather```");
    } else {
        await client.sendMessage(msg.to, `*Today's Weather at ${data.place}*\n` + "```" + data.current_observation.text + " (" + data.current_observation.temperature + "°C)```\n\n*Type:* " + "```" + data.today_forcast.text + "```\n*Max temperature:* " + "```" + data.today_forcast.high + "°C```\n*Min temperature:* " + "```" + data.today_forcast.low + "°C```");
    }
};

module.exports = {
    name: 'Weather',
    description: 'Gets weather info for given location',
    command: '!weather',
    help: '',
    execute};