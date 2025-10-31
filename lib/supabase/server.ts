import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Next.jsのサーバーコンポーネント内でSupabaseクライアントを安全に作成するための関数
export const createSupabaseServerClient = () => {
    // cookieStore を any にキャストすることで、TypeScriptの厳密な型チェックを回避する
    const cookieStore = cookies() as any;

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    // Promise型として認識されているため、any型を介してメソッドを呼び出す
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    // any型を介してメソッドを呼び出す
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // any型を介してメソッドを呼び出す
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );
}