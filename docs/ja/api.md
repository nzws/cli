[目次に戻る / See other languages](../README.md)

# API ガイド

## run(config)

`config` とコマンドライン引数を元に内容を解析し関数を実行します。

### config

> 型を使用することもできます：
>
> ```typescript
> import { ConfigTypes } from '@dotplants/cli';
>
> const config: ConfigTypes = { ... };
> module.exports = config;
> ```

- `name` <[string]>: CLI の名前です。バージョン等を含める事もできます。
- `binName` <[string]>: CLI の bin 名です。
- `command` <[Command]> (Optional): シングルコマンドモードの際のコマンドオブジェクトです。
- `commands` <[Commands]> (Optional): マルチコマンドモードの際のコマンドオブジェクトです。
- `defaultCommand` <[string]> (Optional): マルチコマンドモードの際、何も指定されなかった場合にこのコマンドを実行します。(`defaultCommand` が記入されておらず、コマンドが呼び出されなかった場合は `help` が表示されます)
- `args` <[Array]<[string]>> (Optional): 解析対象の引数です。通常は必要ありません。指定しない場合、 `process.argv` が使用されます。

### Command

- `description` <[string]>: `help` コマンドに記述される短い説明です。
- `moreDescription` <[string] | [Array]<[string]>> (Optional): `help command1` のような詳細なヘルプコマンドにのみ表示される長い説明です。[Array] にすると改行が簡単に記述できます。
- `function` <[commandFunction] => [void] | [Promise]<[void]>>: 実行するコマンドの関数です。
- `argsName` <[Array]<[string]>> (Optional): ヘルプコマンドで使用される引数の名前を指定します。
- `flags` <[object]> (Optional): フラッグを連想配列で指定します。key が `function` に渡されるフラッグデータの key になります。
  - `name` <[string] | [Array]<[string]>>: フラッグのキーを指定します。配列で複数指定できます。一文字であればプレフィックスは `-`、二文字以降は `--` と自動的に設定されます。
  - `description` <[string]>: フラッグの短い説明です。
  - `hasValue` <0 | 1 | 2>: 期待する値を 0, 1, 2 で指定できます。0: 真偽値のみ(Optional), 1: 真偽値か文字列(Optional), 2: 文字列のみ(Required)

### CommandFunction

コマンドの関数に次のような値を引数に提供します。コマンドの関数からは [void] または [Promise]<[void]> が返される事を期待します。もし関数からエラーが返された場合、異常終了として表示します。

```javascript
const command = ({ args, flags, isDefault }) => { ... };
```

- `args` <[Array]<[string]>>: 引数を配列で提供します。
- `flags` <[object]>: フラッグを連想配列で提供します。キーは [Command] の `flags` で指定したキーが使用されます。
- `isDefault` <[boolean]>: デフォルトコマンドとしてコマンドが起動されたかどうか提供します。

### Commands

連想配列で [Command] コマンドオブジェクトを記述します。

```
# index.js

module.exports = {
  ...
  commands: {
    command1: { ... },
    command2: { ... }
  }
};
```

[number]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Numbers
[string]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#String
[object]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Object
[promise]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Promise
[date]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Dates
[array]: https://developer.mozilla.org/ja/docs/Web/JavaScript/Data_structures#Indexed_collections_Arrays_and_typed_Arrays
[boolean]: https://developer.mozilla.org/ja/docs/Glossary/Boolean
[any]: #
[void]: #
[command]: #command
[commands]: #commands
[commandfunction]: #commandfunction
