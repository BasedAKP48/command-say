function getFlags(string = '') {
  const [message, ...rest] = string.split('--'); // TODO: So is this!
  const flags = {};

  rest.forEach((text) => {
    const [name] = text.split(/\s/); // TODO: This is new!
    const value = text.substring(name.length + 1).trim();

    const prev = flags[name];
    if (prev && value) {
      if (Array.isArray(prev) && !prev.includes(value)) {
        prev.push(value);
      } else if (prev === true) { // Currently "true"? Set as string
        flags[name] = value;
      } else if (prev !== value) {  // Create a string array
        flags[name] = [prev, value]
      }
    } else if (!prev) {
      flags[name] = value || true;
    }
  });

  return {
    message: message.trim(),
    flags,
  };
}

module.exports = getFlags;
