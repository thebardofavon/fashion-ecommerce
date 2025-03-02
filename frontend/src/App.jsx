// import { useLoaderData } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import './App.css';

function App() {
  // const { user } = useLoaderData();
  return (
    <div>
      <CssBaseline />
      <ResponsiveAppBar />
      <h1>React App</h1>
    </div>
  );
}

export default App;
