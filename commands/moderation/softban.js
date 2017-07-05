//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const {
  RichEmbed
} = require('discord.js');

module.exports = class SoftbanCommand extends commando.Command {
  constructor(bot) {
    super(bot, {
      name: 'softban',
      aliases: ['gentleban', 'gentlyban', 'silentban'],
      group: 'moderation',
      memberName: 'softban',
      description: 'Softbans a user.',
      details: oneLine `
				This command softbans a user.
        A softban will ban the user, remove 7 days worth of their messages, and unban them.
        Permission is locked to admins and above.
			`,
      examples: ['softban @Bob Being a butt'],
      args: [{
          key: 'user',
          label: 'user',
          prompt: 'What user would you like to softban? Please specify one only.',
          type: 'member',
          infinite: false
        },
        {
          key: 'reason',
          label: 'reason',
          prompt: 'Why is the user being softbanned?',
          type: 'string',
          infinite: false
        }
      ],

      guildOnly: true
    });
  }

  async run(message, args) {
    let adminrole = message.guild.settings.get('adminrole')
    let modlog = message.guild.settings.get('modlog')
    if (!adminrole || !modlog) return message.reply(`This command is not set up to work! Have someone run \`${message.guild.commandPrefix}settings\` to add the \`admin\` and \`modlod\` settings.`)
    if (!message.member.roles.has(adminrole)) return message.reply(`You do not have permission to do this! Only people with this role can access this command! \`Role Required: ${message.guild.roles.get('adminrole')}\`, this is changeable with \`${message.guild.commandPrefix}set add admin @role\``)
    if (!message.guild.member(this.client.user).hasPermission('BAN_MEMBERS')) return message.reply('I do not have permission to ban members!')

    await args.user.send(`You have been softbanned from the server "${message.guild}"!
Staff member: ${message.author.username}
Reason: '${args.reason}'`)
    const embed = new RichEmbed()
      .setTitle(':bangbang: **Moderation action** :scales:')
      .setAuthor(`${message.author.tag} (${message.author.id})`, `${message.author.avatarURL}`)
      .setColor(0xFF0000)
      .setDescription(`**Action:** Softban \n**User:** ${args.user.tag} (${args.user.id}) \n**Reason:** ${args.reason}`)
      .setTimestamp()
    message.delete(1)
    message.guild.channels.get(modlog).send({
      embed: embed
    })

    message.guild.ban(args.user, {
      days: 7,
      reason: `SOFTBAN: ${args.reason}`
    })

    message.guild.unban(args.user)
  }
};
