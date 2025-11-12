import React, { useState } from 'react'

const MatrixStore = () => {
  const [Matrixtems, setMatrixtems] = useState([
    {
      text: "Employee Training Management",
      path: "employeetrainingmanagement",
      permission: "EmployeeTrainingDetail",
    },
    {
      text: "Activate Maintenance Requirement",
      path: "MaintenanceMatrix",
      permission: "MaintenanceMatrix",
    },
    { text: "Maintenance Management", path: "MaintenanceManagement", permission: "MaintenanceManagement" },
 
    
]);

return Matrixtems;
};

export default MatrixStore
