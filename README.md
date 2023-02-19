# Prueba Bot

## Introducción

El Bot de los tutoriales del canal de YouTube [Discord Bots](https://www.youtube.com/@DiscordBots), programado en Node.js, con el módulo "discord.js" v14.

Este bot soporta Slash Commands/Comandos de Barra Diagonal.

Únete al servidor de soporte para ayuda o más información: https://discord.gg/nvaYNqJyeF.

## Configuración

**Muy importante:** Tener instalado Node.js v16.9 a más e instalar el módulo "discord.js".

Para trabajar con este bot, utilizaremos un archivo de configuración, llamado `config.json`, el cual almacenará distintas variables dentro de un objeto.

Completa estos campos si quieres arrancar el bot:

```json
{
  "token": "Aquí va el Token del bot",
  "botId": "Aquí va la ID del bot"
}
```

### ¿Cómo obtener estos campos (Token y Bot ID)?

#### Obtener la ID del Bot

Primero que todo, para obtener la ID del Bot o Bot ID, tenemos dos formas para hacerlo:

La primera forma es teniendo la opción de **Modo Desarrollador** activada (Se activa en Configuración > Avanzado):

<img src="https://i.imgur.com/yPMAnIJ.png" alt="Activar Modo Desarrollador"/>

Luego, das clic derecho en el perfil del bot y presionas la opción **Copiar ID**.

Y ya tendrías copiada la ID del Bot.

<img src="https://i.imgur.com/Tlzvwrk.png" alt="Copiar ID del Bot 1"/>

Por otra parte, hay otro método, que consiste en entrar a la página de Discord Developers y entrar a tu bot.

<img src="https://i.imgur.com/078lwu3.png" alt="Copiar ID del Bot 2"/>

#### Obtener el Token del Bot

Necesitarás entrar a la página de Discord Developers, ubica a tu bot y luego tienes que ir al apartado de **Bot**. Tendrás que presionar el botón **Reset Token**.

Y ya tendrás el Token de tu bot.

<img src="https://i.imgur.com/Ys0wCq2.png" alt="Obtener Token del Bot"/>

Agrega toda esta información al archivo `config.json`.

## Trabajar con Slash Commands

Primero que todo, tenemos para empezar, el comando `ping.js`, pero puedes crear los tuyos igual.

Para agregar estos comandos a tu bot, tendrás que abrir una terminal y escribir el comando `npm run commands`.

## Iniciar el bot

Para iniciar el bot, simplemente tendrás que abrir una terminal y escribir el comando `node .`.
