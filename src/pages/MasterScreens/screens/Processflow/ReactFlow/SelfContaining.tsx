import { BaseEdge, BezierEdge, EdgeProps } from "@xyflow/react";

const SelfContaining = (props: EdgeProps) => {
  if (props.source !== props.target) {
    return <BezierEdge {...props} />;
  }
  const { sourceX, sourceY, targetX, targetY, style, markerEnd } = props;

  const radiusX = (sourceX - targetX) * 0.6;
  const radiusY = 30;
  const edgePath =
    style?.stroke === "gray"
      ? `M ${sourceX - 5} ${sourceY} A ${radiusX} ${radiusY} 0 1 0 ${
          targetX + 2
        } ${targetY}`
      : `M ${sourceX - 5} ${sourceY} A ${radiusX} ${40} 0 1 0 ${
          targetX + 2
        } ${targetY}`;
  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: style?.stroke === "gray" ? "gray" : "red",
        strokeWidth: 4,
      }}
      markerEnd={markerEnd}
    />
  );
};

export default SelfContaining;
