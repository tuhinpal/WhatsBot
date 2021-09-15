const ud = require('urban-dictionary')

async function mainF(term) {

    return ud.term(term).then((result) => {
        const entries = result.entries
        return ({
            term: entries[0].word,
            def: entries[0].definition,
            example: entries[0].example
        })
    }).catch((error) => {
        return "error"
    })

}
module.exports = {
    mainF
}