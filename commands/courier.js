//jshint esversion:8
// Coded by Sumanjay (https://github.com/cyberboysumanjay)
const {
    MessageMedia
} = require('whatsapp-web.js');
const axios = require('axios');

async function getTrackingDetails(trackingService, trackingNumber) {
    let mainconfig = {
        method: 'get',
        url: `https://sjcourierapi.deta.dev/${trackingService}/${trackingNumber}` //Feel free to use this API for your own use.
    };
    console.log(mainconfig.url);
    let statusString = "Unable to get information for your shipment. Please check the tracking id or try again later!"
    return axios(mainconfig)
        .then(async function (response) {
            let data = response.data;
            if (trackingService == "gati") {
                let status = data.result
                if (status == "successful") {
                    let dktInfo = data.dktInfo[0];
                    console.log(dktInfo);
                    statusString = `Your shipment having docket number ${dktInfo.dktno} booked from ${dktInfo.bookingStation} to ${dktInfo.deliveryStation} by ${dktInfo.consigneeName} is having current status of ${dktInfo.docketStatus}.\nIt is scheduled to be delivered to ${dktInfo.ReceiversName} on or before ${dktInfo.assuredDlyDate}.`
                }
            } else if (trackingService == "ekart") {
                try {
                    merchant = data.merchantName
                    if (merchant != null) {
                        let merchantName = merchant == "FKMP" ? "Flipkart" : merchant;
                        let reachedNearestHub = data.reachedNearestHub ? "has reached nearest hub" : "is yet to reach nearest hub"
                        statusString = `Your shipment having tracking number ${trackingNumber} booked from ${data.sourceCity} to ${data.destinationCity} by ${merchantName} ${reachedNearestHub}.\nYour shipment is expected to be delivered to ${data.receiverName} on or before ${data.expectedDeliveryDate}.`
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            let out = ({
                status: statusString
            });
            return out;
        })
        .catch(function (error) {
            console.log(error);
            return "error";
        });
}
const execute = async (client, msg, args) => {
    msg.delete(true);
    let data = await getTrackingDetails(args[0], args[1]);
    if (data == "error") {
        await client.sendMessage(msg.to, `🙇‍♂️ *Error*\n\n` + "```Something unexpected happened while fetching the courier details.```");
    } else {
        await client.sendMessage(msg.to, `🙇‍♂️ *Courier/Shipment Details*\n\n` + "```" + data.status + "```");
    }
};

module.exports = {
    name: 'Courier',
    description: 'Get courier details from multiple providers. Currently supports: Gati Express and Ekart',
    command: '!courier',
    commandType: 'plugin',
    isDependent: false,
    help: `*courier*\n\nGet information about your couriers and shipments. \n\n*!courier [courier-name] [tracking-id]*\n\nSupported: Ekart, Gati`,
    execute
};
