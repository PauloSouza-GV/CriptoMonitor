const venom = require('venom-bot');
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const cron = require('node-cron');
require('dotenv/config');

/*Conexão com o banco de dados*/
mongoose.connect( process.env.DATABASE, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
  });
requireDir('models');

/*Importando a conexão de usuários*/
const userdb = require("./database/UserDB");
const stages = require("./stages/stages");
const schedule = require("./schedule/cron");

/*Criando a conexão para ficar escutando o mensageiro */
venom.create().then((client) => start(client));

function start(client) {
 
  cron.schedule("* * * * * ",() => schedule.agendamentos(client) );
 
  client.onMessage((message) => {

    console.log(`Numero: ${message.sender.formattedName} \t Entrada: ${message.body}`)

    userdb.find( { from: message.from } )
      .then((result) => {
        if(result){
          stages.SetStages( client, result, message);
        }else{
          stages.inicialStage( client, message );
        }
      })
      .catch((error) =>{
        console.log("Error => " + error);
      })
});
}