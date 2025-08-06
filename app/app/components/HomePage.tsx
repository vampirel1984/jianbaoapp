'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [adWatched, setAdWatched] = useState(false);
  const router = useRouter();

  const handleWatchAd = () => {
    // TODO: 替换为真实广告播放逻辑
    setTimeout(() => {
      setAdWatched(true);
    }, 3000); // 模拟广告播放
  };

  const handleEnter = () => {
    router.push('/detect');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="text-3xl font-bold mb-6">欢迎使用鉴宝AI</h1>

      {!adWatched ? (
        <button
          onClick={handleWatchAd}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow"
        >
          观看广告进入鉴宝
        </button>
      ) : (
        <button
          onClick={handleEnter}
          className="mt-4 px-6 py-3 bg-green-600 text-white rounded-xl shadow"
        >
          进入鉴宝
        </button>
      )}
    </div>
  );
}