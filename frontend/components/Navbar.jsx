import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "next-auth/react";
import { logoutUser } from "../app/store/slice/loginSlice";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenOut, setIsOpenOut] = useState(false);
  const dispatch = useDispatch(); // Initialize dispatch
  const dropdownRef = useRef(null);
  // const userData = useSelector((state) => state.user.user);
  const userData = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  let userPermission = useSelector((state) => state.user.userPermission[0]);


  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      dispatch(logoutUser());
      localStorage.setItem('isAuth', false);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleLogout = () => {
    setIsOpenOut(!isOpenOut);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpenOut(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm w-full">
      <div className="flex flex-wrap items-center justify-between mx-auto pt-5 pb-5 pr-10 pl-10">
        <a href="/homepage" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            AP Regist
          </span>
        </a>
        <button
          onClick={toggleNavbar}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-dropdown"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`md:block w-full md:w-auto ${isOpen ? "block" : "hidden"}`}
          id="navbar-dropdown"
        >
          <ul className="lg:items-center sm:items-start flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ">
            <li>
              <Link
                href="/informationForm"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                แจ้งประกันภัย
              </Link>
             
            </li>
            <li>
              <Link
                href="/registeredForm"
                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
              >
                จดทะเบียน
              </Link>
             
            </li>
            {/* <Dropdown>
              <DropdownTrigger className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent" style={{ cursor: "pointer" }}>
                ตรวจสอบข้อมูล
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem>
                  <Link href="/informationForm">
                    แจ้งประกันภัย/ชำระเบี้ย
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/registeredForm">
                    จดทะเบียน
                  </Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            {/* {userPermission?.find((val) => val.menu == 'MNUS' && val.is_view == 1) && */}
              <li>
                <Link
                  href="/manageUser"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  จัดการสิทธิ
                </Link>
              </li>
            {/* } */}


            <li className="flex items-center space-x-2">
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  type="button"
                  className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  id="dropdownMenuButton"
                  aria-expanded={isOpenOut}
                  onClick={toggleLogout}
                >
                  <img
                    className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                    src="/images/profile.png"
                    alt="Profile Avatar"
                  />
                </button>
                <div
                  className={`absolute left-0 transform translate-x-0 md:left-auto md:right-0 z-10 w-48 mt-2 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 ${isOpenOut ? "block" : "hidden"}`}
                  id="dropdownMenu"
                >
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      {userData?.name ? `Hello, ${userData.name}` : "Welcome, Guest"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
