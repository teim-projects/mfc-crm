import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Staff from "./pages/staff/Staff";
import AddRole from "./pages/staff/AddRole";
import AddStaff from "./pages/staff/AddStaff";
import Schools from "./pages/school/Schools";
import AddSchool from "./pages/school/AddSchool";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthWatcher from "./components/AuthWatcher";
import CourseTypes from "./pages/course/CourseTypes";
import CourseLevels from "./pages/course/CourseLevels";
import Courses from "./pages/course/Courses";
import AddCourse from "./pages/course/AddCourse";
import Students from "./pages/students/Students";
import AddStudent from "./pages/students/AddStudent";
import AllStudents from "./pages/students/AllStudents";
import Products from "./pages/product/Products";
import AddProduct from "./pages/product/AddProduct";
import { ThemeProvider } from "./context/ThemeContext";


import AddVendor from "./pages/inventory/AddVendor";
import Inventory from "./pages/inventory/Inventory";
import AddPO from "./pages/inventory/AddPo";
import AddGRN from "./pages/inventory/AddGRN";
import ParentPurchase from "./pages/billing/ParentPurchase";
import SchoolStudents from "./pages/billing/SchoolStudents";

import CreateReceipt from "./pages/billing/CreateReceipt";
import ReceiptDetail from "./pages/billing/ReceiptDetail";
import Promotion from "./pages/students/Promotion";

function App() {
  return (
    <BrowserRouter>
    <ThemeProvider>
    <AuthWatcher /> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>}  />
        <Route path="/staff" element={ <ProtectedRoute> <Staff /> </ProtectedRoute>} />
        <Route path="/add-role" element={<AddRole />} />
        <Route path="/add-staff" element={  <ProtectedRoute> <AddStaff /> </ProtectedRoute> } />
        <Route path="/schools" element={ <ProtectedRoute> <Schools />   </ProtectedRoute> } /> 
        <Route path="/schools/add"element={ <ProtectedRoute><AddSchool /> </ProtectedRoute> } />
        <Route  path="/schools/edit/:id"element={    <ProtectedRoute>    <AddSchool />  </ProtectedRoute>}/>


        <Route path="/course-types" element={   <ProtectedRoute>     <CourseTypes />   </ProtectedRoute> }/>

        <Route path="/course-levels" element={   <ProtectedRoute>     <CourseLevels />   </ProtectedRoute> }/>
        <Route path="/courses" element={  <ProtectedRoute>  <Courses />  </ProtectedRoute> }/>

        <Route path="/courses/add" element={ <ProtectedRoute><AddCourse /></ProtectedRoute>}/>
        
        <Route path="/courses/edit/:id" element={<ProtectedRoute> <AddCourse /> </ProtectedRoute>}/>

        <Route path="/schools/:schoolId/students" element={ <ProtectedRoute> <Students /> </ProtectedRoute>}/>

        <Route path="/schools/:schoolId/students/add" element={ <ProtectedRoute>   <AddStudent /> </ProtectedRoute>}/>
        
        <Route path="/allstudents" element={ <ProtectedRoute>  <AllStudents /> </ProtectedRoute>}/>
        <Route path="/students/edit/:id" element={ <ProtectedRoute> <AddStudent /> </ProtectedRoute> }/>


        <Route  path="/products" element={    <ProtectedRoute>      <Products />   </ProtectedRoute>}/>
        
        <Route path="/products/add" element={    <ProtectedRoute>      <AddProduct />    </ProtectedRoute>  }/>
        
        <Route path="/products/edit/:id" element={ <ProtectedRoute>   <AddProduct /> </ProtectedRoute>}/>


        <Route  path="/vendors/add" element={  <ProtectedRoute>    <AddVendor />  </ProtectedRoute>}/>
        <Route path="/vendors/edit/:id" element={   <ProtectedRoute>     <AddVendor />   </ProtectedRoute> }/>

        <Route path="/inventory" element={   <ProtectedRoute>     <Inventory />   </ProtectedRoute> }/>

        <Route path="/po/add" element={  <ProtectedRoute>    <AddPO />  </ProtectedRoute>}/>

        <Route path="/po/edit/:id" element={   <ProtectedRoute>     <AddPO />   </ProtectedRoute> }/>


        <Route path="/grn/add" element={   <ProtectedRoute>     <AddGRN />   </ProtectedRoute>}/>

        <Route  path="/grn/edit/:id" element={   <ProtectedRoute>     <AddGRN />   </ProtectedRoute> }/>

        <Route path="/billing" element={<ProtectedRoute><ParentPurchase /></ProtectedRoute>} />
        <Route path="/billing/school/:schoolId/students" element={<ProtectedRoute><SchoolStudents /></ProtectedRoute>}/>
        
        <Route path="/billing/create" element={<ProtectedRoute><CreateReceipt /></ProtectedRoute>} />
        <Route path="/billing/receipt-detail/:receiptId" element={<ProtectedRoute><ReceiptDetail /></ProtectedRoute>} />
        <Route path="/promotions" element={   <ProtectedRoute>     <Promotion />   </ProtectedRoute> }/>
        <Route path="/course-levels"element={  <ProtectedRoute>    <CourseLevels />  </ProtectedRoute>}/>

        

        
      </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;