const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel-ticket")
    .setDescription("Genera el panel de tickets."),

  /**
   *
   * @param {import("discord.js").Client<true>} client
   * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
   */

  async run(client, interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Tickets")
      .setDescription("¡Presiona el botón de abajo para crear un ticket!")
      .setColor("Blurple")
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Crear Ticket")
        .setCustomId("crear-ticket")
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎫")
    );

    interaction.channel.send({
      embeds: [embed],
      components: [row],
    });

    interaction.reply({
      content:
        ":white_check_mark: | Se ha enviado el panel de tickets correctamente.",
    });
  },
};
