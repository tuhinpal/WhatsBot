const axios = require('axios');

async function cricket(url) {
    try {
        const scoredata = (await axios.get(`https://cricket-mskian-whatsbot.vercel.app/cri.php?url=${url}`)).data
        if (scoredata.success) {
            return {
                status: true,
                msg: `🏏 *${scoredata.livescore.title}*\n\nOver: _${scoredata.livescore.bowlerover}_\nBatsman: _${scoredata.livescore.batsman} (${scoredata.livescore.batsmanrun})_\nLastwicket: _${scoredata.livescore.lastwicket}_\nRunrate: _${scoredata.livescore.runrate}_\n\n*Commentary 👇*\n\n${scoredata.livescore.commentary.map(cmntry => {
                    return cmntry
                })}`,
            }
        } else {
            throw ''
        }
    } catch (err) {
        return {
            status: false,
            msg: "That's an error."
        }
    }
}

module.exports = cricket