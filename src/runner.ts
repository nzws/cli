type Command = {
  function: Function;
  argsName?: Array<string>;
  flags?: {
    [key: string]: {
      name: string | Array<string>;
      hasValue?: boolean;
    };
  };
};
type Commands = { [key: string]: Command };

type Config = {
  name: string;
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

  let command: Command;
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

  const args: Array<string> = argv.filter(v => v.slice(0, 1) !== '-');
  const flags: { [key: string]: string | true } = {};
  if (command.flags) {
    argv
      .filter(v => v.slice(0, 1) === '-')
      .forEach(v => {
        let flagData = v;
        if (flagData.indexOf('--') === 0) {
          flagData = flagData.slice(2);
        }
        if (flagData.indexOf('-') === 0) {
          flagData = flagData.slice(1);
        }
        const data = flagData.split('=');

        const Flags = command.flags || {};
        const flagId: string | undefined = Object.keys(Flags).find(
          (key: string) => {
            const name = Flags[key].name;
            // string / array
            return typeof name === 'string'
              ? name === data[0]
              : name.indexOf(data[0]) !== -1;
          }
        );
        if (flagId) {
          flags[flagId] = data[1] || true;
        }
      });
  }

  command.function({ args, flags });
};

export default run;
