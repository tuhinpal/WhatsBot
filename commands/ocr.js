//jshint esversion:8
const ocrSpace = require('ocr-space-api-wrapper');
const config = require('../config');

async function readImage (attachmentData) {
  try {    
    const res = await ocrSpace(`data:image/png;base64,${attachmentData.data}`, { apiKey: `${config.ocr_space_api_key}` });
    let parsedText = res.ParsedResults[0].ParsedText;
    let out = ({
        parsedText: parsedText
    });
    return out;
  } 
  catch (error) {
    return "error";
  }
}

const execute = async (client,msg) => {
    msg.delete(true);
    if(msg.hasQuotedMsg){
        let quotedMsg = await msg.getQuotedMessage();
        let attachmentData = await quotedMsg.downloadMedia();
        let data = await readImage(attachmentData);
        if (data == "error") {
            quotedMsg.reply(`Error occured while reading the image. Please make sure the image is clear.`);
        } else {
            quotedMsg.reply(`*Extracted Text from the Image*  👇\n\n${data.parsedText}`);
        }
    }
    
    else{
        await client.sendMessage(msg.to,'```Please reply to an image with text in it```');
    }
};

module.exports = {
    name: 'OCR',
    description: 'Extracts text content from given image',
    command: '!ocr',
    commandType: 'plugin',
    isDependent: false,
    help: `*OCR*\n\nReads text from any readable image. \n\n*Reply a photo with !ocr to read text from that image.*\n`,
    execute};