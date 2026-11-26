import React from 'react';

export interface PuppetRigProps {
  x: number;
  y: number;
  headTilt: number;
  leftArmAngle: number;
  rightArmAngle: number;
  scale?: number;
  bodyColor?: string;
  accentColor?: string;
}

/**
 * A string puppet drawn in SVG. (x, y) is the puppet's hip point.
 * Arm angles are in degrees from hanging straight down; negative raises the
 * right arm outward, positive raises the left arm outward.
 */
export const PuppetRig: React.FC<PuppetRigProps> = ({
  x,
  y,
  headTilt,
  leftArmAngle,
  rightArmAngle,
  scale = 1,
  bodyColor = '#E07A2E',
  accentColor = '#F2C14E',
}) => {
  const shoulderY = -250;
  const armLength = 170;
  const shoulderOffset = 75;

  const handPos = (side: -1 | 1, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: side * shoulderOffset - Math.sin(rad) * armLength,
      y: shoulderY + Math.cos(rad) * armLength,
    };
  };
  const leftHand = handPos(-1, leftArmAngle);
  const rightHand = handPos(1, rightArmAngle);
  const headTop = shoulderY - 150;

  // Strings run from each control point up to the top of the frame.
  const strings = [
    { x: 0, y: headTop },
    { x: leftHand.x, y: leftHand.y },
    { x: rightHand.x, y: rightHand.y },
  ];

  return (
    <svg
      width="1080"
      height="1920"
      style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}
    >
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* Strings */}
        {strings.map((s, i) => (
          <line
            key={i}
            x1={s.x}
            y1={s.y}
            x2={s.x * 0.6}
            y2={-y / scale}
            stroke="#D9D2C3"
            strokeOpacity={0.55}
            strokeWidth={2}
          />
        ))}

        {/* Legs */}
        <rect x={-45} y={-10} width={32} height={190} rx={14} fill="#5B2C1A" />
        <rect x={13} y={-10} width={32} height={190} rx={14} fill="#5B2C1A" />

        {/* Body / robe */}
        <path
          d={`M${-shoulderOffset},${shoulderY} L${shoulderOffset},${shoulderY} L95,20 L-95,20 Z`}
          fill={bodyColor}
        />
        <rect x={-95} y={-30} width={190} height={22} fill={accentColor} />

        {/* Arms */}
        <line
          x1={-shoulderOffset}
          y1={shoulderY + 10}
          x2={leftHand.x}
          y2={leftHand.y}
          stroke={bodyColor}
          strokeWidth={30}
          strokeLinecap="round"
        />
        <line
          x1={shoulderOffset}
          y1={shoulderY + 10}
          x2={rightHand.x}
          y2={rightHand.y}
          stroke={bodyColor}
          strokeWidth={30}
          strokeLinecap="round"
        />
        <circle cx={leftHand.x} cy={leftHand.y} r={18} fill="#E8B98A" />
        <circle cx={rightHand.x} cy={rightHand.y} r={18} fill="#E8B98A" />

        {/* Head */}
        <g transform={`rotate(${headTilt}, 0, ${shoulderY})`}>
          <rect x={-14} y={shoulderY - 30} width={28} height={34} fill="#E8B98A" />
          <ellipse cx={0} cy={shoulderY - 85} rx={62} ry={70} fill="#E8B98A" />
          {/* Crown */}
          <path
            d={`M-50,${shoulderY - 130} L-30,${headTop} L0,${shoulderY - 140} L30,${headTop} L50,${shoulderY - 130} Z`}
            fill={accentColor}
          />
          {/* Eyes and tilak */}
          <circle cx={-22} cy={shoulderY - 90} r={7} fill="#1A1A1A" />
          <circle cx={22} cy={shoulderY - 90} r={7} fill="#1A1A1A" />
          <rect x={-4} y={shoulderY - 125} width={8} height={22} rx={3} fill="#C62828" />
          <path
            d={`M-20,${shoulderY - 55} Q0,${shoulderY - 42} 20,${shoulderY - 55}`}
            stroke="#7A3B2E"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
};
