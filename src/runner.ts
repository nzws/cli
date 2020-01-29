type Command = {
  function: Function;
  argsName?: Array<string>;
  flags?: { [key: string]: string | Array<string> };
};
type Commands = { [key: string]: Command };

type Config = {
  name: string;
  version: string;
  binName: string;
  command?: Command;
  commands?: Commands;
  default?: string;
  args?: Array<string>;
};

const run = (config: Config): void => {
  const argv: Array<string> =
    config.args || process.argv.filter((v, index) => index > 1);
  const flag: number = argv.findIndex(v => String(v).slice(0, 1) !== '-');

  let command: Command | undefined;
  if (flag !== -1 && config.commands) {
    command = config.commands[argv[flag]];
    if (!command) {
      throw new Error(`This command is not found.`);
    }
    argv.splice(flag, 1);
  } else {
    // single or default
    if (config.default && config.commands) {
      command = config.commands[config.default];
    } else if (config.command) {
      command = config.command;
    } else {
      throw new Error(`Unknown command`);
    }
  }

  const args: Array<any> = argv.filter(v => v.slice(0, 1) !== '-');
  const flags: { [key: string]: string | true } = {};
  args
    .filter(v => v.slice(0, 1) === '-')
    .forEach(v => {
      const data = v
        .replace('--', '')
        .replace('-', '')
        .split('=');
      flags[data[0]] = data[1] || true;
    });

  command.function({ args, flags });
};

export default run;
