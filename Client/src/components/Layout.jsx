import React, { useEffect, useRef, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import {
  BarChart2,
  GamepadIcon,
  LogIn,
  Radio,
  User,
  BadgeInfo,
  MessageSquareText,
  FileVideo2,
} from "lucide-react";
import { motion } from "framer-motion";

// SidebarLink is wrapped in forwardRef so we can measure its position.
const SidebarLink = React.forwardRef(
  ({ to, IconComponent, label, isActive }, ref) => {
    return (
      <Link
        to={to}
        ref={ref}
        className="relative flex flex-col items-center justify-center pt-2.5 pb-1.5 group hover:bg-ter rounded-lg transition-colors"
      >
        <IconComponent
          className={`w-6 h-6 transition-colors duration-300 ${
            isActive ? "txt" : "!txt-disabled group-hover:txt"
          }`}
        />
        <span className="text-xs txt-dim">{label}</span>
      </Link>
    );
  }
);

function Layout() {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Ref for the sidebar container.
  const sidebarRef = useRef(null);
  // Object to store refs for each SidebarLink (keyed by its route).
  const linkRefs = useRef({});

  // State to hold the computed top offset for the active indicator.
  const [indicatorPos, setIndicatorPos] = useState({ top: 0 });

  // Compute the active indicator position only when not on the home page.
  useEffect(() => {
    if (location.pathname === "/") return; // No indicator on home.
    const activeLink = linkRefs.current[location.pathname];
    if (sidebarRef.current && activeLink) {
      const containerRect = sidebarRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      const indicatorHeight = 32; // Matches Tailwind's h-8 (~32px)
      const top =
        linkRect.top -
        containerRect.top +
        linkRect.height / 2 -
        indicatorHeight / 2;
      setIndicatorPos({ top });
    }
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  return (
    <div className="flex min-h-screen bg-primary txt !transition-colors !duration-500">
      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className="w-[70px] border-r border-gray-500/20 p-1 flex flex-col items-center justify-between fixed top-0 left-0 h-screen "
      >
        <div>
          <Link to="/">
            <div className="hover:bg-ter rounded-lg transition-opacity duration-300 ">
              <img
                src="./Logo.svg"
                alt="Logo"
                className={`w-full m-auto object-contain p-4 dark:invert ${
                  isHome ? "opacity-100" : "opacity-80"
                }`}
              />
            </div>
          </Link>
          <div className="space-y-5 mt-2">
            <SidebarLink
              to="/study-room"
              IconComponent={Radio}
              label="Session"
              isActive={location.pathname === "/study-room"}
              ref={(el) => (linkRefs.current["/study-room"] = el)}
            />
            <SidebarLink
              to="/chat-room"
              IconComponent={MessageSquareText}
              label="chat"
              isActive={location.pathname === "/chat-room"}
              ref={(el) => (linkRefs.current["/chat-room"] = el)}
            />
            <SidebarLink
              to="/stats"
              IconComponent={BarChart2}
              label="Stats"
              isActive={location.pathname === "/stats"}
              ref={(el) => (linkRefs.current["/stats"] = el)}
            />
            <SidebarLink
              to="/games"
              IconComponent={GamepadIcon}
              label="Games"
              isActive={location.pathname === "/games"}
              ref={(el) => (linkRefs.current["/games"] = el)}
            />
            <SidebarLink
              to="/course"
              IconComponent={FileVideo2}
              label="course"
              isActive={location.pathname === "/course"}
              ref={(el) => (linkRefs.current["/course"] = el)}
            />
            <SidebarLink
              to="/facedect"
              IconComponent={FileVideo2}
              label="facedect"
              isActive={location.pathname === "/facedect"}
              ref={(el) => (linkRefs.current["/facedect"] = el)}
            />
            <SidebarLink
              to="/meditation"
              IconComponent={FileVideo2}
              label="meditation"
              isActive={location.pathname === "/meditation"}
              ref={(el) => (linkRefs.current["/meditation"] = el)}
            />
          </div>
          <hr className="border-sec my-5 mx-4" />
          <SidebarLink
            to="/project-details"
            IconComponent={BadgeInfo}
            label="About"
            isActive={location.pathname === "/project-details"}
            ref={(el) => (linkRefs.current["/project-details"] = el)}
          />
        </div>

        <div className="space-y-2 w-full">
          {/* Theme toggle button now uses the rounded-lg variable */}
          <ThemeToggle />
          {!token && (
            <SidebarLink
              to="/authenticate"
              IconComponent={LogIn}
              label="Login"
              isActive={location.pathname === "/authenticate"}
              ref={(el) => (linkRefs.current["/authenticate"] = el)}
            />
          )}
          {token && (
            <SidebarLink
              to="/profile"
              IconComponent={User}
              label="Profile"
              isActive={location.pathname === "/profile"}
              ref={(el) => (linkRefs.current["/profile"] = el)}
            />
          )}
        </div>

        {/* Render the animated active indicator only if not on the home page */}
        {!isHome && (
          <motion.span
            className="absolute left-1 h-8 w-1 rounded-full bg-[var(--btn)]"
            animate={{ top: indicatorPos.top }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </nav>

      {/* Main content area with a slide-in-from-bottom animation */}
      <main className="flex-1 ml-[70px]">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

export default Layout;
