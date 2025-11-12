import { Handle, NodeProps, Position } from "@xyflow/react";
import "./customNode.css";
const handleStyleRWK = {
  top: 10,
  backgroundColor: "gray",
  width: 8,
  height: 8,
  border: "none",
};
const handleStyle = {
  top: 40,
  backgroundColor: "red",
  width: 8,
  height: 8,
  border: "none",
};
const CustomNodeHandle = (props: NodeProps) => {
  const { data }: any | unknown = props;
  console.log("Data Node", props);
  return (
    <>
      <div className="text-updater-node">
        <Handle
          type="target"
          position={Position.Top}
          id="a"
          style={{
            color: "gray",
            width: 8,
            height: 8,
            border: "none",
            backgroundColor: "green",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="b"
          style={{
            color: "gray",
            width: 8,
            height: 8,
            border: "none",
            backgroundColor: "green",
          }}
        />
        <div>{data?.label}</div>
        <Handle
          type="source"
          position={Position.Right}
          id="c"
          style={handleStyleRWK}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="d"
          style={handleStyleRWK}
        />

        <Handle
          type="source"
          position={Position.Right}
          id="e"
          style={handleStyle}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="f"
          style={handleStyle}
        />
      </div>
    </>
  );
};

export default CustomNodeHandle;
