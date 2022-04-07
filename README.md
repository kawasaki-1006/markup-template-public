# Markup Template

## DocumentRoot

/public/htdocs

## Node.jsのインストール（v14.17.6）
https://nodejs.org/download/release/v14.17.6/

## yarn のインストール（v1.22.18）
下記からインストールしてください。
https://classic.yarnpkg.com/lang/en/

## node_modules の生成

    $ yarn install

## npm scripts
    $ yarn run 〇〇

### コマンド一覧

- `development`: webpack と Gulp の起動
- `production`: TypeScript と Sass のコンパイル（製品モード）
- `images:all`: 画像最適化と webp 生成を行う
- `gulp:default`: Gulp を起動
- `gulp:sass`: Sass のコンパイル（開発モード）
- `gulp:sass-production`: Sass のコンパイル（製品モード）
- `gulp:ejs`: EJS のコンパイル
- `gulp:compress-image`: 画像最適化と webp 生成を行う
- `gulp:webp`: webp 画像の生成
- `webpack:watch`: TypeScript ファイルの監視とコンパイル(開発モード)
- `webpack:development`: TypeScript ファイルのコンパイル（開発モード）
- `webpack:production`: TypeScript ファイルのコンパイル（製品モード）
- `prettier:quick`: HTML と TypeScript のコードの最適化
- `package-update`: パッケージの更新
