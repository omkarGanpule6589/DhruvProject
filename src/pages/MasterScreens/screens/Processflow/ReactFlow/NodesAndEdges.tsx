import { MarkerType } from "@xyflow/react";
const position = { x: 0, y: 0 };
const edgeType = "step";

const exportNode = [];

const findNextParentFlowId = (processFlowId: number) => {
  if (!exportNode || exportNode.length === 0) {
    return null;
  }

  const currentIndex = exportNode?.findIndex(
    (item: any) => item.ProcessflowStepId === processFlowId
  );

  if (currentIndex !== -1 && currentIndex < exportNode.length - 1) {
    let nextProcessFlowId = exportNode[currentIndex + 1];
    return nextProcessFlowId.ProcessflowStepId;
  }
  return null;
};
let count = 0;
const findMatchAllId = (targetId: any) => {
  const matches: any[] = [];
  for (const step of exportNode) {
    if (step.ReworkStepDetailReworkSteps.length > 0) {
      step.ReworkStepDetailReworkSteps.map((item: any) => {
        count = count + 1;
        if (item.ProcessflowStepId === targetId) {
          const parentId = step.ProcessflowStepId;
          if (targetId === parentId) {
            matches.push({
              id: String(`rework${parentId}-${count}`),
              source: String(targetId),
              target: String(`${parentId}`),
              data: { label: String(item.ProcessflowStep.ProcessflowStepName) },
              // type: edgeType,
              type: "selfconnecting",
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: { stroke: "gray", strokeWidth: 4 },
            });
          } else {
            matches.push({
              id: String(`rework${parentId}-${count}`),
              source: String(targetId),
              target: String(`${parentId}`),
              data: { label: String(item.ProcessflowStep.ProcessflowStepName) },
              type: edgeType,
              animated: true,
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "green",
              },
              style: { stroke: "gray", strokeWidth: 4 },
            });
          }
        }
      });
    }
    if (step.AlternateStepDetailAlternateSteps.length > 0) {
      step.AlternateStepDetailAlternateSteps.map((item: any) => {
        count = count + 1;
        if (item.ProcessflowStepId === targetId) {
          const parentId = step.ProcessflowStepId;
          matches.push({
            id: String(`alternate${parentId}-${count}`),
            source: String(targetId),
            target: String(`${parentId}`),
            data: { label: String(item.ProcessflowStep.ProcessflowStepName) },
            type: edgeType,
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "green",
            },
            style: { stroke: "red", strokeWidth: 4 },
          });
        }
      });
    }
  }

  return matches;
};

const result: any[] = exportNode?.map((item: any) =>
  findMatchAllId(item.ProcessflowStepId)
);
const initialEdgesDummy: any[] =
  !exportNode || exportNode.length === 0
    ? []
    : exportNode.map((item: any) => {
        const targetID = findNextParentFlowId(item.ProcessflowStepId);
        return {
          id: String(`E${item.ProcessflowStepId}`),
          source: String(item.ProcessflowStepId),
          target: String(targetID === null ? item.ProcessflowStepId : targetID),
          data: { label: String(item.ProcessflowStepName) },
          type: edgeType,
          animated: false,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "green",
          },
          style: { stroke: "green", strokeWidth: 4 },
        };
      });
export const initialNodes: any[] = initialEdgesDummy.concat(result.flat());

const initialNodesDummy =
  !exportNode || exportNode.length === 0
    ? []
    : exportNode?.map((item: any, index: number) => {
        return {
          id: String(item.ProcessflowStepId),
          type:
            index === 0
              ? "input"
              : index === exportNode.length - 1
              ? "output"
              : item.IsEndStep === true
              ? "output"
              : "default",
          data: { label: String(item.ProcessflowStepName) },
          position,
          style:
            item.IsBeginStep === true
              ? {
                  backgroundColor: "#0066ff",
                  color: "#FFF",
                  fontSize: 16,
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }
              : item.IsEndStep === true
              ? {
                  backgroundColor: "#ff3300",
                  color: "#FFF",
                  fontSize: 12,
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                }
              : {
                  backgroundColor: "#3d3d29",
                  color: "#FFF",
                  fontSize: 12,
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                },
        };
      });

const updateNodeType = () => {
  const updatedNodes = initialNodesDummy.map((node: any) => {
    const relavantEdges = initialNodes.filter(
      (edge: any) => edge.source === edge.target && edge.source === node.id
    );
    if (relavantEdges.length > 0) {
      const updateNode = {
        ...node,
        sourcePosition: relavantEdges.some(
          (edge: any) => edge.source === node.id
        )
          ? "right"
          : undefined,
        targetPosition: relavantEdges.some(
          (edge: any) => edge.target === node.id
        )
          ? "left"
          : undefined,
        position,
      };
      return updateNode;
    }
    return node;
  });
  return updatedNodes;
};

export const updateNodeTypes = updateNodeType();
