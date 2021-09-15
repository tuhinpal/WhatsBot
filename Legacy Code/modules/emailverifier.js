const axios = require("axios");
const fs = require("fs");
const config = require("../config");

async function emailVerifier(email) {
    var session = await getSession()
    if (session === "error") {
        return `🙇‍♂️ *Error*\n\n` + "```Your Infospace API Key seems to be invalid. Please go to infospace.club > signup > grab your api key```"
    } else {
        var getemailstring = await verifyRequest(email, session)
        if (getemailstring.sessionError) {
            fs.rmSync(`${__dirname}/tempdata/infospace.txt`)
            var session = await getSession()
            if (session === "error") {
                return `🙇‍♂️ *Error*\n\n` + "```Your Infospace API Key seems to be invalid. Please go to infospace.club > signup > grab your api key```"
            } else {
                var getemailstring = await verifyRequest(email, session)
                if (getemailstring.sessionError) {
                    return `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while fetching Movie/TV Show Details.```"
                } else {
                    return getemailstring.msg
                }
            }
        } else {
            return getemailstring.msg
        }
    }
}

async function getSession() {
    try {
        return fs.readFileSync(`${__dirname}/tempdata/infospace.txt`, 'utf-8') // If sesssion present
    } catch (error) {
        console.log('Cache MISS')
        try {
            const newSession = (await axios.post('https://prod-api.infospace.club/session', {
                api_key: config.infospace_api_key
            })).data

            if (newSession.status) {
                fs.writeFileSync(`${__dirname}/tempdata/infospace.txt`, newSession.session)
                return newSession.session
            } else {
                throw ''
            }
        } catch (err) {
            return "error"
        }
    }
}

async function verifyRequest(email, session) {
    return await axios({
        method: 'post',
        url: 'https://prod-api.infospace.club/email-verifier',
        headers: {
            'Authorization': session,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({ email })
    })
        .then(function (response) {
            if (!response.data.status) {
                if (response.data.msg === "Expired, Please login again !") {
                    return {
                        sessionError: true,
                        msg: null
                    }
                } else {
                    return {
                        sessionError: false,
                        msg: `🙇‍♂️ *Error*\n\n` + "```" + response.data.msg + "```"
                    }
                }
            } else {
                var validitystring = (response.data.valid) ? `valid with ${response.data.valid_chance}% chance` : 'invalid'
                return {
                    sessionError: false,
                    msg: `*${response.data.query}* is ${validitystring}\n\nDisposable: ${yesno(response.data.disposable)}\nFree Provider: ${yesno(response.data.free)}\n\n⚡ Powered by _infospace.club_`
                }
            }
        })
        .catch(function (error) {
            return {
                sessionError: false,
                msg: `🙇‍♂️ *Error*\n\n` + "```Something Unexpected Happened while fetching Movie/TV Show Details.```"
            }
        });
}

function yesno(status) {
    if (status) {
        return "Yes"
    } else {
        return "No"
    }
}

module.exports = emailVerifier