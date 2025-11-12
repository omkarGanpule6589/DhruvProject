// const NotFoundPage = () => {

//   return (
//    <div>
//     <span>Sorry the Page you requested does not exist</span>
//    </div>
//   );
// };

// export default NotFoundPage;
import React from "react";
import { Box, Typography, Button } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box className="rootnotfound">
      <Typography className="messagenotfound">
        Sorry, the page you requested does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className="buttonnotfound"
        href="/dashboard"
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFoundPage;
