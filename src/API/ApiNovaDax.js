const axios = require('axios');
const Userdb = require('../database/UserDB');

module.exports = {

    async consultaMoedas(){
        const moedas = await axios.get('https://api.novadax.com/v1/market/tickers');

        var retorno = [];

        for(let i = 0; i < moedas.data.data.length; i++){
            retorno.push( { "name": moedas.data.data[i].symbol, "description": `▶️ *${moedas.data.data[i].symbol}*`, "valor": moedas.data.data[i].ask } );
        }
        return retorno;
    },

    async consultaCotacao( client, from, symbol, valorGatilho  ){
        const moeda = await axios.get(`https://api.novadax.com/v1/market/ticker?symbol=${symbol}`);
        const { bid } = moeda.data.data; 

        var textoCotacao =  "*Valor da Moeda Atualizada* \n"
            textoCotacao += `*Moeda* => ${symbol} \n`
            textoCotacao += `*Vlr. Atual* => ${bid} \n`
            textoCotacao += `*Vlr. Gatilho* => ${valorGatilho} \n\n\n`
            
            if( valorGatilho < bid ){
                textoCotacao += `*Ganho* => ${ Math.abs(((valorGatilho/bid) * 100) - 100).toFixed(2) } \n`
            }else if(valorGatilho > bid){
                textoCotacao += `*Prejuizo* => ${ Math.abs(((valorGatilho/bid) * 100) - 100).toFixed(2) } \n`
            }
        
        console.log(`Enviando para : ${from}`);
        client.sendText(from, textoCotacao);
    },

    async VerifyPerc( symbol, valorGatilho  ){
        const moeda = await axios.get(`https://api.novadax.com/v1/market/ticker?symbol=${symbol}`);
        const { bid } = moeda.data.data; 

        return ( ( bid / valorGatilho ) - 1 ) * 100
    }    
};
