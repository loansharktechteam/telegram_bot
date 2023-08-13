import { Client, Events, GatewayIntentBits, Partials, REST, Routes,
  ActionRowBuilder,
  InteractionType,
  ModalBuilder,
  SelectMenuBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'
import ChannelsCommand from '../commands/channel';
import {ReturnStatusCode , ReturnStatusMessage} from '../enum/enum'


const DISCORD_TOKEN = process.env.DISCORD_TOKEN
// const DISCORD_TOKEN = `MTEwNzMxMDkwNjYyNDQ1NDc1Nw.GsL9Fa._MJJntyTBVmKsySqd-O9PobJFH_nw362XExGOc`
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.Message
  ] 
});
const rest = new REST().setToken(DISCORD_TOKEN?DISCORD_TOKEN:'');

// client.fetchWebhook()
export async function sendDiscordMessageByUsername(clientId:any,message:any){
  return sendDm(clientId,message)
}

export async function sendDm(toClientId:string,message:string) {
  console.log(DISCORD_TOKEN)
  // main()
  client.login(DISCORD_TOKEN);
    try{
      const result = await client.users.send(toClientId,message);
      // console.log(result)
      if(result.id){
        return {
          code:ReturnStatusCode.success,
          message:ReturnStatusMessage.SUCCESS
        }
      }
      return {
        code:ReturnStatusCode.error,
        message:ReturnStatusMessage.FAIL
      }
    }catch (e){
      console.error(e)
      return {
        code:ReturnStatusCode.error,
        message:ReturnStatusMessage.FAIL
      }
    }
}


// client.on('interactionCreate', (interaction) => {
//   console.log(`this is interaction`,interaction)
//   if (interaction.isChatInputCommand()) {
//     console.log('Chat Command');
//     if (interaction.commandName === 'order') {
//       const actionRowComponent = new ActionRowBuilder().setComponents(
//         new SelectMenuBuilder().setCustomId('food_options').setOptions([
//           { label: 'Cake', value: 'cake' },
//           { label: 'Pizza', value: 'pizza' },
//           { label: 'Sushi', value: 'sushi' },
//         ])
//       );
//       const actionRowDrinkMenu = new ActionRowBuilder().setComponents(
//         new SelectMenuBuilder().setCustomId('drink_options').setOptions([
//           { label: 'Orange Juice', value: 'orange_juice' },
//           { label: 'Coca-Cola', value: 'coca_cola' },
//         ])
//       );
//     //   interaction.reply({
//     //     components: [actionRowComponent.toJSON(), actionRowDrinkMenu.toJSON()],
//     //   });
//     // } else if (interaction.commandName === 'register') {
//     //   const modal = new ModalBuilder()
//     //     .setTitle('Register User Form')
//     //     .setCustomId('registerUserModal')
//     //     .setComponents(
//     //       new ActionRowBuilder().setComponents(
//     //         new TextInputBuilder()
//     //           .setLabel('username')
//     //           .setCustomId('username')
//     //           .setStyle(TextInputStyle.Short)
//     //       ),
//     //       new ActionRowBuilder().setComponents(
//     //         new TextInputBuilder()
//     //           .setLabel('email')
//     //           .setCustomId('email')
//     //           .setStyle(TextInputStyle.Short)
//     //       ),
//     //       new ActionRowBuilder().setComponents(
//     //         new TextInputBuilder()
//     //           .setLabel('comment')
//     //           .setCustomId('comment')
//     //           .setStyle(TextInputStyle.Paragraph)
//     //       )
//     //     );

//       // interaction.showModal(modal);
//     }
//   } else if (interaction.isSelectMenu()) {
//     console.log('Select Menu');
//     if (interaction.customId === 'food_options') {
//       console.log(interaction.component);
//     } else if (interaction.customId === 'drink_options') {
//     }
//   } else if (interaction.type === InteractionType.ModalSubmit) {
//     console.log('Modal Submitted...');
//     if (interaction.customId === 'registerUserModal') {
//       console.log(interaction.fields.getTextInputValue('username'));
//       interaction.reply({
//         content: 'You successfully submitted your details!',
//       });
//     }
//   }
// });

// async function main(){
//   // const commands = [
//   //   {
//   //     name:'abc',
//   //     description:"hello"
//   //   }
//   // ]

//   const commands=[
//     ChannelsCommand
//   ]

//   try{
//     console.log(`start command`)
//     await rest.put(Routes.applicationGuildCommands(`1107310906624454757`,`1105161982417567856`),{
//       body:commands
//     })
//   }catch(err){
//     console.log(err);
//   }
// }