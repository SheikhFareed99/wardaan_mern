
import Home from './components/Home.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import "./index.css";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
