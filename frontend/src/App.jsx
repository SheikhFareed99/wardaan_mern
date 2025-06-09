
import Home from './components/Home.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import "./index.css";
import Products from "./components/Products.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/products/:category",
    element: <Products />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
