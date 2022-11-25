import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import store from './Store/index';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import 'antd/dist/antd.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "layouts/Admin.js";

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <App />
 </Provider>,
);

