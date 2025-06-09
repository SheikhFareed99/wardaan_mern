import React from "react";
import Chinease from "../components/chinease";
import Layout from "../components/Layout";
import { useState,useEffect } from "react";
const Chinese_r = ({dish}) => {
 
 
  
const[items,setitems]=useState([]);
useEffect(()=>{
  fetch(`http://localhost:3000/menu/${dish}`) 
  .then(response => response.json())
  .then(data => setitems(data)) 
  .catch(error => console.error("Error fetching menu:", error));
  

},[dish])


    return (
      <Layout>
        <main>
            <div className="items-container">
   
 { items && items.map((item) => (
  <Chinease key={item.id} item={item} />
))}
            </div>
        </main>
        </Layout>
    );
};

export default Chinese_r;