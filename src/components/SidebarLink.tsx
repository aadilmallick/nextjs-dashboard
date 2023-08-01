"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaCog,
  FaPersonBooth,
  FaRegIdBadge,
  FaCalendar,
  FaHome,
} from "react-icons/fa";
import { ISidebarLink } from "./Sidebar";

const icons = {
  settings: FaCog,
  profile: FaPersonBooth,
  home: FaHome,
  calendar: FaCalendar,
};
interface SidebarLinkProps {
  link: ISidebarLink;
}
const SidebarLink = ({ link }: SidebarLinkProps) => {
  const pathname = usePathname();
  let isActive = pathname === link.link;
  const Icon = icons[link.icon] as typeof FaCog;
  return (
    <Link
      href={link.link}
      className="hover:bg-gray-200  transition-colors p-4 rounded-lg"
      prefetch={false}
    >
      <Icon size={40} color={isActive ? "#0000ff" : "gray"} />
    </Link>
  );
};

export default SidebarLink;

// cannot send a component as a property form a server component to a client component because components are functions, and they are not serializable, so they cannot get sent as JSON.
