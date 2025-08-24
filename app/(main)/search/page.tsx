import { Search as SearchIcon } from 'lucide-react';

export default function SearchPage() {
    return (
        <div>
            <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm p-2">
                 <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input 
                        type="text" 
                        placeholder="検索"
                        className="w-full bg-gray-800 border border-gray-700 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                </div>
            </header>
            <div className="p-4">
                <p className="text-center text-gray-500 mt-8">ユーザーや投稿を検索してみましょう。</p>
            </div>
        </div>
    );
}