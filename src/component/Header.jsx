import React from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const count = useSelector((state) => state.counter.value);

  return <div>Header: {count}</div>;
};

export default Header;
