# @nzws/cli

[![npm (scoped)](https://img.shields.io/npm/v/@nzws/cli?style=for-the-badge)](https://github.com/nzws/cli/releases)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@nzws/cli?style=for-the-badge)](https://npm.im/@nzws/cli)

Super lightweight CLI framework for Node.js

## Features

- **Super easy**: Just write a simple config file. Create your CLI in 3 minutes! (maybe)
- **Super lightweight**: No dependencies, only ??KB. (todo)
- **Built for TypeScript**: Written in TypeScript and provides safe to you by type-guard.

## Usage (Simplified)

### 1. Install

```bash
yarn add @nzws/cli # and ts-node if you want
# or npm @nzws/cli
# or pnpm add @nzws/cli
```

### 2. Create config file

Example: `cli.ts`

```typescript
import { boot, ValueType } from '@nzws/cli';

void boot({
  cliName: 'Example My CLI v1.0.0',
  binName: 'yarn ts-node cli.ts',
  commands: {
    hello: {
      summary: 'Say hello!',
      execute(flags) {
        console.log(`Hello, ${flags.name || 'TypeScripter'}!`);
      },
      flags: {
        name: {
          flag: ['name', 'n'],
          description: 'your name',
          hasValue: ValueType.BooleanOrString
        }
      }
    },
    bye: {
      summary: 'Say bye!',
      function() {
        console.log('Bye!');
      }
    }
  },
  defaultCommand: 'hello'
});
```

### 3. Run

```bash
yarn ts-node cli.ts -n=nzws
# Hello, nzws!

yarn ts-node cli.ts --name=nzws
# Hello, nzws!

yarn ts-node cli.ts
# Hello, TypeScripter!

yarn ts-node cli.ts bye
# Bye!
```

That's all! 🎉

- If you want to make CLI prefix more simpler (like: `yarn cli hello` or `your-cli hello`), read this👉 [Add scripts or bin to your package.json](./docs/add-scripts-or-bin.md)
- If you want to understand how to write a config file, read this👉 [Spec: boot config](./docs/spec-boot-config.md)

## What happened to `@dotplants/cli`?

`@dotplants` was a OSS organization @nzws created. Due to all team members getting busy, I decided to stop activities and most of the projects were archived.
However, some still-used projects were transferred as personal projects, there is no change of the maintainer.

## License

MIT
