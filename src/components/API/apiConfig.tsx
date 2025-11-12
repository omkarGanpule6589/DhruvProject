import axios from "axios";
import apiendpoint from "./apiendpont.json";

const APIConfig = {

  //apiUrl: "http://localhost:5154",
   apiUrl: "http://192.168.1.101:8068", //UAT-CTravleer,


  //apiUrl: "http://10.208.185.23:8068", //GKBUAT,
 //apiUrl: "http://192.168.148.3:8068", 

  
};

const APIConfig1 = {
  //apiUrl: "http://localhost:5174",
 apiUrl: "http://192.168.1.101:8053", //UAT-GKB,

  
  //apiUrl: "http://10.208.185.23:8053", //GKBUAT,

  //apiUrl: "http://192.168.148.3:8053", 
};
const APIConfig2 = {
  apiUrl: "http://192.168.1.101:5005", //UAT-GKB,
};

export const api = axios.create({
  baseURL: APIConfig.apiUrl,
});
export const GKBapi = axios.create({
  baseURL: APIConfig1.apiUrl,
});

export const FocoVisionnapi = axios.create({
  baseURL: APIConfig2.apiUrl,
});
export default apiendpoint;

export const apiUrl = APIConfig.apiUrl;
