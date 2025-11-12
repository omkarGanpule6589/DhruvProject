import { useEffect, useState, useRef } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Arrow,
  Group,
  Transformer,
} from "react-konva";
import Popup from "./Popup";

import { v4 as uuid } from "uuid";
import MuiModules from "../MUI-Module/MuiImports";
import { ErrorHandlingmodelling1st } from "../pages/TransactionScreens/ErrorHandling/ErrorHandling";
import { steps } from "./StepsApi";
interface Rectangle {
  id: string;
  stepId: string;
  x: number;
  y: number;
  width: number;
  height: number;
  children: string[];
  childrengreen: string[];
  itselfchildren: string[];
  GreenRectProp: string;
  RedRectProp: string;
  GreyRectProp: string;
  Attributes: { [key: string]: string };
  IsBeginStep: Boolean;
  IsDefaultStep: Boolean;
}
const AppWorkflow = () => {
  const initialContainerWidth = window.innerWidth / 1.2;
  const initialContainerHeight = window.innerHeight / 1.2;

  const [stageWidth, setStageWidth] = useState<number>(initialContainerWidth);
  const [stageHeight, setStageHeight] = useState<number>(
    initialContainerHeight
  );
  const Rect_id = uuid();

  const [rect, setRect] = useState<Rectangle[]>([]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedRectangle, setSelectedRectangle] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [startRect, setStartRect] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [startRectColor, setStartRectColor] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setSelectedFile(file);

    reader.onload = (e) => {
      try {
        //  const jsonData = JSON.parse(e.target.result);
        //  setRect(jsonData);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    reader.readAsText(file);
  };

  const downloadRectJson = () => {
    const json = JSON.stringify(rect, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Workflow.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await steps(1);
      if (response.data) {
        const res = response.data.value[0]?.ProcessflowSteps;
        const templist: Rectangle[] = [];
        const gridSize = 220; // Adjust spacing between rectangles
        let x = 50; // Starting x position
        let y = 50; // Starting y position
        const columns = 5; // Number of columns in the grid

        res.forEach((rect, index) => {
          const newRect = {
            id: rect.ProcessflowStepId,
            stepId: rect.ProcessflowStepName,
            x: x,
            y: y,
            width: 100,
            height: 100,
            children: [],
            childrengreen: [],
            itselfchildren: [],
            GreenRectProp: "Green",
            RedRectProp: "Red",
            GreyRectProp: "Grey",

            Attributes: {
              attibute1: "RectAttribute" + index,
              attibute2: "RectAttribute" + index,
            },
            IsBeginStep: rect.IsBeginStep,
            IsDefaultStep: rect.IsDefaultStep,
          };

          if (rect.IsDefaultStep && index > 0) {
            templist[index - 1].childrengreen = [rect.ProcessflowStepId];
          }
          if (rect.AlternateStepDetailAlternateSteps.length > 0) {
            rect.AlternateStepDetailAlternateSteps.map((item) => {
              if (item.IsDeleted != true) {
                newRect.children = [
                  ...newRect.children,
                  item.ProcessflowStepId,
                ];
              }
            });
          }
          if (rect.ReworkStepDetailReworkSteps.length > 0) {
            rect.ReworkStepDetailReworkSteps.map((item) => {
              if (item.IsDeleted != true) {
                newRect.itselfchildren = [
                  ...newRect.itselfchildren,
                  item.ProcessflowStepId,
                ];
              }
            });
          }

          templist.push(newRect);

          // Update x and y for the next rectangle
          if ((index + 1) % columns === 0) {
            x = 50; // Reset x to the start of the next row
            y += gridSize; // Move y down by gridSize
          } else {
            x += gridSize; // Move x to the right by gridSize
          }
        });
        setRect(templist);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately
    }
  };
  const myref = useRef(null);
  const transref = useRef(null);

  const handleRectMouseDown = (event, rectId, rectColor) => {
    if (rectId != null) {
      setStartRect(rectId);
      const startRectObj = rect.find((rectangle) => rectangle.id === rectId);
      setStartRectColor(rectColor);

      let centerX, centerY;

      if (rectColor === "green") {
        centerX = startRectObj.x + startRectObj.width / 4 + 50;
        centerY = startRectObj.y + startRectObj.height / 2 + 40;
      } else if (rectColor === "red") {
        centerX = startRectObj.x + startRectObj.width / 4 + 30;
        centerY = startRectObj.y + startRectObj.height / 2 + 40;
      } else if (rectColor === "grey") {
        centerX = startRectObj.x + startRectObj.width / 4 + 7;
        centerY = startRectObj.y + startRectObj.height / 2 + 40;
      }

      setStartPoint({ x: centerX, y: centerY });
    }
  };

  const handleMouseMove = (event) => {
    if (startPoint) {
      const stage = event.target.getStage();
      const pointerPosition = stage.getPointerPosition();
      if (pointerPosition) {
        setEndPoint({ x: pointerPosition.x, y: pointerPosition.y });
      }
    }
  };

  const handleMouseMoveUp = (event) => {
    const stage = event.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const { x, y } = pointerPosition;

      for (const rectObj of rect) {
        const { x: rectX, y: rectY, width, height, id } = rectObj;

        if (
          x >= rectX &&
          x <= rectX + width &&
          y >= rectY &&
          y <= rectY + height
        ) {
          const startRectObj = rect.find(
            (rectangle) => rectangle.id === startRect
          );
          const endRectObj = rect.find((rectangle) => rectangle.id === id);
          if (startRectObj && endRectObj) {
            const updatedRect = rect.map((rectangle) => {
              if (rectangle.id === startRectObj.id) {
                if (startRectColor === "red" && startRectObj !== endRectObj) {
                  return {
                    ...rectangle,
                    children: [...rectangle.children, id],
                  };
                } else if (
                  startRectColor === "green" &&
                  startRectObj !== endRectObj
                ) {
                  return {
                    ...rectangle,
                    childrengreen: [...rectangle.childrengreen, id],
                  };
                } else if (
                  startRectColor === "grey" &&
                  startRectObj !== endRectObj
                ) {
                  return {
                    ...rectangle,
                    itselfchildren: [...rectangle.itselfchildren, id],
                  };
                } else if (
                  startRectColor === "grey" &&
                  startRectObj === endRectObj
                ) {
                  return {
                    ...rectangle,

                    itselfchildren: [...rectangle.itselfchildren, id],
                  };
                } else if (
                  startRectColor === "green" &&
                  startRectObj === endRectObj
                ) {
                  return {
                    ...rectangle,
                    childrengreen: [...rectangle.childrengreen, id],
                  };
                } else if (
                  startRectColor === "red" &&
                  startRectObj === endRectObj
                ) {
                  return {
                    ...rectangle,
                    children: [...rectangle.children, id],
                  };
                }
              }
              return rectangle;
            });

            setRect(updatedRect);

            setStartPoint(null);
            setEndPoint(null);
            setStartRect(null);
          }

          return;
        }
      }
      setStartPoint(null);
      setEndPoint(null);
      setStartRect(null);
    }
    setStartPoint(null);
    setEndPoint(null);
  };
  const deleteRectangle = (id: string) => {
    const nextRect = rect.filter((elt) => elt.id !== id);
    const filteredRect = nextRect.map((elt) => {
      return {
        ...elt,
        children: elt.children.filter((childId) => childId !== id),
        childrengreen: elt.childrengreen.filter((childId) => childId !== id),
      };
    });
    setRect(filteredRect);
    console.log(rect);
  };
  const generateRectangle = () => {
    const newRect = {
      id: Rect_id,
      x: (Math.random() * window.innerWidth) / 2 / 2,
      y: (Math.random() * window.innerHeight) / 2 / 2,
      width: 100,
      stepId: "",
      height: 100,
      children: [],
      childrengreen: [],
      itselfchildren: [],
      GreenRectProp: "Green",
      RedRectProp: "Red",
      GreyRectProp: "Grey",
      Attributes: {
        attibute1: "RectAttribute" + rect.length,
        attibute2: "RectAttribute" + rect.length,
      },
      IsBeginStep: false,
      IsDefaultStep: false,
    };

    setRect([...rect, newRect]);
    console.log(rect);
  };
  const handleSave = (
    id: string,
    attribute1: string,
    attribute2: string,
    selectedStep: string
  ) => {
    const updatedRect = rect.map((rectangle) => {
      if (rectangle.id === id) {
        return {
          ...rectangle,
          stepId: selectedStep,
          Attributes: {
            attibute1: attribute1,
            attibute2: attribute2,
          },
        };
      }

      return rectangle;
    });

    setRect(updatedRect);
    setIsPopupOpen(false);
  };

  const renderLine = (elt: any) => {
    return elt.children.map((cht: any) => {
      const obj: any = rect.filter((x: any) => x.id == cht)[0];
      if (obj != null) {
        if (elt.id !== obj.id) {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y + elt.height / 2;
          const endX = obj.x + obj.width / 2;
          const endY = obj.y + obj.height / 2;
          const dx = endX - startX;
          const dy = endY - startY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const unitX = dx / length;
          const unitY = dy / length;
          const startXEdge = startX + unitX * (elt.width / 2);
          const startYEdge = startY + unitY * (elt.height / 2);
          const endXEdge = endX - unitX * (obj.width / 2);
          const endYEdge = endY - unitY * (obj.height / 2) + 22;

          const textX = (startX + endX) / 2;
          const textY = (startY + endY) / 2;

          const distance = Math.sqrt(dx * dx + dy * dy);

          let rotationAngle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (rotationAngle > 90 || rotationAngle < -90) {
            rotationAngle += 180;
          }
          return (
            <>
              <Arrow
                points={[startXEdge, startYEdge - 10, endXEdge, endYEdge - 10]}
                pointerLength={15}
                pointerWidth={15}
                fill="red"
                stroke="red"
                strokeWidth={2}
                dash={[10, 5]}
                onClick={(e) => {
                  {
                    const obj = e.currentTarget.attrs["data-attrib"];
                    const nextShapes = rect.map((shape: any) => {
                      if (shape.id == obj.source.id) {
                        const bb = shape.children.filter(
                          (xx: any) => xx !== obj.target.id
                        );

                        return {
                          ...shape,
                          children: bb,
                        };
                      } else {
                        return shape;
                      }
                    });
                    setRect(nextShapes);
                  }
                }}
                data-attrib={{ source: elt, target: obj }}
              />

              {/* {elt.stepId && obj.stepId ? (
              <Text
                text={`${
                  dx > 0
                    ? elt.stepId + " -> " + obj.stepId
                    : obj.stepId + " <- " + elt.stepId
                }`}
                x={textX}
                y={textY}
                fontSize={Math.min(25, distance / 20)}
                rotation={rotationAngle}
                fill="black"
                offsetX={distance / 5}
              />
            ) : null} */}
            </>
          );
        } else {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y;
          const loopHeight = -12;
          const loopWidth = 30;

          const endX = obj.x - loopWidth + 26;
          const endY = obj.y + obj.height / 2;

          const controlX1 = startX - loopWidth / 2 - 35;
          const controlY1 = startY - loopHeight / 2 - 45;
          const controlX2 = startX - loopWidth / 2 - 80;
          const controlY2 = startY - loopHeight / 2 - 10;

          return (
            <Arrow
              pointerLength={10}
              pointerWidth={10}
              fill="red"
              stroke="red"
              strokeWidth={2}
              tension={0.6}
              dash={[10, 5]}
              points={[
                startX,
                startY,
                controlX1,
                controlY1,
                controlX2,
                controlY2,
                endX,
                endY,
              ]}
              data-attrib={{ source: elt, target: obj }}
              onClick={(e) => {
                const obj = e.currentTarget.attrs["data-attrib"];
                const nextShapes = rect.map((shape: any) => {
                  if (shape.id == obj.source.id) {
                    const bb = shape.itselfchildren.filter(
                      (xx: any) => xx !== obj.target.id
                    );
                    return {
                      ...shape,
                      itselfchildren: bb,
                    };
                  } else {
                    return shape;
                  }
                });
                setRect(nextShapes);
              }}
            />
          );
        }
      }
    });
  };

  const generateGreenLine = (elt: any) => {
    return elt.childrengreen.map((cht: any) => {
      const obj: any = rect.filter((x: any) => x.id == cht)[0];

      if (obj != null) {
        if (elt.id !== obj.id) {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y + elt.height / 2;
          const endX = obj.x + obj.width / 2;
          const endY = obj.y + obj.height / 2;
          const dx = endX - startX;
          const dy = endY - startY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const unitX = dx / length;
          const unitY = dy / length;
          const startXEdge = startX + unitX * (elt.width / 2);
          const startYEdge = startY + unitY * (elt.height / 2) - 25;
          const endXEdge = endX - unitX * (obj.width / 2);
          const endYEdge = endY - unitY * (obj.height / 2);

          let rotationAngle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (rotationAngle > 90 || rotationAngle < -90) {
            rotationAngle += 180;
          }

          return (
            <>
              <Arrow
                points={[startXEdge, startYEdge, endXEdge, endYEdge]}
                pointerLength={10}
                pointerWidth={10}
                fill="green"
                stroke="green"
                strokeWidth={3}
                onClick={(e) => {
                  const obj = e.currentTarget.attrs["data-attrib"];
                  const nextShapes = rect.map((shape: any) => {
                    if (shape.id == obj.source.id) {
                      const bb = shape.childrengreen.filter(
                        (xx: any) => xx !== obj.target.id
                      );
                      return {
                        ...shape,
                        childrengreen: bb,
                      };
                    } else {
                      return shape;
                    }
                  });
                  setRect(nextShapes);
                }}
                data-attrib={{ source: elt, target: obj }}
              />
            </>
          );
        } else {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y;
          const loopHeight = -12;
          const loopWidth = 30;

          const endX = obj.x - loopWidth + 26;
          const endY = obj.y + obj.height / 2;

          const controlX1 = startX - loopWidth / 2 - 35;
          const controlY1 = startY - loopHeight / 2 - 45;
          const controlX2 = startX - loopWidth / 2 - 80;
          const controlY2 = startY - loopHeight / 2 - 10;

          return (
            <Arrow
              pointerLength={10}
              pointerWidth={10}
              fill="green"
              stroke="green"
              strokeWidth={2}
              tension={0.6}
              points={[
                startX,
                startY,
                controlX1,
                controlY1,
                controlX2,
                controlY2,
                endX,
                endY,
              ]}
              data-attrib={{ source: elt, target: obj }}
              onClick={(e) => {
                const obj = e.currentTarget.attrs["data-attrib"];
                const nextShapes = rect.map((shape: any) => {
                  if (shape.id == obj.source.id) {
                    const bb = shape.itselfchildren.filter(
                      (xx: any) => xx !== obj.target.id
                    );
                    return {
                      ...shape,
                      itselfchildren: bb,
                    };
                  } else {
                    return shape;
                  }
                });
                setRect(nextShapes);
              }}
            />
          );
        }
      }
      return null;
    });
  };

  const generatelooptoitself = (elt: any) => {
    return elt.itselfchildren.map((cht: any) => {
      const obj: any = rect.find((x: any) => x.id === cht);
      if (obj != null) {
        if (elt.id !== obj.id) {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y;
          const loopHeight = -12;
          const loopWidth = 30;

          const endX = obj.x - loopWidth + 26;
          const endY = obj.y + obj.height / 2;

          const controlX1 = startX - loopWidth / 2 - 35;
          const controlY1 = startY - loopHeight / 2 - 45;
          const controlX2 = startX - loopWidth / 2 - 80;
          const controlY2 = startY - loopHeight / 2 - 10;

          return (
            <Arrow
              pointerLength={10}
              pointerWidth={10}
              fill="grey"
              stroke="grey"
              strokeWidth={2}
              tension={0.5}
              points={[
                startX,
                startY,
                //controlX1,
                // controlY1,
                // controlX2,
                // controlY2,
                endX,
                endY,
              ]}
              data-attrib={{ source: elt, target: obj }}
              onClick={(e) => {
                const obj = e.currentTarget.attrs["data-attrib"];
                const nextShapes = rect.map((shape: any) => {
                  if (shape.id == obj.source.id) {
                    const bb = shape.itselfchildren.filter(
                      (xx: any) => xx !== obj.target.id
                    );
                    return {
                      ...shape,
                      itselfchildren: bb,
                    };
                  } else {
                    return shape;
                  }
                });
                setRect(nextShapes);
              }}
            />
          );
        } else {
          const startX = elt.x + elt.width / 2;
          const startY = elt.y;
          const loopHeight = -12;
          const loopWidth = 30;

          const endX = obj.x - loopWidth + 26;
          const endY = obj.y + obj.height / 2;

          const controlX1 = startX - loopWidth / 2 - 35;
          const controlY1 = startY - loopHeight / 2 - 45;
          const controlX2 = startX - loopWidth / 2 - 80;
          const controlY2 = startY - loopHeight / 2 - 10;

          return (
            <Arrow
              pointerLength={10}
              pointerWidth={10}
              fill="grey"
              stroke="grey"
              strokeWidth={2}
              tension={0.6}
              points={[
                startX,
                startY,
                controlX1,
                controlY1,
                controlX2,
                controlY2,
                endX,
                endY,
              ]}
              data-attrib={{ source: elt, target: obj }}
              onClick={(e) => {
                const obj = e.currentTarget.attrs["data-attrib"];
                const nextShapes = rect.map((shape: any) => {
                  if (shape.id == obj.source.id) {
                    const bb = shape.itselfchildren.filter(
                      (xx: any) => xx !== obj.target.id
                    );
                    return {
                      ...shape,
                      itselfchildren: bb,
                    };
                  } else {
                    return shape;
                  }
                });
                setRect(nextShapes);
              }}
            />
          );
        }
      }
      return null;
    });
  };

  const handleRectDragEnd = (event, id) => {
    const obj = id;
    const nextShapes = rect.map((shape) => {
      if (shape.id === obj) {
        return {
          ...shape,
          y: event.target.y(),
          x: event.target.x(),
        };
      } else {
        return shape;
      }
    });
    setRect(nextShapes);
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRectDragMove = (event, id) => {
    const obj = id;
    const nextShapes = rect.map((shape) => {
      if (shape.id === obj) {
        return {
          ...shape,

          y: event.target.y() > 0 ? event.target.y() : 0,
          x: event.target.x() > 0 ? event.target.x() : 0,
        };
      } else {
        return shape;
      }
    });
    setRect(nextShapes);
    const shape = event.target;
    const { x, y, width, height } = shape.getClientRect();
    if (x < 0) {
      shape.x(0);
    }
    if (y < 0) {
      shape.y(0);
    }
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

  const renderPanel = () => {
    return (
      <>
        <div style={{ display: "flex" }}>
          &nbsp;
          <MuiModules.UIButton
            style={{ marginBottom: "5px", marginTop: "8px" }}
            variant="contained"
            size="small"
            color="primary"
            onClick={() => generateRectangle()}
          >
            Add
          </MuiModules.UIButton>
          {/* <MuiModules.UIButton onClick={() => deleteRectangle(selectedRectId)}>Delete</MuiModules.UIButton> */}
          &nbsp; &nbsp;
          {/* <button onClick={() => generateRectangle()}>Add New Node</button> */}
          <MuiModules.UIButton
            style={{ marginBottom: "5px", marginTop: "8px" }}
            variant="contained"
            size="small"
            color="primary"
            onClick={downloadRectJson}
          >
            Download
          </MuiModules.UIButton>
          {/* <button onClick={downloadRectJson}>Download WorkFlow </button> */}
          &nbsp; &nbsp;
          <label
            htmlFor="upload-workflow"
            style={{
              marginBottom: "5px",
              marginTop: "8px",

              border: "1px solid #1976d2",
              borderRadius: "4px",
              backgroundColor: "#1976d2",
              color: "white",
              padding: "4px 10px",
            }}
          >
            UPLOAD
          </label>
          &nbsp;
          <input
            style={{ marginBottom: "5px", marginTop: "14px", display: "none" }}
            type="file"
            accept=".json"
            onChange={handleFileInput}
            name="upload-workflow"
            id="upload-workflow"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {selectedFile && (
            <label
              style={{
                marginBottom: "5px",
                marginTop: "8px",
                fontWeight: "500",
              }}
            >
              Selected file: {selectedFile.name}
            </label>
          )}
        </div>

        {/* <label htmlFor="upload-workflow" className="upload-button">Upload Workflow</label>
<input
  type="file"
  accept=".json"
  onChange={handleFileInput}
  name="upload-workflow"
  id="upload-workflow"
  style={{ display: "none" }} // Hides the input field
/> */}
      </>
    );
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

  const renderCanvas = () => {
    return (
      <>
        <div className="stage-container" ref={containerRef}>
          <Stage
            onContextMenu={(e) => {
              e.evt.preventDefault();
            }}
            //   width={window.innerWidth}
            //   height={window.innerHeight}
            width={stageWidth}
            height={stageHeight}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseMoveUp}
            // style={{
            //   backgroundColor: "#e1e1e1",
            //   border: "1px solid",
            // }}
          >
            <Layer ref={myref} style={{ backgroundColor: "#e1e1e1" }}>
              {rect.length > 0 &&
                rect.map((elt: any) => {
                  return (
                    <Group key={elt.id}>
                      {generatelooptoitself(elt)}
                      {generateGreenLine(elt)}
                      {renderLine(elt)}
                      {elt.IsBeginStep ? (
                        <Rect
                          tooltip
                          data-ext={elt}
                          x={elt.x}
                          y={elt.y}
                          width={elt.width}
                          height={elt.height}
                          onClick={(e) => {
                            setSelectedRectangle(elt);
                            setIsPopupOpen(true);
                          }}
                          fill={`lightblue`}
                          drawBorder={true}
                          stroke={"black"}
                          isdraggable={true}
                          strokeWidth={1}
                          cornerRadius={0}
                          onDragMove={(event) =>
                            handleRectDragMove(event, elt.id)
                          }
                          onDragStart={() => {}}
                          onDragEnd={(event) =>
                            handleRectDragEnd(event, elt.id)
                          }
                          draggable={true}
                        />
                      ) : (
                        <Rect
                          tooltip
                          data-ext={elt}
                          x={elt.x}
                          y={elt.y}
                          width={elt.width}
                          height={elt.height}
                          onClick={(e) => {
                            setSelectedRectangle(elt);
                            setIsPopupOpen(true);
                          }}
                          fill={`beige`}
                          drawBorder={true}
                          stroke={"black"}
                          isdraggable={true}
                          strokeWidth={1}
                          cornerRadius={25}
                          onDragMove={(event) =>
                            handleRectDragMove(event, elt.id)
                          }
                          onDragStart={() => {}}
                          onDragEnd={(event) =>
                            handleRectDragEnd(event, elt.id)
                          }
                          draggable={true}
                        />
                      )}

                      <Text
                        text={elt.stepId}
                        x={elt.x + 15}
                        y={elt.y + 40}
                        fontSize={12}
                      />
                      {elt.GreenRectProp === "Green" && (
                        <Rect
                          x={elt.x + 68}
                          y={elt.y + elt.height - 29}
                          cornerRadius={5}
                          width={25}
                          height={25}
                          fill="green"
                          onMouseDown={(event) =>
                            handleRectMouseDown(event, elt.id, "green")
                          }
                        />
                      )}
                      {elt.RedRectProp === "Red" && (
                        <Rect
                          x={elt.x + 40}
                          y={elt.y + elt.height - 28}
                          width={25}
                          height={25}
                          cornerRadius={5}
                          fill="red"
                          onMouseDown={(event) =>
                            handleRectMouseDown(event, elt.id, "red")
                          }
                        />
                      )}
                      {elt.GreyRectProp === "Grey" && (
                        <Rect
                          x={elt.x + 13}
                          y={elt.y + elt.height - 28}
                          width={25}
                          height={25}
                          cornerRadius={5}
                          fill="grey"
                          onMouseDown={(event) =>
                            handleRectMouseDown(event, elt.id, "grey")
                          }
                        />
                      )}
                    </Group>
                  );
                })}

              {startPoint && endPoint && (
                <Arrow
                  points={[startPoint.x, startPoint.y, endPoint.x, endPoint.y]}
                  pointerLength={15}
                  pointerWidth={15}
                  fill={startRectColor || "red"}
                  stroke={startRectColor || "red"}
                  strokeWidth={3}
                  dash={startRectColor === "red" ? [10, 5] : [0]}
                />
              )}
              <Transformer ref={transref} />
            </Layer>
          </Stage>
        </div>
        <Popup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          rectangle={selectedRectangle}
          onSave={handleSave}
          rect={rect}
          setRect={setRect}
        />
      </>
    );
  };

  return (
    <>
      {renderPanel()}
      {renderCanvas()}
    </>
  );
};

export default AppWorkflow;
