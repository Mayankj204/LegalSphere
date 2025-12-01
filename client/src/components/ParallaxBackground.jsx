// src/components/ParallaxBackground.jsx
export default function ParallaxBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* large slow rotating radial gradient */}
      <div className="absolute -right-1/3 -top-40 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-ls-red/30 to-transparent opacity-30 animate-slowSpin blur-3xl"></div>

      {/* left small glow */}
      <div className="absolute -left-72 -bottom-40 w-[500px] h-[500px] rounded-full bg-ls-red/20 opacity-30 blur-2xl animate-driftX"></div>

      {/* floating particles */}
      <div className="absolute inset-0">
        <div className="absolute left-10 top-40 w-3 h-3 rounded-full bg-ls-red/60 animate-floaty opacity-80"></div>
        <div className="absolute left-40 top-64 w-2 h-2 rounded-full bg-ls-red/50 animate-floaty" style={{ animationDelay: '0.6s' }}></div>
        <div className="absolute right-36 top-24 w-4 h-4 rounded-full bg-ls-red/40 animate-floaty" style={{ animationDelay: '1s' }}></div>
        <div className="absolute right-10 bottom-32 w-6 h-6 rounded-full bg-ls-red/20 animate-floaty" style={{ animationDelay: '1.4s' }}></div>
      </div>

      {/* subtle horizontal red accent bar */}
      <div className="absolute left-0 right-0 bottom-0 h-24 bg-gradient-to-r from-transparent via-ls-red/6 to-transparent blur-xl" />
    </div>
  );
}
