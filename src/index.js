require('dotenv').config();
const axios =  require('axios');
const { Client, Intents, MessageEmbed } = require('discord.js');
const url = 'https://api.mir4global.com/wallet/prices/draco/lastest';
const client = new Client({ 
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ] 
});

let draco;


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('messageCreate', message => {
  if (message.content === '!draco') {
    const embed = new MessageEmbed()
    .setColor('RED')
    .addFields(
      { name: ('Draco'), value: draco},
    )
  message.channel.send({ embeds: [embed] });
  }
});

const getDraco = async () => {
  try {
    const res = await axios.post(url);
    const dracoUsd = Number(res.data.Data.USDDracoRate).toFixed(2);
    draco =  `$ ${dracoUsd}  USD`;
    client.user.setActivity(draco, {type: 'PLAYING'});
  } catch (error) {
    console.log(error.message);
  }
}

getDraco();
setInterval(getDraco, 60000 * process.env.UPDATE_MINUTES);

client.login(process.env.TOKEN);