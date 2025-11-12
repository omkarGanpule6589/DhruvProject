import { useEffect, useState, useRef, useContext } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Arrow,
  Group,
  Transformer,
  Label,
  Tag,
} from "react-konva";

import { v4 as uuid } from "uuid";
import MuiModules from "../MUI-Module/MuiImports";
import { ErrorHandlingmodelling1st } from "../pages/TransactionScreens/ErrorHandling/ErrorHandling";
import { steps } from "../workflow/StepsApi";
import Popup from "../workflow/Popup";
import { ThemeContext } from "../ContextMain";
import "./Workflow.css";

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
  IsEndStep: Boolean;
  Sequence: any;
  OperationDetail: any;
}
const PopAppWorkflow = (props) => {
  const { processflowId, open, Onclose } = props;
  const { backgroundtheme } = useContext(ThemeContext);
  const initialContainerWidth = window.innerWidth;
  const initialContainerHeight = window.innerHeight;

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await steps(processflowId);
      if (response.data) {
        const res = response.data.value[0]?.ProcessflowSteps;
       //
       //  console.log("JSON",JSON.stringify(res))
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
            IsEndStep: rect.IsEndStep,
            Sequence: rect.Sequence,
            OperationDetail: rect?.OperationDetail?.OperationDetailName,
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

        templist.map((item) => {
          if (item.IsDefaultStep) {
            if (item.childrengreen.length == 0) {
              const find = templist.find(
                (item1) => item1.Sequence == item.Sequence + 1
              );
              if (find) {
                item.childrengreen = [`${find.id}`];
              }
            }
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
                points={[endXEdge - 10, endYEdge - 10, startXEdge, startYEdge]}
                pointerLength={15}
                pointerWidth={15}
                fill="red"
                stroke="red"
                strokeWidth={2}
                dash={[10, 5]}
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
            />
          );
        }
      }
    });
  };

  const generateGreenLine = (elt: any) => {
    return elt.childrengreen.map((cht: any) => {
      const obj: any = rect.filter((x: any) => x.id == cht)[0];
      if (elt.IsEndStep) return null;
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
                points={[startX, startY, endXEdge, endYEdge]}
                pointerLength={10}
                pointerWidth={10}
                fill="green"
                stroke="green"
                strokeWidth={3}
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
          const startX = elt.x + elt.width / 1;
          const startY = elt.y + elt.height / 4;

          const loopHeight = -12;
          const loopWidth = 30;

          const endX = obj.x - loopWidth + 45;
          const endY = obj.y + obj.height / 4;

          return (
            <Arrow
              pointerLength={10}
              pointerWidth={10}
              fill="grey"
              stroke="grey"
              strokeWidth={2}
              tension={0.5}
              points={[
                //controlX1,
                // controlY1,
                // controlX2,
                // controlY2,
                endX,
                endY,
                startX,
                startY,
              ]}
              data-attrib={{ source: elt, target: obj }}
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

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      setStageWidth(newWidth);
      setStageHeight(newHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    const lastRect = rect[rect.length - 1];
    if (lastRect) {
      const newHeight = lastRect.y + lastRect.height + 50;
      setStageHeight(newHeight);
    }
  }, [rect]);
  const [hoveredRect, setHoveredRect] = useState(null);
  const renderCanvas = () => {
    return (
      <>
        <div
          className="stage-container"
          ref={containerRef}
          style={{ marginLeft: "25px", height: "200%" }}
        >
          <Stage
            onContextMenu={(e) => {
              e.evt.preventDefault();
            }}
            width={stageWidth}
            height={stageHeight}
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
                          fill={`lightblue`}
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
                          onMouseEnter={() => setHoveredRect(elt.id)}
                          onMouseLeave={() => setHoveredRect(null)}
                        />
                      ) : (
                        <Rect
                          tooltip
                          data-ext={elt}
                          x={elt.x}
                          y={elt.y}
                          width={elt.width}
                          height={elt.height}
                          fill={elt.IsEndStep ? "lightcoral" : `beige`}
                          className="yt"
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
                          onMouseEnter={() => setHoveredRect(elt.id)}
                          onMouseLeave={() => setHoveredRect(null)}
                        />
                      )}

                      {rect.map(
                        (elt) =>
                          hoveredRect === elt.id && (
                            <Label
                              key={`label-${elt.id}`}
                              x={elt.x + 30}
                              y={elt.y + 10} // Adjust to position above the rectangle
                              opacity={0.9} // Slightly increase opacity
                            >
                              <Tag
                                fill="black"
                                pointerDirection="down"
                                pointerWidth={10}
                                pointerHeight={10}
                                lineJoin="round"
                                shadowColor="black"
                                shadowBlur={10}
                                shadowOffset={{ x: 5, y: 5 }}
                                shadowOpacity={0.5}
                                cornerRadius={5}
                              />
                              <Text
                                text={`Sequence: ${elt.Sequence}\nOperation Detail: ${elt.OperationDetail}`}
                                fontSize={16}
                                fontFamily="Calibri"
                                fill="white"
                                padding={10}
                                align="left"
                              />
                            </Label>
                          )
                      )}
                      {/* <Text
                        text={
                          elt.stepId.length > 10
                            ? `${elt.stepId.slice(0, 10)}\n${elt.stepId.slice(
                                10
                              )}`
                            : elt.stepId
                        }
                        x={elt.x + 15}
                        y={elt.y + 40}
                        fontSize={10}
                      /> */}
                      <Text
                        text={elt.stepId}
                        x={elt.x + 15}
                        y={elt.y + 30}
                        fontSize={10}
                        width={elt.width - 30}
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
      <MuiModules.UIDialog
        open={open}
        maxWidth="lg"
        fullWidth
        //sx={dialogStyle}
        className={`popup ${
          backgroundtheme === "black" ? "popup_Dark" : "popup"
        }`}
      >
        <MuiModules.UIDialogTitle
          className={`popuphead ${
            backgroundtheme === "black" ? "popuphead_Dark" : "popuphead"
          }`}
        >
          Process Flow
        </MuiModules.UIDialogTitle>
        <div style={{ margin: "10px" }}></div>
        {/* {renderPanel()} */}
        {renderCanvas()}
        <MuiModules.UIDialogActions>
          <MuiModules.UIButton
            variant="contained"
            size="small"
            color="primary"
            type="reset"
            //type="submit"
            onClick={Onclose}
          >
            Cancel
          </MuiModules.UIButton>
        </MuiModules.UIDialogActions>
      </MuiModules.UIDialog>
    </>
  );
};

export default PopAppWorkflow;
