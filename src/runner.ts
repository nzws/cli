import help from './help';

export type Command = {
  description: string;
  moreDescription?: string;
  function: Function;
  argsName?: Array<string>;
  flags?: {
    [key: string]: {
      name: string | Array<string>;
      description: string;
      hasValue?: boolean;
    };
  };
};
type Commands = { [key: string]: Command };

export type Config = {
  name: string;
  binName: string;
  command?: Command;
  commands?: Commands;
  defaultCommand?: string;
  args?: Array<string>;
};

export type commandFunction = {
  args: Array<string>;
  flags: {
    [key: string]: string | true;
  };
  isDefault: boolean;
};

const run = (config: Config): void => {
  const argv: Array<string> =
    config.args || process.argv.filter((v, index) => index > 1);
  const flag: number = argv.findIndex(v => String(v).slice(0, 1) !== '-');

  if (config.commands) {
    config.commands.help = help(config);
  }

  let command: Command;
  let isDefault = false;
  if (flag !== -1 && config.commands) {
    command = config.commands[argv[flag]];
    if (!command) {
      throw new Error(`This command is not found.`);
    }
    argv.splice(flag, 1);
  } else {
    if (config.defaultCommand && config.commands) {
      isDefault = true;
      command = config.commands[config.defaultCommand];
    } else if (config.command) {
      command = config.command;

      if (argv[flag] === 'help') {
        command = help(config);
        argv.splice(flag, 1);
      }
    } else {
      command = help(config);
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

  command.function({ args, flags, isDefault });
};

export default run;
