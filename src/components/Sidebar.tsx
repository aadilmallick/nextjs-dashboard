"use client";
import React from "react";
import SidebarLink from "./SidebarLink";
import Image from "next/image";
import Modal from "react-modal";

Modal.setAppElement("#modal");

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
  const [open, setOpen] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="card w-8 sm:w-8 md:w-24 xl:w-30 2xl:w-36 h-full hidden sm:grid grid-cols-1 items-center justify-items-center">
        {links.map((link) => (
          <SidebarLink link={link} key={link.label} />
        ))}
      </div>
      <div className="block sm:hidden fixed -top-2 -left-2 z-10">
        <button
          className="bg-gray-200 font-bold text-lg p-4 rounded-lg hover:bg-gray-300 hover:rounded-full hover:rotate-90 transition-all duration-300"
          onClick={() => setIsModalOpen((prev) => !prev)}
        >
          <Image
            src="/hamburger-menu-icon.svg"
            alt="menu"
            width={20}
            height={20}
          />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        overlayClassName="bg-[rgba(0,0,0,.4)] flex justify-center items-center absolute top-0 left-0 h-screen w-screen"
        className="w-1/2 bg-white rounded-xl p-2 flex justify-center items-center"
      >
        <div className="card w-8 h-full grid grid-cols-1 items-center justify-items-center">
          {links.map((link) => (
            <SidebarLink link={link} key={link.label} />
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
