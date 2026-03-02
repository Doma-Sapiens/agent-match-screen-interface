interface ConnectionLineProps {
  fromId: string;
  toId: string;
  isVisible: boolean;
}

export function ConnectionLine({ fromId, toId, isVisible }: ConnectionLineProps) {
  if (!isVisible) return null;

  return (
    <svg 
      className="absolute inset-0 pointer-events-none z-10"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#1976D2"
          />
        </marker>
      </defs>
      <line
        x1="50%"
        y1="50%"
        x2="50%"
        y2="50%"
        stroke="#1976D2"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
        className="animate-pulse"
      />
    </svg>
  );
}