import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
// import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
// import RTLLayout from "layouts/RTL.js"; // Chakra imports
import { ChakraProvider } from "@chakra-ui/react";
// Custom Chakra theme
import theme from "theme/theme.js";
import { store } from "store/store";
import { Provider } from "react-redux";
import '../src/views/index.css'

ReactDOM.render(
  <Provider store={store}>
    <ChakraProvider theme={theme} resetCss={false} position="relative">
      <HashRouter>
        <Switch>
          {/* <Route path="/auth" component={AuthLayout} /> */}
          <Route path="/admin" component={AdminLayout} />
          {/* <Route path="/rtl" component={RTLLayout} /> */}
          <Redirect from="/" to="/admin/dashboard" />
        </Switch>
      </HashRouter>
    </ChakraProvider>
  </Provider>,
  document.getElementById("root")
);
