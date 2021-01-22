const users = require('../database/UserDB'); 
const api = require('../API/ApiNovaDax');
const variacao = 10;

module.exports = {
    async agendamentos(client){
        const agendamentos = await users.showSchedules();
        console.log("Monitorando os agendamentos");

        for(let i = 0; i < agendamentos.length; i++){
            api.VerifyPerc(agendamentos[i].criptoMonitoring, agendamentos[i].valorGatilho)
                .then((res) =>{
                    console.log( `Moeda: ${agendamentos[i].criptoMonitoring} \tPercentual => ` + res );
                    if( res > variacao ){
                        api.consultaCotacao( client, agendamentos[i].from, agendamentos[i].criptoMonitoring, agendamentos[i].valorGatilho );
                    };                 
                } );
        }

        return;
    }
}


