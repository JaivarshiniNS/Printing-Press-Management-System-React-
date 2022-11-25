import Dashboard from "./components/Pages/Dashboard";
import UserProfile from "views/UserProfile.js";
import Employeelist from "./components/Pages/Employeelist";
import AddEmployee from "components/Pages/Addemploee";
import Materialpurchaselist from "components/Pages/Materialpurchase";
import Productlist from "components/Pages/Productlist";
import ViewResume from "components/Pages/ViewResume";
import OrderList  from "components/Pages/OrderList";


const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/employee",
    name: "EmployeeList",
    icon: "nc-icon nc-chart-pie-35",
    component: Employeelist,
    layout: "/admin"
  },
  {
    path: "/add_emp",
    name: "AddEmployee",
    icon: "nc-icon nc-chart-pie-35",
    component: AddEmployee,
    layout: "/admin"
  },
  {
    path: "/product",
    name: "Product Master",
    icon: "nc-icon nc-chart-pie-35",
    component: Productlist,
    layout: "/admin"
  },
  {
    path: "/purchase",
    name: "Stock And Purchase",
    icon: "nc-icon nc-chart-pie-35",
    component: Materialpurchaselist,
    layout: "/admin"
  },
  {
    path: "/view_order",
    name: "View Order",
    icon: "nc-icon nc-chart-pie-35",
    component: OrderList,
    layout: "/admin"
  },
  {
    path: "/view_resume",
    name: "View Job Applications",
    icon: "nc-icon nc-chart-pie-35",
    component: ViewResume,
    layout: "/admin"
  }
  
];

export default dashboardRoutes;
