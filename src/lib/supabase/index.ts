// クライアントサイド用
export { createClient } from './client'

// サーバーサイド用（Server Components, Route Handlers）
export { createClient as createServerClient } from './server'

// 管理者用（Payload CMS 同期など）
export { createAdminClient } from './admin'
