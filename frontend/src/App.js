import React, {useEffect, useState} from "react";
import { UidContext } from "./components/appContext";
import AppRoutes from './components/Routes'
import axios from 'axios';

function App() {
  const [uid, setUid] = useState(null)

  useEffect(() => {
    (async function fetcToken() {
      await axios({
        method : "get",
        url : `${process.env.REACT_APP_API_URL}api/users/`,
        withCredentials : true
      })
      .then((res) => setUid(res.data))
      .catch((error) => console.log("No token || "+error)) 
    })()
  }, [uid]);

  return (
    <UidContext.Provider value={uid}>
      <AppRoutes />
    </UidContext.Provider>
  );
}

export default App;
