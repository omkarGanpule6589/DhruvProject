import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import "./Workflow.css";
import { Button } from "@mui/material";
interface Rectangle {
  id: any;
  x: any;
  y: any;
}
const POCworkflow: React.FC = () => {
  const [rectangle, setRectangle] = useState<Rectangle[]>([]);
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initialContainerWidth = window.innerWidth / 1.2;
  const initialContainerHeight = window.innerHeight / 1.2;

  const [stageWidth, setStageWidth] = useState<number>(initialContainerWidth);
  const [stageHeight, setStageHeight] = useState<number>(
    initialContainerHeight
  );

  const handleDragMove = (e: any) => {
    const shape = e.target;
    const { x, y, width, height } = shape.getClientRect();

    // Ensure the shape stays within the left and top bounds
    if (x < 0) {
      shape.x(0);
    }
    if (y < 0) {
      shape.y(0);
    }

    // Automatically increase the stage size and scroll the container when dragging to the right or bottom edges
    const container = containerRef.current;
    if (container) {
      if (x + width > container.scrollLeft + container.clientWidth) {
        setStageWidth((prevWidth) => prevWidth + 100); // Increase the width of the stage by 100 pixels
        container.scrollLeft += 10; // Adjust the scroll step as needed
      }
      if (y + height > container.scrollTop + container.clientHeight) {
        setStageHeight((prevHeight) => prevHeight + 50); // Increase the height of the stage by 100 pixels
        container.scrollTop += 10; // Adjust the scroll step as needed
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth / 1.5;
      const newHeight = window.innerHeight / 1.5;
      setStageWidth(newWidth);
      setStageHeight(newHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const AddRects = () => {
    const stage = stageRef.current;
    const pos = stage?.getPointerPosition();
    const x = pos?.x || 0;
    const y = pos?.y || 0;
    const id = Math.random();
    const newreact = {
      id: id,
      x: (Math.random() * window.innerWidth) / 3,
      y: (Math.random() * window.innerHeight) / 3,
    };
    setRectangle((preRecs) => [...preRecs, newreact]);
  };
  return (
    <>
      <div style={{ height: "40px", marginTop: "0px", marginBottom: "5px" }}>
        <Button variant="contained" onClick={AddRects}>
          Add
        </Button>
      </div>
      <div className="stage-container" ref={containerRef}>
        <Stage ref={stageRef} width={stageWidth} height={stageHeight}>
          <Layer>
            {rectangle.map((recttest) => (
              <Rect
                key={recttest.id}
                id={recttest.id}
                x={recttest.x}
                y={recttest.y}
                width={100}
                height={100}
                fill="lightdark"
                draggable
                onDragMove={handleDragMove}
              />
            ))}

            {/* <Rect
              x={50}
              y={50}
              width={100}
              height={100}
              fill="red"
              draggable
              onDragMove={handleDragMove}
            /> */}
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default POCworkflow;
