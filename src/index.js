const axios = require('axios');
const { Client, Intents, MessageEmbed } = require('discord.js');
const url = 'https://api.mir4global.com/wallet/prices/draco/lastest';
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES
  ]
});

let oneDraco;

if (process.env.NODE_ENV !== 'PROD') require('dotenv').config();


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('messageCreate', message => {
  try {
    const mes = message.content.split(' ', 2);
    if (mes[0].toLowerCase() === '!draco') {
      let msgTitle = 'Draco';
      let msgText = `$ ${oneDraco}  USD`;
      if (!isNaN(mes[1])) {
        const dracos =  oneDraco * mes[1];
        msgTitle = `${mes[1]} Dracos =`;
        msgText = `$ ${dracos}  USD`;     
      }
      const embed = new MessageEmbed()
        .setColor('RED')
        .addFields(
          { name: (msgTitle), value: msgText},
        );
      message.channel.send({ embeds: [embed] });         
    }
  } catch (error) {
    console.log(error.message);
  }
});

const getDraco = async () => {
  try {
    const { data } = await axios.post(url);
    oneDraco = Number(data.Data.USDDracoRate).toFixed(2);
    client.user.setActivity(`$ ${oneDraco}  USD`, {type: 'PLAYING'});
  } catch (error) {
    console.log(error.message);
  }
};

getDraco();
setInterval(getDraco, 60000 * process.env.UPDATE_MINUTES);

client.login(process.env.TOKEN);