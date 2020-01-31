const cli = require('../build');
const { version } = require('./package');

cli({
  name: `example-cli ${version}`,
  binName: 'example',
  default: 'debug',
  commands: {
    debug: {
      function({ args, flags }) {
        console.log(args, flags);
      },
      argsName: [],
      flags: {
        flag: {
          name: ['flag', 'f']
        },
        hasValueFlag: {
          name: ['value-flag', 'v'],
          hasValue: true
        }
      }
    },
    hello: {
      function({ flags }) {
        console.log(`Hello, ${flags.name || 'JavaScripter'}!`);
      },
      flags: {
        name: {
          name: ['name', 'n'],
          hasValue: true
        }
      }
    }
  }
});
