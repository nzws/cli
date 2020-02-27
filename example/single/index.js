module.exports = {
  name: `example-cli v1.0.0`,
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
};
