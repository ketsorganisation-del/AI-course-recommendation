"use client";

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem("coursify_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Listen to local changes
    window.addEventListener("storage", checkUser);
    
    // Custom listener for single-page changes in same tab
    const handleStorageChange = () => checkUser();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("coursify_user");
    setUser(null);
    router.push("/");
    // Trigger custom event to notify other components
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div>
      <NavigationMenu viewport={false} className="bg-transparent/60 backdrop-blur-md border-b border-white/5 z-50 fixed justify-between min-w-full h-18 px-6 flex items-center">
        
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Coursify
          </h1>
        </Link>

        <NavigationMenuList className="bg-transparent justify-center gap-5 hidden sm:flex" >
          <NavigationMenuItem className="text-sm text-gray-300 hover:text-white transition-colors">
            <NavigationMenuLink href="/">Home</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-sm text-gray-300 hover:text-white transition-colors">
            <NavigationMenuLink href="/about">About</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-sm text-gray-300 hover:text-white transition-colors">
            <NavigationMenuLink href="/help">Help</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="text-sm text-gray-300 hover:text-white transition-colors">
            <NavigationMenuTrigger>Library</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="p-3 bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-40 flex flex-col gap-2">
                <NavigationMenuLink href="/chat" className="text-sm text-gray-300 hover:text-white block py-1">
                  Active Chats
                </NavigationMenuLink>
                <NavigationMenuLink href="/library" className="text-sm text-gray-300 hover:text-white block py-1">
                  Saved Roadmaps
                </NavigationMenuLink>
                <div className="h-px bg-gray-800 my-1" />
                <NavigationMenuLink href="/admin" className="text-sm text-cyan-400 hover:text-cyan-300 block py-1 font-semibold">
                  Admin Panel
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        <div className="flex gap-3 items-center">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-800 rounded-full py-1 pl-1 pr-3">
                <div className="w-7 h-7 rounded-full bg-linear-to-tr from-cyan-400 to-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-inner">
                  {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-xs font-semibold text-gray-200">
                  {user.name ? user.name.split(" ")[0] : "Learner"}
                </span>
              </div>
              <Button 
                onClick={handleLogout} 
                className="bg-transparent text-gray-400 hover:text-white border border-gray-800 hover:bg-red-950/20 hover:border-red-900/50 cursor-pointer text-xs py-1.5 h-auto px-3" 
                size="sm"
              >
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button 
                onClick={() => router.push("/auth?mode=login")}
                className="bg-transparent text-white border border-white/20 hover:bg-white/10 hover:text-white cursor-pointer" 
                size="sm"
              >
                Login
              </Button>
              <Button 
                onClick={() => router.push("/auth?mode=signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 cursor-pointer" 
                size="sm"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

      </NavigationMenu>
    </div>
  )
}

export default Navbar

