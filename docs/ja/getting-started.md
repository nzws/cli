[目次に戻る / See other languages](../README.md)

# はじめる

@dotplants/cli は TypeScript で書かれた軽量の CLI フレームワークです。  
簡単な CLI アプリケーションをすぐに作れる他、マルチコマンドモードによる複雑な CLI アプリケーションを作成することも可能です。

## 新規作成する

- 1: パッケージを依存関係に追加します。

```bash
npx add-pkg @dotplants/cli
```

- 2: コンフィグファイルを作成します。ファイルパスはどこでも構いませんが、例えば `index.js` に設置します。  
  ファイルを作成したら、次の内容を記述します：  
  **(これはシングルコマンドの場合です。マルチコマンドはサンプルや API ガイドを参照してください。)**

```javascript
module.exports = {
  name: 'Example My CLI v1.0.0', // helpコマンドなどで表示されるCLIの名前です。
  binName: 'my-cli', // CLIのコマンド名を指定します。
  command: {
    description: 'Say hello!', // コマンドの短い説明文です。
    function({ flags }) {
      // コマンドの実体です。
      console.log(`Hello, ${flags.name || 'JavaScripter'}!`);
    },
    flags: {
      // フラグを作成します。この例では --name=[value], -n=[value] というフラグが作成されます。
      name: {
        // オブジェクトのキーでフラグ名を指定します。
        name: ['name', 'n'], // フラグのキーです。配列で複数指定できます。
        description: 'your name', // フラグの短い説明文です。
        hasValue: 1 // 期待する値を0, 1, 2で指定できます。0: 真偽値のみ(オプション), 1: 真偽値か文字列(オプション), 2: 文字列のみ(必須)
      }
    }
  }
};
```

コンフィグファイルの記述について、詳細は [API ガイド](./api.md) を参照してください。

- 3: bin ファイルを作成します。 例えば、 `bin/my-cli.js` に設置します。  
  ファイルを作成したら、次の内容を記述します：

```javascript
#!/usr/bin/env node

const { run } = require('@dotplants/cli');
const config = require('../index.js'); // 先程作成したコンフィグファイルを指定します。

run(config);
```

この時点でほぼ完成しました。 `node bin/my-cli.js` コマンドを実行してすぐに試す事ができます。

- 4: `package.json` ファイルに bin オブジェクトを追加します。  
  このとき、キーは先程コンフィグで指定した `binName` と同じものに、  
  値は bin ファイルのパスを指定します。

```
{
  ...
  "bin": {
    "my-cli": "./bin/my-cli.js"
  }
}
```

**これで完了です 🎉**  
`npm link` などを使用してローカルにインストールしたり、CLI を公開してインストールして動かしてみましょう。
