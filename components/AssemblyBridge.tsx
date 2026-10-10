export default function AssemblyBridge() {
  return (
    <div
      className="assembly-bridge"
      data-motion-scene="assembly"
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 190" className="assembly-graphic">
        <defs>
          <linearGradient id="assembly-line">
            <stop stopColor="#76b7ff" stopOpacity="0" />
            <stop offset=".5" stopColor="#76b7ff" />
            <stop offset="1" stopColor="#76b7ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="assembly-axis" d="M40 95H960" />
        <g className="assembly-cluster assembly-left">
          <path d="M325 48L410 95L325 142 M325 48V142" />
          <circle cx="325" cy="48" r="6" />
          <circle cx="325" cy="142" r="6" />
          <rect x="398" y="83" width="24" height="24" rx="5" />
        </g>
        <g className="assembly-cluster assembly-right">
          <path d="M675 48L590 95L675 142 M675 48V142" />
          <circle cx="675" cy="48" r="6" />
          <circle cx="675" cy="142" r="6" />
          <rect x="578" y="83" width="24" height="24" rx="5" />
        </g>
        <path
          className="assembly-links"
          pathLength={1}
          d="M410 95L500 95L590 95"
        />
        <circle
          className="assembly-impact-ring ring-one"
          cx="500"
          cy="95"
          r="25"
        />
        <circle
          className="assembly-impact-ring ring-two"
          cx="500"
          cy="95"
          r="38"
        />
        <g className="assembly-core">
          <rect x="484" y="79" width="32" height="32" rx="7" />
          <path d="M493 95L498 100L507 90" />
        </g>
      </svg>
    </div>
  );
}
