const ocrSpace = require('ocr-space-api-wrapper')
const config = require('../config');


async function readImage (attachmentData) {
  try {    
    const res = await ocrSpace(`data:image/png;base64,${attachmentData.data}`, { apiKey: `${config.ocr_space_api_key}` })
    var parsedText = res["ParsedResults"][0]["ParsedText"] 
    var out = ({
        parsedText: parsedText
    })
    return out
  } 
  catch (error) {
    return "error"
  }
}


module.exports = {
    readImage
}