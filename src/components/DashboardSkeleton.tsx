export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f0e6] pt-32 pb-20 px-4 md:px-12 animate-pulse">
      <div className="max-w-[1440px] mx-auto">
        
        {/* HEADER SKELETON */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-stone-100" />
          <div className="flex-1 space-y-4">
            <div className="h-12 w-64 bg-stone-100 rounded-2xl" />
            <div className="h-4 w-full max-w-md bg-stone-50 rounded-lg" />
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          {/* SIDEBAR SKELETON */}
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[72px] w-full bg-white rounded-[2rem] border border-stone-100" />
            ))}
          </div>

          {/* MAIN CONTENT SKELETON */}
          <div className="bg-white rounded-[3rem] border border-stone-200 p-10 space-y-10">
            <div className="h-8 w-48 bg-stone-100 rounded-lg mb-10" />
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="h-48 rounded-[2.5rem] bg-stone-50 border border-stone-100" />
              <div className="h-48 rounded-[2.5rem] bg-stone-50 border border-stone-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}