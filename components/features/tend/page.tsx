import { TendCard as TendCardComponent } from '@/components/features/tend/TendCard';
import type { Tend as TendTypeForPage } from '@/lib/types';

const mockTends: TendTypeForPage[] = [
    {
        id: '1',
        title: '農業体験ボランティア募集',
        category: '農作業',
        location: '〇〇県△△市',
        reward: '謝礼あり',
        imageUrl: 'https://placehold.co/600x300/2E3440/E5E9F0?text=農作業',
        author: { id: 'user1', name: '農家A', username: 'farmer_a', avatarUrl: 'https://placehold.co/100x100/4C566A/E5E9F0?text=A' },
    },
]

export default function TendPage() {
    return (
        <div>
            <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 p-4">
                <h1 className="text-xl font-bold">Tend</h1>
            </header>
            <div>
                {mockTends.map(tend => <TendCardComponent key={tend.id} tend={tend} />)}
            </div>
        </div>
    );
}