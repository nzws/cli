import { bold } from 'kleur';
import { Command, commandFunction, Config } from '../runner';

const help = ({
  name,
  binName,
  command,
  commands,
  defaultCommand
}: Config): Command => ({
  description: 'Show the help of cli',
  function({ args }: commandFunction): void {
    const msg: Array<string | false | undefined> = [bold(name), ''];
    const helpCommand = args[0];

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
          ...[
            `Usage: ${binName} ${helpCommand ? `${helpCommand} ` : ''}${
              data.argsName ? data.argsName.map(v => `[${v}] `).join() : ''
            }[options]`,
            data.description || helpCommand || defaultCommand,
            moreDesc
          ]
        );

        if (data.flags) {
          msg.push(
            ...['', 'Options:'],
            ...Object.keys(data.flags).map(key => {
              if (!data.flags) return '';
              const flag = data.flags[key];
              if (typeof flag.name === 'string') {
                flag.name = [flag.name];
              }
              const names = flag.name.map(
                v =>
                  bold(v.length === 1 ? `-${v}` : `--${v}`) +
                  (flag.hasValue ? `=[value]` : '')
              );

              return `  ${names.join(', ')}: ${flag.description || key}`;
            })
          );
        }
      } else {
        throw new Error('This command is not found.');
      }
    }

    if (commands && !helpCommand) {
      if (defaultCommand) {
        msg.push('');
      }

      msg.push(...[`Usage: ${binName} [command] [options]`, '', 'Commands:']);
      msg.push(
        ...Object.keys(commands).map(
          key => `  - ${bold(key)}: ${commands[key].description || key}`
        )
      );
      msg.push(
        ...[
          '',
          `Run "${bold(
            `${binName} help [command]`
          )}" for detailed usage of the command.`
        ]
      );
    }

    console.log(msg.filter(v => v !== false && v !== undefined).join('\n'));
  }
});

export default help;