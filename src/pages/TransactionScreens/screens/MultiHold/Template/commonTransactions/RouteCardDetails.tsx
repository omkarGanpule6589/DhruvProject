import { Grid, TextField } from "@mui/material";
import './RouteCardDetails.css'

const RouteCardDetails = (props) => {
    return (
        <div  >
            <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 2, sm: 2, md: 3 }}
                className="headerTransaction"
            >
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={8}
                    style={{ display: "flex", alignItems: "center", gap: '4px'}}
                >
                    <label htmlFor="Routecard">Routecard</label>
                    <TextField
                        name="Routecard"
                        id="Routecard"
                        placeholder="Routecard"
                        // value={values.Routecard}
                        // onChange={handleChange}
                         className='routeCardField'
                    />
                     <label htmlFor="Status" style={{marginLeft: '1.5rem', marginRight: "5px" }}>
                        Status
                    </label>
                    <div className='statusbox'></div><span style={{ color: "green" }}>/Active</span>
                </Grid>               
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    style={{                        
                        paddingRight: "2rem",
                     }}
                >
                    <h2 style={{float: "right",}}>{props.transactionName}</h2>
                </Grid>
            </Grid>

            <div className='routeCardFeatures'>
             <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 2, sm: 2, md: 3 }}                
            >
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
                 >
                    <h4>Operation Detail :</h4>
                    <p> Test Spec</p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
                 >
                    <h4>Qty :</h4>
                    <p>20</p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
                    
                >
                    <h4>Product :</h4>
                    <p>Test Product</p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
                 >
                    <h4>Operation :</h4>
                    <p> Move In</p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
 
                >
                    <h4>Process Flow :</h4>
                    <p> Test</p>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={4}
                    className='features'
                    
                >
                    <h4>Test :</h4>
                    <p>Active</p>
                </Grid>
            </Grid>
            </div>
         </div>
    
    )
}

export default RouteCardDetails