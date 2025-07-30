
import Home from './components/Home.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom"; 
import "./index.css";
import Products from "./components/Products.jsx";
import ProductDescription from './components/ProductDescription.jsx';
import CheckOut from './components/CheckOut.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import OrdersManagment from './components/OrdersManagment.jsx';
import ProductManagment from './components/ProductManagment.jsx';
import FinanceManagment from './components/FinanceManagment.jsx';
import OrderTrack from './components/OrderTrack.jsx'
import OrderConfirmation from './components/OrderConfirmation.jsx';
import Delete from './components/delete.jsx';
import Term from './components/term.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/terms",
    element: <Term />
  },
  // {
  //   path: "/",
  //   element: <Delete />
  // },
  {
    path: "/OrderTrack",
    element: <OrderTrack />
  },
  {
    path: "/OrderConfirmation",
    element: <OrderConfirmation />
  },
    {
    path: "/AdminDashboard",
    element: <AdminDashboard />
  },
     {
    path: "/FinanceManagment",
    element: <FinanceManagment />
  },
    {
    path: "/ProductManagment",
    element: <ProductManagment />
  },
      {
    path: "/OrdersManagment",
    element: <OrdersManagment />
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
   path:'/ProductDescrition/:id',
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
