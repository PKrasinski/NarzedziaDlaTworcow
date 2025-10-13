interface LogoProps {
  variant?: "default" | "white";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  variant = "default",
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const logoSrc = variant === "white" ? "/logo-white.png" : "/logo.png";

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <img
        src={logoSrc}
        alt="NarzędziaDlaTwórców.pl"
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <span
          className={`${textSizeClasses[size]} font-bold text-gray-900`}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          NarzędziaDlaTwórców.pl
        </span>
      )}
    </div>
  );
}
