import React, { useEffect, useState } from "react";
import MuiModules from "../../../../MUI-Module/MuiImports";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import { ErrorHandling1 } from "../../../TransactionScreens/ErrorHandling/ErrorHandling";

const CommonLastInfo = (props) => {
  const { LastModifiedUser, LastModifiedDateTime } = props;
  const convertDateTime = (dateStr) => {
    const formattedDate = moment(dateStr).format("DD/MM/YYYY hh:mm A");
    return formattedDate;
  };

  return (
    <div>
      <Accordion style={{ marginTop: "30px" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          style={{ fontWeight: "normal" }}
        >
          Last Change Information
        </AccordionSummary>
        <AccordionDetails
          style={{ position: "relative", top: "-18px", height: "100px" }}
        >
          <MuiModules.UIGrid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 2, sm: 2, md: 1 }}
            mt={2}
            mb={2}
          >
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>User</label>
              <MuiModules.UITextField
                name="User"
                id="User"
                disabled
                value={LastModifiedUser}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
            <MuiModules.UIGrid
              item
              xs={12}
              sm={12}
              md={4}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <label style={{ fontSize: "14px" }}>Last Change Date</label>
              <MuiModules.UITextField
                name="LastChangeDate"
                id="LastChangeDate"
                disabled
                value={convertDateTime(LastModifiedDateTime)}
                autoComplete="off"
              />
            </MuiModules.UIGrid>
          </MuiModules.UIGrid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CommonLastInfo;
