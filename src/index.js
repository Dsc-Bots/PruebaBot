const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  OverwriteType,
} = require("discord.js");
const fs = require("fs");
const config = require("../config.json");
const discordTranscripts = require("discord-html-transcripts");

const client = new Client({
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.GuildScheduledEvent,
    Partials.Message,
    Partials.Reaction,
    Partials.ThreadMember,
    Partials.User,
  ],
});

client.slashCommands = new Collection();
const slashCommandsFiles = fs
  .readdirSync("./src/slashCommands")
  .filter((file) => file.endsWith("js"));

for (const file of slashCommandsFiles) {
  const slash = require(`./slashCommands/${file}`);
  client.slashCommands.set(slash.data.name, slash);
}

client.on("ready", () => {
  console.log(`¡Listo como ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const slashCommand = client.slashCommands.get(interaction.commandName);

    if (!slashCommand) return;

    try {
      await slashCommand.run(client, interaction);
    } catch (e) {
      console.error(e);
    }
  }
  if (interaction.isButton()) {
    if (interaction.customId === "crear-ticket") {
      const everyone = interaction.guild.roles.cache.find(
        (rol) => rol.name === "@everyone"
      );

      interaction.guild.channels
        .create({
          name: `ticket-${interaction.user.username}`,
          parent: config.ticketsCategoryId,
          permissionOverwrites: [
            {
              id: everyone.id,
              deny: ["ViewChannel", "SendMessages"],
            },
            {
              id: interaction.user.id,
              allow: ["ViewChannel", "SendMessages", "AttachFiles"],
            },
          ],
        })
        .then((channel) => {
          interaction.reply({
            content: `¡Tu ticket ha sido creado correctamente! ${channel.toString()}`,
            ephemeral: true,
          });

          const embedTicket = new EmbedBuilder()
            .setAuthor({
              name: `${interaction.user.tag} ha creado un ticket.`,
              iconURL: interaction.user.displayAvatarURL({
                forceStatic: false,
              }),
            })
            .setColor("Blurple")
            .setDescription("Espera a que un moderador te responda.")
            .setTimestamp();

          const rowTicket = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("cerrar-ticket")
              .setLabel("Cerrar Ticket")
              .setStyle(ButtonStyle.Danger)
          );

          channel.send({
            content: interaction.user.toString(),
            embeds: [embedTicket],
            components: [rowTicket],
          });
        });
    }
    if (interaction.customId === "cerrar-ticket") {
      await interaction.deferUpdate();

      const usuario = interaction.channel.permissionOverwrites.cache.find(
        (permisos) => permisos.type !== OverwriteType.Role
      );

      await interaction.channel.permissionOverwrites.edit(usuario.id, {
        ViewChannel: false,
        SendMessages: false,
      });

      const embedTicketCerrado = new EmbedBuilder()
        .setColor("Red")
        .setDescription(
          `\`\`\`El ticket fue cerrado por ${interaction.user.tag}\`\`\``
        )
        .setTimestamp();

      const rowTicketCerrado = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("eliminar-ticket")
          .setLabel("Eliminar Ticket")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🗑️"),

        new ButtonBuilder()
          .setCustomId("transcript")
          .setLabel("Transcript")
          .setStyle(ButtonStyle.Secondary)
      );

      interaction.channel.send({
        embeds: [embedTicketCerrado],
        components: [rowTicketCerrado],
      });

      await interaction.message.delete();
    }
    if (interaction.customId === "eliminar-ticket") {
      await interaction.reply({
        content: "El ticket será cerrado en **5 segundos**.",
        ephemeral: true,
      });

      await interaction.message.delete();

      setTimeout(async function () {
        await interaction.channel.delete();
      }, 5000);
    }
    if (interaction.customId === "transcript") {
      interaction.reply(
        "El transcript está siendo generado. Espera un momento."
      );

      const attachment = await discordTranscripts.createTranscript(
        interaction.channel
      );

      interaction.channel.send({ files: [attachment] });
    }
  }
});

client.login(config.token);
