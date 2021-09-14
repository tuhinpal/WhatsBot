const googleTTS = require('google-translate-tts');

async function mainF(text) {

          const buffer = await googleTTS.synthesize({
            text: ${text},
            voice: ${text.replace('\\ { }')}
        });

    return ({
        mimetype: "audio/mp3",
        data: buffer,
        filename: "tts"
    })
}

module.exports = {
    mainF
}
