export function WaveDivider() {
  return (
    <div className="w-full overflow-hidden leading-none my-2" aria-hidden="true">
      <svg
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-[60px]"
      >
        <path
          d="M0,22 C200,2 400,42 600,22 C800,2 1000,42 1200,22"
          fill="none"
          stroke="#78BF5A"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M0,46 C200,26 400,56 600,36 C800,16 1000,46 1200,26"
          fill="none"
          stroke="#6EB1E0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M0,38 C200,18 400,58 600,38 C800,18 1000,58 1200,38"
          fill="none"
          stroke="#F7BD36"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M0,30 C200,10 400,50 600,30 C800,10 1000,50 1200,30"
          fill="none"
          stroke="#E05555"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
