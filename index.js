const utils = require('@basedakp48/plugin-utils');
const getFlags = require('./src/util/getFlags');

const plugin = new utils.Plugin({ dir: __dirname, name: 'Say' });

const PREFIX = '.';
const commandData = {
  description: 'Have the bot text',
  usage: '{prefix}{command} text',
  aliases: ['say'],
  flags: {
    mention: false,
  },
};
let commandProcessorExists = false;

plugin.presenceSystem();

plugin.messageSystem().on('message/command', (msg) => {
  if (commandProcessorExists) { // The first message will always be processed by the message-in system.
    sendMessage(msg, handleCommand(msg));
  }
  commandProcessorExists = true;
});

plugin.messageSystem().on('message-in', (msg) => {
  if (commandProcessorExists || msg.type !== 'text' || !(msg.text.startsWith(PREFIX) || msg.data.isPM)) return;

  const {message, flags} = getFlags(msg.text);

  const args = message.split(/\s+/g);

  // Trim space between prefix and command
  if (args[0] === PREFIX) args.shift();

  const command = getCommand(args.shift()).trim();
  sendMessage(msg, handleCommand({
    uid: msg.uid,
    data: {
      flags,
      command: command.toLowerCase(),
      text: message.substring(message.indexOf(command) + command.length + 1).trim(),
    },
  }));
});

function handleCommand({
  uid,
  data: {
    command = '',
    text = '',
    flags = {} 
  }
}) {
  if (!commandData.aliases.includes(command) || !text) return '';

  if (getOptions(flags).mention) {
    text = `<@!${uid}>: ${text}`; // Just assumes it's discord
  }

  return text;
}

function sendMessage(msg, text) {
  if (text) {
    plugin.messageSystem().sendText(text, msg)
  }
}

function getOptions(overrides = {}) {
  return {
    ...commandData.flags,
    ...overrides,
  };
}

function getCommand(text = '') {
  if (text.startsWith(PREFIX)) {
    return text.substring(PREFIX.length);
  }
  return text;
}
