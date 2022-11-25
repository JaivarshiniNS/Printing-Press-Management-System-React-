import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React from 'react';
import { Fragment } from 'react';
import AdminLayout from "layouts/Admin.js";
import Login from './components/Pages/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Banner from './Website/Banner'
import ProductCart from './Website/Productcart'
import careerspage from './Website/Careers'
import Home from 'components/Pages/Home';



const App = () => {
  // const stateAuthToken = useSelector((state) => state.auth.token);
  //const commonLoading = useSelector((state) => state.Login.commonLoading);
  const Auth = localStorage.getItem('Login');

  return (
    <Fragment>
      <ToastContainer />
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={Home} />
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route exact path="/purchase" component={Banner} />
          <Route exact path="/cart/:id" component={ProductCart} />
          <Route exact path="/careers" component={careerspage} />

        </Switch>
      </Router>
    </Fragment>
  );
};

export default App;

{/* <spin></spin> */ }

