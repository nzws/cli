type Command = {
  function: Function;
};
type CommandName = string | number;
type Commands = { [key in CommandName]: Command };

type Config = {
  name: string;
  version: string;
  binName: string;
  command: Command;
  commands?: Commands;
  args?: Array<CommandName>;
};

const functionSelector = (commands: Commands, arg: CommandName): Command => {
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
  const args: Array<CommandName> =
    config.args || process.argv.filter((v, index) => index > 1);

  const flag: number = args.findIndex(v => String(v).slice(0, 1) !== '-');
  if (flag !== -1) {
    args.splice(flag, 1);
  }
  const command = config.commands
    ? functionSelector(config.commands, args[flag])
    : config.command;
  command.function();
};

export default run;
