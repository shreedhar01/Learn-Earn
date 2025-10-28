export default function Home() {
  return (
    <main className="regural">

      {/* hero section */}
      <div className="flex flex-col md:w-7xl">
        <h1 className="text-[40px] md:text-[64px] font-bold md:w-1/2">
          <span className="block">Learn.</span> 
          <span className="block">Compete.</span> 
          <span className="block">Succeed in Trading.</span>
        </h1>
        <p className="font-medium text-[16px] md:text-[20px] md:w-1/2 text-neutral-500">Join weekly and monthly trading competition — practice real strategies, climb the leaderboard, and earn rewards while mastering the art of trading.</p>
      </div>
    </main>
  );
}
