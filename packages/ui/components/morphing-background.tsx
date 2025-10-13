"use client";

export function MorphingBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden w-full h-full">
      {/* Blue Blob */}
      <div className="blob blob-blue"></div>

      {/* Pink Blob */}
      <div className="blob blob-pink"></div>

      {/* Yellow Blob */}
      <div className="blob blob-yellow"></div>
    </div>
  );
}
