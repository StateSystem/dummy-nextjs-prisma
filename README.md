# dummy-nextjs-prisma

- 対象: EV058, EV060, EV133, EV163, EV164。
- 起動: `npm ci` の後、`DATABASE_URL` を設定し、下記の初期化を行って `npm run build && npm start`。
- デフォルト PORT: 3000。環境変数 `PORT` で変更可。待受: `0.0.0.0`。
- ブランチ: `main` のみ、デフォルトも `main`。Dockerfile なし。Next.js の通常ビルド・起動経路で検証する。
- Node.js 22 以上。`GET /health` は HTTP 200 と `{"ok":true,"app":"dummy-nextjs-prisma"}` を返す。


## データベース

PostgreSQL。Prisma 6 系を使用し、接続先は `schema.prisma` の `DATABASE_URL` から読む。
接続 URL の `schema` にプラットフォーム指定の schema を設定し、`public` や特定テナント名をコードに固定しない。
`.env.example` はプレースホルダーのみ。実際の接続情報は環境変数か Git 管理外の `.env` で設定する。
`Item(id, name)` をトップ画面で動的に読み込む。DB 障害を空リストに置き換えない。
`/health` はアプリの生存確認で、DB 接続の確認ではない。DB 接続はトップ画面で確認する。
seed ファイル・設定・自動 INSERT はない。ビルド・起動では migrate / db push を実行しない。
デプロイ時の DB 初期化・更新は DEParture が担当する。

ローカル専用の空 DB を用意し、接続先を確認して以下を実行する。

```sh
npx prisma migrate deploy
npm run build
npm start
```


SQL コンソールで対象 schema を選択し、次のように手動で投入するとトップ画面に表示される。
schema が検索パスにない場合は、実際の schema 名でテーブルを修飾する。

```sql
SELECT * FROM "Item";
INSERT INTO "Item" ("name") VALUES ('manual verification');
```

## EV058 / EV060 / EV163 / EV164 / EV133

初期 migration は `prisma/migrations` にコミットする。初回は Item が空であることを確認し、SQL INSERT 後の表示、再デプロイ後のデータ保持を確認する。
共有 schema、接続情報マスク、専用 Supabase が作られないことは DEParture で確認する。

2 回目の変更例: Item に `description String?` を追加し、専用のローカル開発 DB に対して
`npx prisma migrate dev --name add_item_description` を実行する。schema と新 migration を commit / push して再デプロイする。
本番 DB に migrate dev や reset を実行しない。新カラムと既存データの保持を SQL / introspect で確認する。
この追加カラムは初期版には含めない。

EV133 は別 Workspace の Plus プロジェクト 2 つにこの repo をデプロイする。
A の権限で B のテーブルを読めないことを確認する。アプリ単体ではテナント隔離を保証しない。

## 依存関係の既知事項

検証時の npm audit は Prisma 6.19.3 の間接依存 deepmerge-ts に関する high を 3 件報告（同一問題の依存チェーン）。GHSA-ggr8-5vv4-36mx。自動の強制ダウングレードは適用していない。依存更新時は migration と接続 schema の動作を再確認する。
