import { bold } from 'kleur';
import help from './commands/help';
import { errorExit } from './utils/exit';
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
  function: (args: commandFunction) => void | Promise<void>;
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

export const run = (config: ConfigTypes): void => {
  try {
    const argv: Array<string> =
      config.args || process.argv.filter((_, index) => index > 1);
    const argId: number = argv.findIndex(v => String(v).slice(0, 1) !== '-');

    if (config.commands) {
      // マルチだったら: helpコマンドを注入
      config.commands.help = help(config);
    }

    let command: Command;
    let isDefault = false;
    if (argId !== -1 && config.commands) {
      // マルチコマンドモード、サブコマンドが指定されている
      command = config.commands[argv[argId]];
      if (!command) {
        throw new Error(`This command is not found.`);
      }
      argv.splice(argId, 1);
    } else {
      if (config.defaultCommand && config.commands) {
        // マルチコマンドモード、サブコマンドが指定されていない、デフォルトコマンドが存在する
        isDefault = true;
        command = config.commands[config.defaultCommand];
      } else if (config.command) {
        // シングルコマンドモード
        command = config.command;

        if (argv[argId] === 'help') {
          command = help(config);
          argv.splice(argId, 1);
        }
      } else {
        // マルチコマンドモード、サブコマンドが指定されていない、デフォルトコマンドが存在しない
        command = help(config);
      }
    }

    const args: Array<string> = argv.filter(v => v.slice(0, 1) !== '-');
    const flags: { [key: string]: string | true } = {};
    if (command.flags) {
      argv
        .filter(v => v.slice(0, 1) === '-') // フラグのみ出す
        .forEach(v => {
          const flagData = removePrefix(v).split('=');
          if (flagData.length > 2) {
            throw new Error(
              `The '${bold('=')}' symbol can't be used for flag's value.`
            );
          }
          const [key, value] = flagData;
          const flagKey = bold(addPrefix(key));

          const Flags = command.flags || {};
          const flagId: string | undefined = Object.keys(Flags).find(
            (id: string) => {
              const name = Flags[id].name;
              // string / array
              return typeof name === 'string'
                ? name === key
                : name.includes(key);
            }
          );
          if (flagId === undefined) {
            throw new Error(`unknown flag: ${flagKey}`);
          }

          const { hasValue } = Flags[flagId];
          const isValue = value !== undefined;

          if (hasValue === 0 && isValue) {
            throw new Error(`${flagKey} can't contain a value. (${flagKey})`);
          } else if (hasValue === 2 && !isValue) {
            throw new Error(
              `${flagKey} requires a value. (${flagKey}=[value])`
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
