type Command = {
  function: Function;
};

type Commands =
  | Command
  | {
      [key: string]: Command;
    };

type Config = {
  name: string;
  version: string;
  binName: string;
  command: Commands;
  args?: Array<string | number>;
  default?: string | number;
};

const functionSelector = (
  commands: Commands,
  arg: string | undefined
): Command => {
  if (commands.function) {
    return commands;
  }

  const hasHyphen: number = Object.keys(commands).findIndex(
    key => key.slice(0, 1) === '-'
  );
  if (hasHyphen !== -1) {
    throw new Error(
      `[CLI ERROR] The beginning of the command name can't use a hyphen.: ${hasHyphen}`
    );
  }

  const command: Command | undefined = commands[arg];
  if (!command) {
    throw new Error(`This command is not found.`);
  }
  return command;
};

const run = (config: Config): void => {
  const args: Array<string | number> =
    config.args || process.argv.filter((v, index) => index > 1);

  const flag: number = args.findIndex(v => v.slice(0, 1) !== '-');
  if (flag !== -1) {
    args.splice(flag, 1);
  }
  const command = functionSelector(config.command, args[flag]);
  command.function();
};

export default run;
