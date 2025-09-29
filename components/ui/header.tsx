"use client";
import React from "react";
import logo from "@/public/logo.png";
import { useAppSelector } from "@/redux/hooks";
function Header() {
  let { user, loading } = useAppSelector((state) => state.auth);
  user = (user as any).user.dataValues;
  if (user) {
    return (
      <header className="flex items-center justify-between lg:px-8 bg-white h-[90px] z-1 relative">
        <div className="flex gap-1 items-center">
          <img
            src={logo.src}
            alt="logo"
            className="max-w-15 max-h-15 md:max-w-25 md:max-h-25"
          />
          <h2 className="text-lg lg:text-2xl font-semibold">Blitzvox CRM</h2>
        </div>
        <div className="text-lg lg:text-2xl">
          Hello ,{user.name.toUpperCase()}
        </div>
      </header>
    );
  }
}

export default Header;
