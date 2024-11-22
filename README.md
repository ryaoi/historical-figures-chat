# 偉人に聞こう！

## 環境設定

1. `.env.sample` をコピーして `.env` ファイルを作成します：

```bash
cp .env.sample .env
```


2. `.env` ファイルを編集し、必要な環境変数を設定します：
- `VITE_OPENAI_API_KEY`: OpenAI APIキーを設定してください。[OpenAIダッシュボード](https://platform.openai.com/account/api-keys)から取得できます。

## 開発環境のセットアップ

1. 依存関係をインストールします：

```bash
npm install
```

2. 開発サーバーを起動します：

```bash
npm run dev
```


## 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動します
- `npm run build`: プロダクション用にビルドします
- `npm run preview`: ビルドしたアプリケーションをプレビューします