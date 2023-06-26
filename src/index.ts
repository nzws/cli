// Types
export enum ValueType {
  Boolean,
  BooleanOrString,
  String
}

export interface Command {
  summary: string;
  description?: string | string[];
  args?: {
    [key in keyof Arguments]: {
      description: string;
    };
  };
  flags?: {
    [key in keyof Flags]: {
      flag: string | string[];
      summary: string;
      description?: string | string[];
      hasValue?: Flags[key] extends string | boolean
        ? ValueType.BooleanOrString
        : Flags[key] extends string
        ? ValueType.String
        : ValueType.Boolean;
    };
  };
  execute: (args: Arguments, flags: Flags) => void | Promise<void>;
}

export interface Config {
  cliName: string;
  binName: string;
  commands: Record<string, Command>;
  defaultCommand?: string;
  argv?: string[];
}
// End of types

// ------------

// Boot function
export const boot = async (config: Config) => {
  try {
    await core(config);
  } catch (e) {
    errorExit(e as Error);
  }
};

const core = async (config: Config) => {
  const argv = config.argv || process.argv.slice(2);
  const arguments = argv.filter(v => v[0] !== '-');
  const flags = argv.filter(v => v[0] === '-').map(removePrefix);

  // inject built-in commands (but not overwrite)
  config.commands.help = config.commands.help || help(config);

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

  const args: Array<string> = argv.filter(v => v[0] !== '-');
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
            return typeof name === 'string' ? name === key : name.includes(key);
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
          throw new Error(`${flagKey} requires a value. (${flagKey}=[value])`);
        }

        flags[flagId] = value || true;
      });

    Object.keys(command.flags).forEach(id => {
      const config = (command.flags || {})[id];
      if (config.hasValue === 2 && flags[id] === undefined) {
        const flagKey =
          typeof config.name === 'string' ? config.name : config.name[0];
        throw new Error(
          `flag '${bold(id)}' requires a value. (${addPrefix(flagKey)}=[value])`
        );
      }
    });
  }

  await Promise.resolve(command.function({ args, flags, isDefault }));
};
// End of boot function

// ------------

// Built-in function: help
const help = ({
  name,
  binName,
  command,
  commands,
  defaultCommand
}: ConfigTypes): Command => ({
  description: 'Show the help of cli',
  function({ args }: commandFunction): void {
    const msg: Array<string | false | undefined> = [bold(name), ''];
    const helpCommand = args[0];

    // (multi) [bin] help [command]: [command] の詳細
    // (multi) [bin] help: デフォルトコマンド
    // (single) [bin] help: コマンド
    if (command || (defaultCommand && commands) || helpCommand) {
      const data = commands
        ? commands[helpCommand || defaultCommand || '']
        : command;

      if (data) {
        const moreDesc =
          data.moreDescription &&
          (typeof data.moreDescription === 'string'
            ? data.moreDescription
            : data.moreDescription.join('\n'));

        msg.push(
          `Usage: ${binName} ${helpCommand ? `${helpCommand} ` : ''}${
            data.argsName
              ? data.argsName.map((v: string) => `[${v}] `).join('')
              : ''
          }[options]`,
          data.description || helpCommand || defaultCommand,
          moreDesc
        );

        if (data.flags) {
          msg.push(
            '',
            'Options:',
            ...Object.keys(data.flags).map(key => {
              if (!data.flags) return '';
              const flag = data.flags[key];
              if (typeof flag.name === 'string') {
                flag.name = [flag.name];
              }
              const names = flag.name.map(
                (v: string) =>
                  bold(addPrefix(v)) + (flag.hasValue ? `=[value]` : '')
              );

              return `  ${names.join(', ')}: ${flag.description || key} ${
                flag.hasValue === 2 ? bold('(required)') : ''
              }`;
            })
          );
        }
      } else {
        throw new Error('This command is not found.');
      }
    }

    // multi: コマンド一覧
    if (commands && !helpCommand) {
      if (defaultCommand) {
        msg.push('');
      }

      msg.push(`Usage: ${binName} [command] [options]`, '', 'Commands:');
      msg.push(
        ...Object.keys(commands).map(
          key => `  - ${bold(key)}: ${commands[key].description || key}`
        )
      );
      msg.push(
        '',
        `Run "${bold(
          `${binName} help [command]`
        )}" for detailed usage of the command.`
      );
    }

    console.log(msg.filter(v => v !== false && v !== undefined).join('\n'));
  }
});
// End of built-in function: help

// ------------

// Internal Utilities
const errorExit = (e: Error): void => {
  if (e.message) {
    console.error(colorful('ERROR:', Colors.Bold, Colors.Red), e.message);
  } else {
    console.error(colorful('ERROR!', Colors.Bold, Colors.Red));
    console.error(e);
  }

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

const addPrefix = (key: string) => (key.length === 1 ? '-' : '--') + key;

const removePrefix = (key: string) =>
  key.slice(key[1] === '-' ? 2 : key[0] === '-' ? 1 : 0);

enum Colors {
  Reset = '\u001b[0m',
  Bold = '\u001b[1m',
  Red = '\u001b[31m'
}

const colorful = (str: string, ...color: Colors[]) =>
  color.join('') + str + Colors.Reset;
