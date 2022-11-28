import React from "react";
import PropTypes from "prop-types";

import Design from "./components/set";
import Add from "./components/add";
import Child from "./components/child";
import Table from "./components/table";
import Preview from "./components/preview";
import DesignConfiguration from "./components/designConfiguration";

const renderHashMap = {
  set: Design,
  add: Add,
  Edit: Add,
  child: Child,
  table: Table,
  preview: Preview,
  designConfiguration: DesignConfiguration,
};

const App = ({ type, ...props }) => {
  // console.log("type, ...props : ", type, props);
  let Comp = () => <></>;
  if (renderHashMap[type]) Comp = renderHashMap[type];
  return <Comp {...props} type={type} />;
};

App.propTypes = {
  type: PropTypes.string,
};

export default App;
