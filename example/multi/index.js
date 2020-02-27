module.exports = {
  name: `example-multi-cli v1.0.0`,
  binName: 'example-multi',
  defaultCommand: 'debug',
  commands: {
    debug: {
      description: 'debug',
      function({ args, flags }) {
        console.log(args, flags);
      },
      argsName: ['test', 'test2'],
      flags: {
        flag: {
          name: ['flag', 'f'],
          description: 'flag (bool)'
        },
        hasValueFlag: {
          name: ['value-flag', 'v'],
          description: 'flag (text)',
          hasValue: 1
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
          hasValue: 2
        }
      }
    }
  }
};
