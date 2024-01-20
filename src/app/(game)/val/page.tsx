import SearchBar from '@/app/components/shared/SearchBar';

export default function Page() {
  return (
    <div className="flex flex-col">
      <p className="text-2xl text-center py-4 text-gray-500">FIND YOUR GAME STATS</p>
      <SearchBar />
    </div>
  );
}
