const { ethers, Contract } = require("ethers")
const axios = require('axios')
const rpcURL = 'https://cloudflare-eth.com/'
const provider = new ethers.providers.JsonRpcProvider(rpcURL)
require('dotenv/config')

//===============================================
const CONTRACT_ADDRESS = '0x147040173C4f67EF619E86e613667D8A4989757C' //CROT
//const CONTRACT_ADDRESS = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' //SHIB (More Active Contract for Developing)
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]
const TRANSFER_THRESHOLD = 0 //No TreshHold
//===============================================

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
const sendInfoToDiscord = async (from, to, amount, dataJSON, blockNumber) => {
    let embeds = [
        {
            author: {
                name: 'Carrot Coin TrackerBot | @CarrotCoCoin',
                icon_url: 'https://i.ibb.co/Z8rMzBg/carrot-img.jpg',
                url: 'https://twitter.com/CarrotCoCoin',
            },
            title: `$CROT Transferred  🥕🥕`,
            color: 7419530,
            timestamp: new Date().toISOString(),
            thumbnail: {
            url: "https://i.ibb.co/Z8rMzBg/carrot-img.jpg"  
            },
            fields: [
                {
                    name: `Amount`,
                    value: `${amount} $CROT`,
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

function numberWithCommas(number) {
    number /= 1000000000000000
    return number.toLocaleString()
}

function getAmountToString(amount) {
    const amountConverted = parseInt(amount._hex, 16)
    const amountToConvertedToString = amountConverted.toString()

    return { amountConverted, amountToConvertedToString }
}

const main = async () => {
    const name = await contract.name()
    console.log(`🏁 Started ${name} Tracker `)
    contract.on('Transfer', (from, to, amount, data) => {
        let values = getAmountToString(amount)
        if(values.amountToConvertedToString >= TRANSFER_THRESHOLD) {

            console.log("*****************************")
            console.log(`🥕 New $CROT Tranfer`)
            console.log(`💵 Amount => ${numberWithCommas(values.amountConverted)}`)
            console.log(`👦 From => ${from}`)
            console.log(`👨 To => ${to}`)
            console.log(`🔨 BlockNumber => ${data.blockNumber}`)
            console.log(`⛩  Event => ${data.event}`)
            console.log(`#️⃣  Transaction Hash => ${data.transactionHash}`)
            console.log("*****************************")

            sendInfoToDiscord( from, to, numberWithCommas(values.amountConverted), data, data.blockNumber )
        }
    })
}; main()