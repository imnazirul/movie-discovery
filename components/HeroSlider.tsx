"use client"

import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden dot-pattern bg-background">
      {/* Background gradient circles */}
      <div
        className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl animate-float-slow"
      />

      <div
        className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-float-slower"
      />

      <div className="container mx-auto px-4 py-20 pt-32 md:py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="opacity-0 animate-fade-in-up">
              <span className="inline-block py-1 px-3 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                BEST DEAL FOREVER
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight opacity-0 animate-fade-in-up-delay-1"
            >
              It&apos;s comfort <span className="text-gradient">first</span> & Comfort{" "}
              <span className="text-gradient">Last</span>
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-md opacity-0 animate-fade-in-up-delay-2"
            >
              Discover our collection of premium furniture designed for ultimate comfort and style for your home.
            </p>

            <div className="opacity-0 animate-fade-in-up-delay-3">
              <button
                className="h-11 px-8 rounded-full text-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                GET IT NOW
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="relative z-10 opacity-0 animate-scale-in"
            >
              <Image
                src="https://images.pexels.com/photos/6214383/pexels-photo-6214383.jpeg?auto=compress&cs=tinysrgb&w=2520&h=1500&dpr=1"
                alt="Comfortable chair"
                width={600}
                height={600}
                className="w-full h-auto object-contain rounded-md"
                priority
              />
            </div>

            {/* Animated circles */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/20 animate-pulse-ring"
            />

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/10 animate-pulse-ring-slow"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-primary animate-scroll-dot"
          />
        </div>
      </div>
    </section>
  )
}
