import help from './commands/help';
import { errorExit } from './utils/exit';
import { bold } from 'kleur';
import { addPrefix, removePrefix } from './utils/prefix';

export type commandFunction = {
  args: Array<string>;
  flags: {
    [key: string]: string | true;
  };
  isDefault: boolean;
};

export type Command = {
  description: string;
  moreDescription?: string | Array<string>;
  function: (args: commandFunction) => void;
  argsName?: Array<string>;
  flags?: {
    [key: string]: {
      name: string | Array<string>;
      description: string;
      hasValue?: 0 | 1 | 2;
    };
  };
};
type Commands = { [key: string]: Command };

export type ConfigTypes = {
  name: string;
  binName: string;
  command?: Command;
  commands?: Commands;
  defaultCommand?: string;
  args?: Array<string>;
};

const run = (config: ConfigTypes): void => {
  try {
    const argv: Array<string> =
      config.args || process.argv.filter((v, index) => index > 1);
    const flag: number = argv.findIndex(v => String(v).slice(0, 1) !== '-');

    // マルチだったら: helpコマンドを注入
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
          const flagData = removePrefix(v).split('=');
          if (flagData.length > 2) {
            throw new Error(
              `The '${bold('=')}' symbol can't be used for flag's value.`
            );
          }
          const [key, value] = flagData;

          const Flags = command.flags || {};
          const flagId: string | undefined = Object.keys(Flags).find(
            (id: string) => {
              const name = Flags[id].name;
              // string / array
              return typeof name === 'string'
                ? name === key
                : name.indexOf(key) !== -1;
            }
          );
          if (flagId === undefined) {
            throw new Error(`unknown flag: ${bold(addPrefix(key))}`);
          }

          const flagConfig = Flags[flagId];
          if (flagConfig.hasValue === 0 && value !== undefined) {
            throw new Error(
              `${bold(addPrefix(key))} can't contain a value. (${addPrefix(
                key
              )})`
            );
          } else if (flagConfig.hasValue === 2 && value === undefined) {
            throw new Error(
              `${bold(addPrefix(key))} requires a value. (${addPrefix(
                key
              )}=[value])`
            );
          }

          flags[flagId] = value || true;
        });

      Object.keys(command.flags).forEach(id => {
        const config = (command.flags || {})[id];
        if (config.hasValue === 2 && flags[id] === undefined) {
          const flagKey =
            typeof config.name === 'string' ? config.name : config.name[0];
          throw new Error(
            `flag '${bold(id)}' requires a value. (${addPrefix(
              flagKey
            )}=[value])`
          );
        }
      });
    }

    Promise.resolve(command.function({ args, flags, isDefault })).catch(
      errorExit
    );
  } catch (e) {
    errorExit(e);
  }
};

export default run;
