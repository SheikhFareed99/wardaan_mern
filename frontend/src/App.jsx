
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
import AdminReports from './components/AdminReports.jsx';
import FinanceSummaryView from './components/FinanceSummaryView.jsx';
import OrdersOverview from './components/OrdersOverview.jsx';
import OrderTrack from './components/OrderTrack.jsx'
import OrderConfirmation from './components/OrderConfirmation.jsx';
import Delete from './components/delete.jsx';
import Term from './components/term.jsx'
import Reviews from './components/Reviews.jsx';
import Wishlist from './components/Wishlist.jsx';
import BackToTopButton from './components/BackToTopButton.jsx';
import FAQ from './components/FAQ.jsx';
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
        path: "/AdminReports",
        element: <AdminReports />
      },
      {
        path: "/FinanceSummary",
        element: <FinanceSummaryView />
      },
      {
        path: "/OrdersOverview",
        element: <OrdersOverview />
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
   path:'/ProductDescription/:id',
   element:<ProductDescription/>
  },
  {
    path:'/CheckOut',
    element:<CheckOut/>
   },
  {
    path: '/reviews',
    element: <Reviews />
  },
  {
    path: '/wishlist',
    element: <Wishlist />
  },
  {
    path: '/faq',
    element: <FAQ />
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <BackToTopButton />
    </>
  );
}

export default App;
