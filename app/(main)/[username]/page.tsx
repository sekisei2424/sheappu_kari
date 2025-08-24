const mockUserProfile = {
  name: "田中 太郎",
  username: "taro_tanaka",
  avatarUrl: "https://placehold.co/150x150/2E3440/E5E9F0?text=User",
  bannerUrl: "https://placehold.co/600x200/4C566A/E5E9F0?text=Banner",
  bio: "都内から移住してきました。週末は畑作業を楽しんでいます。地域の魅力的な場所やイベントを発信していきたいです。",
  following: 120,
  followers: 250,
};

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const username = params.username;

  return (
    <div>
      <header className="border-b border-gray-700">
        <div className="relative">
          <div className="absolute -bottom-16 left-4">
            <div className="border-4 border-gray-900 rounded-full">
            </div>
          </div>
        </div>
        <div className="p-4 pt-20">
            <div className="flex justify-end">
                <button className="border border-gray-500 text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800 transition-colors">
                    プロフィールを編集
                </button>
            </div>
          <h1 className="text-2xl font-bold">{mockUserProfile.name}</h1>
          <p className="text-gray-500">@{username}</p>
          <p className="mt-4">{mockUserProfile.bio}</p>
           <div className="flex space-x-4 mt-4 text-gray-500">
                <p><span className="font-bold text-white">{mockUserProfile.following}</span> フォロー中</p>
                <p><span className="font-bold text-white">{mockUserProfile.followers}</span> フォロワー</p>
            </div>
        </div>
      </header>
    </div>
  );
}