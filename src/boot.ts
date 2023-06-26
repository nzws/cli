import { ValueType, boot } from '.';

void boot({
  cliName: 'test',
  binName: 'test',
  commands: {
    test: {
      summary: 'test',
      execute: (flags, flag) => {
        flag.flag;
        console.log('test');
      },
      flags: {
        flag: {
          flag: 'f',
          summary: 'test',
          hasValue: ValueType.String
        }
      }
    }
  }
});
