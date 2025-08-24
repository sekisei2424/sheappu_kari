import type { Tend as TendType } from '@/lib/types';
import Image from 'next/image';
import { MapPin, Award } from 'lucide-react';

type TendCardProps = {
  tend: TendType;
};

export const TendCard = ({ tend }: TendCardProps) => {
    return (
        <div className="border-b border-gray-700">
            <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div>
                        <p className="font-bold text-sm">{tend.author.name}</p>
                        <p className="text-xs text-gray-400">@{tend.author.username}</p>
                    </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{tend.title}</h3>
                <div className="flex space-x-4 text-sm text-gray-400 mb-3">
                    <span className="inline-flex items-center"><MapPin size={14} className="mr-1"/>{tend.location}</span>
                    <span className="inline-flex items-center"><Award size={14} className="mr-1"/>{tend.reward}</span>
                </div>
            </div>
            {/* <Image src={tend.imageUrl} alt={tend.title} width={600} height={300} className="w-full h-48 object-cover" /> */}
             <div className="p-4">
                <button className="w-full bg-sky-500 text-white font-bold py-2 rounded-full hover:bg-sky-600 transition-colors">
                    詳細を見る
                </button>
            </div>
        </div>
    )
}