const cli = require('../build');
const { version } = require('./package');

cli({
  name: `example-multi-cli ${version}`,
  binName: 'example-multi',
  defaultCommand: 'debug',
  commands: {
    debug: {
      description: 'debug',
      function({ args, flags }) {
        console.log(args, flags);
      },
      argsName: [],
      flags: {
        flag: {
          name: ['flag', 'f'],
          description: 'flag (bool)'
        },
        hasValueFlag: {
          name: ['value-flag', 'v'],
          description: 'flag (text)',
          hasValue: true
        }
      }
    },
    hello: {
      description: 'hello',
      function({ flags }) {
        console.log(`Hello, ${flags.name || 'JavaScripter'}!`);
      },
      flags: {
        name: {
          name: ['name', 'n'],
          description: 'your name',
          hasValue: true
        }
      }
    }
  }
});