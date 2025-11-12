import React, { useContext, useEffect, useState } from "react";
import "./popup1.css"; // Import CSS file for styling
import { getProcessflowsteplist } from "./StepsApi";
import MuiModules from "../MUI-Module/MuiImports";
import { ThemeContext } from "../ContextMain";
import { display } from "@mui/system";

interface loadprocesssteps {
  ProcessflowStepId: number;

  ProcessflowStepName: string;
}

const Popup = ({ isOpen, onClose, rectangle, onSave, rect, setRect }) => {
  const { backgroundtheme } = useContext(ThemeContext);
  if (!isOpen || !rectangle) return null;

  const height1 = "400";

  const [loadprocessflowStepdata, setloadprocessflowStepdata] = useState<
    loadprocesssteps[]
  >([]);

  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setselectedStep] = useState("");
  const [attribute1, setAttribute1] = useState(rectangle.Attributes.attibute1);
  const [attribute2, setAttribute2] = useState(rectangle.Attributes.attibute2);

  useEffect(() => {
    fetchProcessflowStep();
  }, []);
  const deleteRectangle = () => {
    const id = rectangle.id;
    onClose();
    const nextRect = rect.filter((elt) => elt.id !== id);
    const filteredRect = nextRect.map((elt) => {
      return {
        ...elt,
        children: elt.children.filter((childId) => childId !== id),
        childrengreen: elt.childrengreen.filter((childId) => childId !== id),
      };
    });
    setRect(filteredRect);
  };
  const fetchProcessflowStep = async () => {
    setselectedStep(rectangle.stepId);
    try {
      const response = await getProcessflowsteplist();
      setloadprocessflowStepdata(response.data.value);
      setError("");
    } catch (error) {
      console.error("Error fetching data:", error);
      //setloadholdreason(error);
      //setError("Error fetching data. Please check console for details.");
    }
  };

  const handleAttribute1Change = (e) => {
    setAttribute1(e.target.value);
  };

  const handleAttribute2Change = (e) => {
    setAttribute2(e.target.value);
  };
  const handleSave = () => {
    onSave(rectangle.id, attribute1, attribute2, selectedStep);
  };
  return (
    // <div className="popup-container">
    //   <div className="popup-content">
    //     <div className="popup-inner">
    //       <h2>Step Details</h2>
    <MuiModules.UIDialog
      open={isOpen}
      maxWidth="sm"
      fullWidth
      className={`popup ${
        backgroundtheme === "black" ? "popup_Dark" : "popup"
      }`}
    >
      <MuiModules.UIDialogTitle>Step Details</MuiModules.UIDialogTitle>

      <MuiModules.UIDialogContent>
        {/* <p>ID: {rectangle.id}</p>
          <p>X: {rectangle.x}</p>
          <p>Y: {rectangle.y}</p>
          <p>Width: {rectangle.width}</p>
          <p>Height: {rectangle.height}</p>
          <p>Step Name: {rectangle.stepId}</p>
          <p>Children: {rectangle.itselfchildren.join(', ')}</p>
          <p>Children: {rectangle.childrengreen.join(', ')}</p> 
          <p>Children: {rectangle.children.join(', ')}</p> */}
        {/* <p>Step Name: {rectangle.stepId}</p>

        <p>
          <label>Attribute 1: </label>
          <input
            style={{ backgroundColor: "white", color: "black" }}
            type="text"
            value={attribute1}
            placeholder="User Input"
            onChange={handleAttribute1Change}
          />
        </p>
        <p>
          <label>Attribute 2: </label>
          <input
            style={{ backgroundColor: "white", color: "black" }}
            type="text"
            value={attribute2}
            placeholder="User Input"
            onChange={handleAttribute2Change}
          />
        </p> */}

        {/* <p><label>Attribute 1: </label><input style={{ backgroundColor: 'white', color: 'black' }} type="text" name="attribute1" value={attributes.attribute1} placeholder="User Input" onChange={handleAttributeChange} /></p>
          <p><label>Attribute 2: </label><input style={{ backgroundColor: 'white', color: 'black' }} type="text" name="attribute2" value={attributes.attribute2} placeholder="User Input" onChange={handleAttributeChange} /></p> */}
        {/* //<p><label>Attribute 1: </label><input style={{ backgroundColor: 'white', color: 'black' }} type="text"  value={rectangle.Attributes.attibute1} placeholder="User Input"/></p>
          //<p><label>Attribute 2: </label><input style={{ backgroundColor: 'white', color: 'black' }} type="text"  value={rectangle.Attributes.attibute2} placeholder="User Input" /></p> */}
        <p style={{ display: "flex", padding: "10px" }}>
          <label>
            <h3>Steps: </h3>
          </label>
          <select
            style={{ backgroundColor: "white", color: "black", width: "50%" }}
            value={selectedStep}
            onChange={(e) => setselectedStep(e.target.value)}
          >
            <option value="" disabled hidden>
              {selectedStep === "" ? "Select" : ""}
            </option>{" "}
            {/* Placeholder option */}
            {loadprocessflowStepdata.map((option, index) => (
              <option key={index} value={option.ProcessflowStepName}>
                {option.ProcessflowStepName}
              </option>
            ))}
          </select>
        </p>

        {/* <button className="close-button" onClick={onClose}>
          Close
        </button>
        <button className="close-button" onClick={handleSave}>
          Save
        </button> */}
      </MuiModules.UIDialogContent>
      <MuiModules.UIDialogActions>
        <MuiModules.UIButton
          color="primary"
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </MuiModules.UIButton>
        <MuiModules.UIButton
          color="error"
          variant="contained"
          onClick={deleteRectangle}
        >
          Delete
        </MuiModules.UIButton>
        <MuiModules.UIButton
          color="primary"
          variant="contained"
          onClick={handleSave}
        >
          Save
        </MuiModules.UIButton>
      </MuiModules.UIDialogActions>
    </MuiModules.UIDialog>
  );
};

export default Popup;
