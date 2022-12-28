// Code your whale tracker script here!
const { ethers, Contract } = require("ethers")
const axios = require('axios')
require('dotenv/config')
const rpcURL = 'https://cloudflare-eth.com/'    //Free ETH-NODE

const provider = new ethers.providers.JsonRpcProvider(rpcURL)

const CONTRACT_ADDRESS = '0x147040173C4f67EF619E86e613667D8A4989757C' //CROT
//const CONTRACT_ADDRESS = '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE' //SHIB
const CONTRACT_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

//Note USDC uses 6 decimal places
const TRANSFER_THRESHOLD = 4000000000000000000000 // 400 CROT

const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)

const sendInfoToDiscord = async (name, from, to, amount, dataJSON) => {
    //An array of Discord Embeds.
    console.log(`Discord Amount normal = ${amount}`)
    let embeds = [
        {
        title: "🚨🚨 Whale Alert 🚨🚨",
        color: 7419530,
        url: `https://etherscan.io/tx/${dataJSON.transactionHash}`,
        timestamp: new Date().toISOString(),
        thumbnail: {
          url: "https://i.ibb.co/X4rcZnf/Whats-App-Image-2022-12-27-at-22-40-12.jpg"  
        },
        fields: [
            {
                name: `${name}`,
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
        ],
        },
    ];

    //Stringify the embeds using JSON.stringify()
    let data = JSON.stringify({ embeds });

    //Config information needed for axios POST
    var config = {
        method: "POST",
        url: `${process.env.DISCORD_WEBHOOK}`,
        headers: { "Content-Type": "application/json" },
        data: data,
    };

    //Send the request
    await axios(config)
    .then((response) => {
        console.log("Webhook delivered successfully");
        return response;
    })
    .catch((error) => {
        console.log(error);
        return error;
    });
}

function numberWithCommas(number) {
    number/=1000000000000000
    return number.toLocaleString()
}

const main = async () => {
    
    const name = await contract.name()

    console.log(`Started Whale Tracker!\nListing for larga transfers on ${name}`)

    contract.on('Transfer', (from, to, amount, data) => {
        //console.log(from, to , amount, data)
        const amount_decimal = parseInt(amount._hex, 16)
        const amount_decimal_toString = amount_decimal.toString()

        //console.log(`${amount_decimal_toString}\n${amount}`)
        if(amount_decimal_toString >= TRANSFER_THRESHOLD) {
            console.log(`New whale transfer for ${name}:\n
            Amount = ${numberWithCommas(amount_decimal)}\n
            from = ${from}\n
            to = ${to}\n
            https://etherscan.io/tx/${data.transactionHash}`)

            sendInfoToDiscord(name, from, to, numberWithCommas(amount_decimal), data)
        }
    })
}; main()