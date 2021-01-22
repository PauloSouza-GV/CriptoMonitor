const userdb = require("../database/UserDB");
const cotacao = require("../API/ApiNovaDax");

module.exports = {
    SetStages(client, result, message) {

        if (message.body === "RESETBOT") {
            userdb.delete(result);
            client.sendText(message.from, "😢 BOT Reiniciado, para definir uma nova cotação, comece uma nova conversa. 😢");
            return true;
        }

        if (result.stage == 0) {
            if (!(message.body == 1 || message.body == 2)) {
                client.sendText(message.from, "Acho que me perdi 🥴");
                userdb.delete(result);
                client.sendText(message.from, "😢 BOT Reiniciado, para definir uma nova cotação, comece uma nova conversa. 😢");
                return false;
            }

            client.sendText(message.from, "Informe a sigla da moeda para consultar/monitorar");
            client.sendText(message.from, "⬇️ *Opções* ⬇️");
            
            cotacao.consultaMoedas().then((res) => { 
                var textoEnvio = "";
                for(let i = 0; i < res.length; i++){
                    textoEnvio += `${res[i].description} \n`;
                }
            
                client.sendText(message.from, textoEnvio); 
            })
            userdb.update(result, { stage: message.body });

            return true;
        }

        if (result.stage == 1) {

            cotacao.consultaMoedas().then((res) => { 
            
                const find = res.find( x => x.name == message.body.toUpperCase());
                
                if ( !find ) {
                    client.sendText(message.from, "Essa moeda não esta entre as opções 😤");
                    return false;
                }
    
                client.sendText(message.from, "Sucesso! Para consultar rapidamente essa moeda pode ser digitado qualquer texto.\n\nPara resetar o BOT, escreva *RESETBOT*.");
                userdb.update(result, { criptoMonitoring: find.name, stage: 3, valorGatilho: find.valor });

                cotacao.consultaCotacao(client, result.from, find.name, find.valor);

            })

            return true;
        }

        if (result.stage == 2) {
            cotacao.consultaMoedas().then((res) => { 
                
                const find = res.find( x => x.name == message.body.toUpperCase() );

                if ( !find ) {
                    client.sendText(message.from, "Essa moeda não esta entre as opções 😤");
                    return false;
                }
    
                client.sendText(message.from, "Sucesso! Você será informado automaticamente sempre que houver +5% ou -5%\n\nPara resetar o BOT, escreva *RESETBOT*.");
                userdb.update(result, { criptoMonitoring: find.name, stage: 4, valorGatilho: find.valor });
    
                cotacao.consultaCotacao(client, result.from, find.name, find.valor);
            })

            return true;
        }

        if (result.stage == 3) {
            cotacao.consultaCotacao(client, result.from, result.criptoMonitoring, result.valorGatilho);
            return true;
        }

        if (result.stage == 4) {
            client.sendText(message.from, "O BOT configurado opera de forma automatica, e sempre alerta quando houver um aumento de +5% ou queda de -5%");
            return true;
        }

        client.sendText(message.from, "Acho que me perdi 🥴");
        return false;
    },

    inicialStage(client, message) {
        userdb.store({ from: message.from, stage: 0, criptoMonitoring: "..." });

        client.sendText(message.from, `*Olá, ${message.sender.pushname}, me chamo Nero!* 😉\n\nTe ajudarei a vigiar suas Criptomoedas! 🧐\n\nQual operação deseja executar?\n\n1️⃣ *Verificar cotacão atual*\n2️⃣ *Monitorar Moeda*`);
        return true;
    }
};
