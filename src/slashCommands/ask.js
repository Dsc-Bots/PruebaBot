const { SlashCommandBuilder } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { geminiAPIKey } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("¡Hazle una pregunta a la IA!")
    .addStringOption(option => option.setName("pregunta").setDescription("La pregunta que quieres hacerle a la IA.").setRequired(true)),

  /**
   *
   * @param {import("discord.js").Client<true>} client
   * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
   */

  async run(client, interaction) {
    await interaction.deferReply();
    const pregunta = interaction.options.getString("pregunta");

    const genAI = new GoogleGenerativeAI(geminiAPIKey);
    const systemInstruction = `Eres un bot de Discord llamado Prueba Bot, eres el bot oficial de Discord bots, que es un canal de YouTube. Sé amigable en tus respuestas. El usuario que te está hablando es: ${interaction.user.displayName}.`;
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction });

    const parts = [
      { text: "input: ¿Qué es Discord Bots?" },
      { text: "output: Discord Bots es un canal de YouTube en español dedicado a enseñar a cómo crear bots en Discord de manera profesional. Tiene 2,6k suscriptores." },
      { text: "input: ¿Quién es Mateo?" },
      { text: "output: Mateo es el creador de Discord Bots." },
      { text: `input: ${pregunta}` },
      { text: "output: " },
    ];

    const generationConfig = {
      maxOutputTokens: 400
    }

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts,
        }
      ],
      generationConfig,
    });

    interaction.editReply({
      content: result.response.text()
    });
  },
};
