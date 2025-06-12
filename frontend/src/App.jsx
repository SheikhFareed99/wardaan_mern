
import Home from './components/Home.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import "./index.css";
import Products from "./components/Products.jsx";
import ProductDescription from './components/ProductDescription.jsx';
import CheckOut from './components/CheckOut.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
    {
    path: "/AdminDashboard",
    element: <AdminDashboard />
  },
      {
    path: "/AdminLogin",
    element: <AdminLogin />
  },
  {
    path: "/products/:category",
    element: <Products />
  },
  {
   path:'/ProductDescrition/:productId',
   element:<ProductDescription/>
  },
  {
    path:'/CheckOut',
    element:<CheckOut/>
   }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
