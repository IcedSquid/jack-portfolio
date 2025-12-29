import Header from "./components/Header";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      {/* KEEP HEADER */}
      <Header />

      {/* TOP BANNER */}
      <section className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-14 flex justify-center">
          <img
            src="/hometext.png"
            alt="Home title banner"
            className="w-full max-w-6xl h-auto animate-fade-up"
          />
        </div>
      </section>

      {/* WORKS / PLAYGROUND BUTTON SECTION */}
      <section className="w-full">
        {/* top gradient line */}
          <div
            className="h-[1px] w-full"
            style={{
              background:
                "linear-gradient(to right, rgba(0,204,255,0), rgba(0,204,255,1), rgba(0,204,255,0))",
            }}
          />

      <div className="mx-auto max-w-6xl flex">
    
    {/* WORKS */}
    <a
      href="/works"
      className="home-cta left flex-1 py-5 pr-20 text-right text-2xl font-bold tracking-wide text-[#6FD6FF]
      transition-colors duration-200 hover:text-black"
    >
      <span className="inline-flex items-center gap-3">
        <span className="arrow-left">&lt;&lt;</span>
        <span>WORKS</span>
      </span>

    </a>



    {/* divider line */}
    <div className="w-[1px] bg-[#00CCFF]/60" />

    {/* PLAYGROUND */}
    <a
      href="/playground"
      className="home-cta right flex-1 py-5 pl-20 text-left text-2xl font-bold tracking-wide text-[#6FD6FF] transition-colors duration-200 hover:text-black"
    >
      <span className="inline-flex items-center gap-3">
        <span>PLAYGROUND</span>
        <span className="arrow-right">&gt;&gt;</span>
      </span>

    </a>

  </div>

   {/* bottom gradient line */}
    <div
      className="h-[1px] w-full"
      style={{
        background:
          "linear-gradient(to right, rgba(0,204,255,0), rgba(0,204,255,1), rgba(0,204,255,0))",
      }}
    />

</section>

    </div>
  );
}
