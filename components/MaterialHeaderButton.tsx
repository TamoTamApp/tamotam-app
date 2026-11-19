import React from "react";
import {
  HeaderButton,
  HeaderButtonProps,
} from "react-navigation-header-buttons";
import { MaterialIcons } from "@expo/vector-icons";

const MaterialHeaderButton = (props: HeaderButtonProps) => {
  return (
    <HeaderButton IconComponent={MaterialIcons as HeaderButtonProps["IconComponent"]} iconSize={23} {...props} />
  );
};

export default MaterialHeaderButton;
