//Local
export default {
  apiHost: process.env.REACT_APP_API_HOST || 'http://localhost:5000',
  AWS: {
   SiteAssets: "https://s3.amazonaws.com/socialtostream-development",
   S3bucket: "https://s3.amazonaws.com/socialtostream-development",
   GateWayURL : "https://s1uf42f356.execute-api.us-east-1.amazonaws.com/stage/processMedia"
  }
};

//Staging
// export default {
//   apiHost: process.env.REACT_APP_API_HOST || 'http://localhost:5000',
//   AWS: {
//    SiteAssets: "https://s3.amazonaws.com/socialtostream-development",
//    S3bucket: "https://s3.amazonaws.com/socialtostream-development",
//    GateWayURL : "https://s1uf42f356.execute-api.us-east-1.amazonaws.com/stage/processMedia"
//   }
// };

// Production
// export default {
//   apiHost: process.env.REACT_APP_API_HOST || 'http://localhost:5000',
//   AWS: {
//    SiteAssets: "https://s3.amazonaws.com/socialtostream-development",
//    S3bucket: "https://s3.amazonaws.com/socialtostream-development",
//    GateWayURL : "https://s1uf42f356.execute-api.us-east-1.amazonaws.com/stage/processMedia"
//   }
// };