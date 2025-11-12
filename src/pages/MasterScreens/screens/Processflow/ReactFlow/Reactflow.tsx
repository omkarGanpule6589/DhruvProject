import { Box } from "@mui/material";
import {
  Background,
  Controls,
  ReactFlow,
  addEdge,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ConnectionLineType,
  type OnConnect,
  type Node,
  applyEdgeChanges,
} from "@xyflow/react";
import { useCallback, useContext, useEffect, useState } from "react";
import "@xyflow/react/dist/style.css";
import dagre from "@dagrejs/dagre";
//import { updateNodeTypes, initialNodes } from "./NodesAndEdges";

import SelfContaining from "./SelfContaining";
import MuiModules from "../../../../../MUI-Module/MuiImports";
import { ThemeContext } from "../../../../../ContextMain";
import { MarkerType } from "@xyflow/react";
import MUIDialog from "./Popup/ReactFlowPopup";
import CustomNodeHandle from "./CustomNodeHandle";
const position = { x: 0, y: 0 };
const edgeType = "step";

const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const nodeWidth = 172;
const nodeHeight = 36;
const getLayoutedElements = (nodes: any, edges: any, direction = "TB") => {
  const isHorizontal = direction === "LR";

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};
const Reactflow1 = (props) => {
  const { processflowId, open, Onclose, exportNode1 } = props;
  // const exportNode = exportNode1.filter((item) => !item.IsDeleted);
  const exportNode = exportNode1
    .filter((item) => !item.IsDeleted) // Filter out deleted items
    .sort((a, b) => a.Sequence - b.Sequence); // Sort by sequence in increasing order
  useEffect(() => {
    exportNode;
  }, [exportNode]);
  const nodeTypes = {
    customNode: CustomNodeHandle,
  };

  // Initial Node Json Data Format Creation
  const initialNodeTypes =
    !exportNode || exportNode.length === 0
      ? []
      : exportNode.map((node: any, index: number) => {
          return {
            ...node,
            id: String(node.ProcessflowStepId),
            // type:
            //   index === 0
            //     ? "input"
            //     : index === exportNode.length - 1
            //     ? "output"
            //     : node.IsEndStep === true
            //     ? "output"
            //     : "default",
            // type: node.IsEndStep === true ? "customNode" : "customNode",
            type: "customNode",
            data: {
              label: String(node.ProcessflowStepName),
              reworkAltFlag: false,
            },
            position,
            indexKey: index,
            style:
              node.IsBeginStep === true
                ? {
                    backgroundColor: "#0066ff",
                    color: "#FFF",
                    fontSize: 16,
                    borderRadius: 5,
                    // border: "none",
                    border: "1px solid #0066ff",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }
                : node.IsEndStep === true
                ? {
                    backgroundColor: "#ff3300",
                    color: "#FFF",
                    fontSize: 12,
                    borderRadius: 5,
                    border: "1px solid #ff3300",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  }
                : {
                    backgroundColor: "#3d3d29",
                    color: "#FFF",
                    fontSize: 12,
                    borderRadius: 5,
                    // border: "none",
                    border: "1px solid #3d3d29",
                    boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                  },
          };
        });
  const findNextTargetID = (params) => {
    if (!exportNode || exportNode.length === 0) {
      return null;
    }

    // const currentIndex = exportNode?.findIndex(
    //   (item: any) => item.ProcessflowStepId === params.ProcessflowStepId
    // );
    const find = exportNode.find(
      (item1) => item1.Sequence == params.Sequence + 1
    );
    if (find) {
      debugger;
      if (params.IsDefaultStep == true) {
        return find.ProcessflowStepId;
      } else {
        return null;
      }
    } else {
      return null;
    }

    // if (currentIndex !== -1 && currentIndex < exportNode.length - 1) {
    //   let nextProcessFlowId = exportNode[currentIndex + 1];
    //   return nextProcessFlowId.ProcessflowStepId;
    // }
    // return null;
    //   return "";
  };
  let rework: Element | any[] = [];
  let count: number = 0;
  const findReworkId = (params: any) => {
    !exportNode || exportNode.length === 0
      ? []
      : exportNode.map((node: any) => {
          if (node.ReworkStepDetailReworkSteps.length > 0) {
            node.ReworkStepDetailReworkSteps.filter(
              (item) => !item.IsDeleted
            ).filter((item: any) => {
              count = count + 1;
              if (item.ProcessflowStepId === params.ProcessflowStepId) {
                const parentId = node.ProcessflowStepId;
                if (parentId === params.ProcessflowStepId) {
                  rework.push({
                    // ...params,
                    id: String(`RWK${parentId}-${count}`),
                    source: String(params.ProcessflowStepId),
                    target: String(`${parentId}`),
                    data: {
                      label: String(item.ProcessflowStep.ProcessflowStepName),
                    },
                    type: "selfconnecting",
                    sourceHandle: "c",
                    targetHandle: "d",
                    animated: true,
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: "gray",
                    },
                    style: { stroke: "gray", strokeWidth: 4 },
                  });
                } else {
                  rework.push({
                    // ...params,
                    id: String(`RWK${parentId}-${count}`),
                    source: String(params.ProcessflowStepId),
                    target: String(`${parentId}`),
                    data: {
                      label: String(item.ProcessflowStep.ProcessflowStepName),
                    },
                    type: edgeType,
                    sourceHandle: "c",
                    targetHandle: "d",
                    animated: true,
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: "gray",
                    },
                    style: { stroke: "gray", strokeWidth: 4 },
                  });
                }
              }
            });
          }

          if (node.AlternateStepDetailAlternateSteps.length > 0) {
            node.AlternateStepDetailAlternateSteps.filter(
              (item) => !item.IsDeleted
            ).filter((item: any) => {
              count = count + 1;
              if (item.ProcessflowStepId === params.ProcessflowStepId) {
                const parentId = node.ProcessflowStepId;
                if (parentId === params.ProcessflowStepId) {
                  rework.push({
                    // ...params,
                    id: String(`ALT${parentId}-${count}`),
                    source: String(params.ProcessflowStepId),
                    target: String(`${parentId}`),
                    data: {
                      label: String(item.ProcessflowStep.ProcessflowStepName),
                    },
                    type: "selfconnecting",
                    sourceHandle: "e",
                    targetHandle: "f",
                    animated: true,
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: "red",
                    },
                    style: { stroke: "red", strokeWidth: 4 },
                  });
                } else {
                  rework.push({
                    // ...params,
                    id: String(`ALT${parentId}-${count}`),
                    source: String(params.ProcessflowStepId),
                    target: String(`${parentId}`),
                    data: {
                      label: String(item.ProcessflowStep.ProcessflowStepName),
                    },
                    type: edgeType,
                    sourceHandle: "e",
                    targetHandle: "f",
                    animated: true,
                    markerEnd: {
                      type: MarkerType.ArrowClosed,
                      color: "red",
                    },
                    style: { stroke: "red", strokeWidth: 4 },
                  });
                }
              }
            });
          }
        });
  };

  // Initial Edges Json Creation
  let initialEdges =
    !exportNode || exportNode.length === 0
      ? []
      : exportNode.map((edge: any) => {
          const nextTargetID = findNextTargetID(edge);
          findReworkId(edge);
          return {
            // ...edge,
            id: String(`E${edge.ProcessflowStepId}`),
            source: String(edge.ProcessflowStepId),
            target:
              edge.IsEndStep === true
                ? undefined
                : String(nextTargetID === null ? undefined : nextTargetID),
            data: { label: String(edge.ProcessflowStepName) },
            type: edgeType,
            animated: false,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "green",
            },
            style: { stroke: "green", strokeWidth: 4 },
          };
        });

  const initialEdgesTypes = initialEdges.concat(rework);
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodeTypes,
    initialEdgesTypes
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const { backgroundtheme } = useContext(ThemeContext);

  const edgeTypes = {
    selfconnecting: SelfContaining,
  };

  const onConnect: OnConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            tyope: ConnectionLineType.SmoothStep,
            animated: true,
          },
          eds
        )
      ),
    []
  );
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const propsOptions = { hideAttribution: true };

  const onEdgesChangeClick = useCallback(
    (changes: any) => {
      setEdges((oldEdges) => applyEdgeChanges(changes, oldEdges));
    },
    [setEdges]
  );
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const onNodeClickHandler = (evt: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  };
  const dialogBoxClose = () => {
    setSelectedNode(null);
  };

  return (
    <MuiModules.UIDialog
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen
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
      <Box component="div" sx={{ height: "100vh", width: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          proOptions={propsOptions}
          onNodeClick={onNodeClickHandler}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChangeClick}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#A9A9A9",
          }}
          // onViewportChange={handleViewPort}
          fitView
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          //colorMode="dark"
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
          <MiniMap style={{ backgroundColor: "#808080" }} />
          <Controls orientation="vertical" />
        </ReactFlow>
        <MUIDialog
          open={!!selectedNode}
          children={selectedNode?.data.label}
          onClose={dialogBoxClose}
          data={selectedNode}
        />
      </Box>
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
  );
};

export default Reactflow1;
