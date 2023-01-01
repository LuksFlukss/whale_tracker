const axios = require('axios')
require('dotenv/config')

exports.sendInfoToDiscord = async (name, from, to, amount, dataJSON, blockNumber, amountDecimal, imgURL) => {
    let embeds = [
        {
            author: {
                name: 'Carrot Coin Whale Tracker | @CarrotCoCoin',
                icon_url: 'https://i.ibb.co/Z8rMzBg/carrot-img.jpg',
                url: 'https://twitter.com/CarrotCoCoin',
            },
            title: `${name} Transferred 🚚 `,
            color: selectColorEmbed(amountDecimal),
            timestamp: new Date().toISOString(),
            thumbnail: {
            url: `${imgURL}`  
            },
            fields: [
                {
                    name: `Amount`,
                    value: `${amount} ${name}`,
                },
                {
                    name: `From`,
                    value: `${from.slice(0, 6)}...${from.slice(-4)}`,
                    inline: true,
                },
                {
                    name: `To`,
                    value: `${to.slice(0, 6)}...${to.slice(-4)}`,
                    inline: true,
                },
                {
                    name: `BlockNumber`,
                    value: `${blockNumber}`,
                    inline: true,
                },
                {
                    name: `Txn Hash`,
                    value: `https://etherscan.io/tx/${dataJSON.transactionHash}`,
                }
            ],
            footer: {
                text: 'Powered by Carrot Company Labs',
                icon_url: 'https://i.ibb.co/Z8rMzBg/carrot-img.jpg',
            },
        },
    ];

    let data = JSON.stringify({ embeds });
    var config = {
        method: "POST",
        url: `${process.env.DISCORD_WEBHOOK}`,
        headers: { "Content-Type": "application/json" },
        data: data,
    };

    await axios(config)
    .then((response) => {
        console.log("🚚 Webhook delivered successfully")
        return response
    })
    .catch((error) => {
        console.log("❌ Error => " + error)
        return error
    });
}

function selectColorEmbed(amount) {
    let purple = 10181046
    let darkPuple = 7419530
    let darkOrange = 11027200
    let darkAgua = 1146986

    let color = purple
    amount /= 1000000000000000
    
    switch (true) {
        case (amount < 50000000000):
            color = darkPuple
            console.log("Dark Purple")
            break
        case (amount < 319135357153):
            color = darkOrange
            console.log("Dark Orange")
            break
        case (amount < 1623060005466):
            console.log("Dark Agua")
            color = darkAgua
            break
        default:
            console.log("Default")
            break
    }

    return color
}
