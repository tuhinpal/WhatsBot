const axios = require('axios');

async function detail(url) {

    try {
        var repo = {
            user: url.split('/')[3],
            repo: url.split('/')[4].split('?')[0]
        }
        if (repo.user == undefined || repo.repo == undefined) throw err
    } catch (err) {
        return {
            status: false,
            msg: "This is not a valid Github repository url."
        }
    }

    try {
        const repodata = (await axios.get(`https://api.github.com/repos/${repo.user}/${repo.repo}`)).data

        return {
            status: true,
            msg: `*${repodata.name}* - _${repodata.description}_\n\nAuthor: ${repodata.owner.login}\nTotal Stars: ${repodata.stargazers_count}\nTotal Forks: ${repodata.forks}\nLicense: ${repodata.license.name}`,
            data: await downloadzip(`https://github.com/${repo.user}/${repo.repo}/archive/${repodata.default_branch}.zip`, repodata.name)
        }
    } catch (err) {
        return {
            status: false,
            msg: "This repository is not available. Maybe this is not a public repository."
        }
    }
}

async function downloadzip(url, name) {
    try {
        return {
            status: true,
            data: Buffer.from((await axios.get(url, { responseType: 'arraybuffer' })).data).toString('base64'),
            filename: `${name}.zip`,
            mimetype: 'application/zip'
        }
    } catch (err) {
        return {
            status: false
        }
    }
}

module.exports = {
    detail,
}