// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Navbar from "@/components/global/SideMenu";
// const ScrapyPagesLayout: React.FC = () => {
//   // navbar on scroll effect
//   const [navStyle, setNavStyle] = useState("mt-2");
  
//   return (
//     <div >
//       <div className={[
//           "fixed z-10 w-full  shadow-lg px-2 rounded-lg duration-300 transition-all bg-card",
//           navStyle,
//         ].join(" ")} >

//         <Navbar />
//       </div>
//       <div className="pt-20">

//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default ScrapyPagesLayout;