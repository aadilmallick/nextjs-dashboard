import React from "react";
import SidebarLink from "./SidebarLink";

export interface ISidebarLink {
  label: string;
  icon: string;
  link: string;
}
const links = [
  { label: "Home", icon: "home", link: "/home" },
  {
    label: "Calendar",
    icon: "calendar",
    link: "/calendar",
  },
  { label: "Profile", icon: "profile", link: "/profile" },
  {
    label: "Settings",
    icon: "settings",
    link: "/settings",
  },
];

const Sidebar = () => {
  //
  return (
    <div className="card w-16 md:w-36 h-full grid grid-cols-1 items-center justify-items-center">
      {links.map((link) => (
        <SidebarLink link={link} key={link.label} />
      ))}
    </div>
  );
};

export default Sidebar;
