const cli = require('../build');
const { version } = require('./package');

cli({
  name: `example-cli ${version}`,
  binName: 'example',
  command: {
    description: 'Say hello!',
    function({ flags }) {
      console.log(`Hello, ${flags.name || 'JavaScripter'}!`);
    },
    flags: {
      name: {
        name: ['name', 'n'],
        description: 'your name',
        hasValue: 1
      }
    }
  }
});
