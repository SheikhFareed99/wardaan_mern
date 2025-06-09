import { useParams } from "react-router-dom";
import Header from "./header.jsx";
import Footer from "./footer.jsx";
function Products() {
  const { category } = useParams();

  return (
    <>  
    <Header />
  <div><h1>hello word</h1></div>
  <Footer />
  </>
  );
}

export default Products;
