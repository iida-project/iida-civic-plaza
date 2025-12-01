import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

// Users コレクション（管理者ユーザー）
const Users = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'name',
      type: 'text' as const,
      label: '名前',
    },
  ],
}

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // 管理画面の設定
  admin: {
    user: Users.slug,
    meta: {
      title: '飯田の市民活動ひろば 管理画面',
      description: 'コンテンツ管理システム',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // コレクション
  collections: [Users],

  // データベース設定（PostgreSQL）
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),

  // リッチテキストエディタ（Lexical）
  editor: lexicalEditor(),

  // シークレット
  secret: process.env.PAYLOAD_SECRET || '',

  // TypeScript設定
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
