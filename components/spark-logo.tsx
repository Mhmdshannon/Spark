interface SparkLogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SparkLogo({ className, size = "md" }: SparkLogoProps) {
  const sizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Red part */}
        <path
          d="M40 20C40 20 30 30 25 50C20 70 20 90 20 90L50 60C50 60 45 80 60 100L40 20Z"
          fill="#E53935"
          className="drop-shadow-md"
        />
        {/* Silver part */}
        <path
          d="M80 20C80 20 90 30 95 50C100 70 100 90 100 90L70 60C70 60 75 80 60 100L80 20Z"
          fill="#E0E0E0"
          className="drop-shadow-md"
          style={{ filter: "url(#silver-gradient)" }}
        />
        <defs>
          <linearGradient id="silver-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="50%" stopColor="#E0E0E0" />
            <stop offset="100%" stopColor="#BDBDBD" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function SparkLogoFull({ className }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <SparkLogo size="md" />
      <span className="ml-2 font-bold text-xl tracking-tight">SPARK</span>
    </div>
  )
}

