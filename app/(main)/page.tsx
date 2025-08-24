'use client';

import { useState } from 'react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'tab1' | 'tab2'>('tab1');

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 grid grid-cols-2">
        <button
          className={`py-3 text-center font-semibold transition-colors ${
            activeTab === 'tab1'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('tab1')}
        >
          個人
        </button>
        <button
          className={`py-3 text-center font-semibold transition-colors ${
            activeTab === 'tab2'
              ? 'text-white border-b-2 border-blue-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('tab2')}
        >
          企業
        </button>
      </div>
      <div className="flex-1">
        {activeTab === 'tab1' && (
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">一般ユーザーの投稿</h1>
            <p>個人の投稿を載せるよ</p>
          </div>
        )}
        {activeTab === 'tab2' && (
          <div className="p-4">
            <h1 className="text-xl font-bold mb-2">企業からの投稿</h1>
            <p>企業アカウントの投稿を載せるよ</p>
          </div>
        )}
      </div>
    </div>
  );
}
