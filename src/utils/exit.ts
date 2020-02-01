import { bold } from 'kleur';

export const errorExit = (e: Error): void => {
  if (e.message) {
    console.error(bold().red('ERROR:'), e.message);
  } else {
    console.error(bold().red('ERROR!'));
    console.error(e);
  }
  process.exit(1);
};
