import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";
import ReceptionLogin from './views/Pages/ReceptionLogin';
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme.js";
import { store } from "store/store";
import { Provider } from "react-redux";
import '../src/views/index.css';
import PrivateRoute from './PrivateRoute'; // Import the PrivateRoute component
import MonthWiseUnpaidAttendance from "views/Pages/MonthWiseUnpaidAttendance";

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider theme={theme} resetCss={false} position="relative">
      <HashRouter>
        <Switch>
          <Route path="/reception-login" component={ReceptionLogin} />
          {/* Use PrivateRoute for routes that need authentication */}
          <PrivateRoute path="/admin" component={AdminLayout} />



          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </HashRouter>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
