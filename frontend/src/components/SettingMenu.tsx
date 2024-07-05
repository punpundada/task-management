import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { CircleUserRound, Power, Settings, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/context/AuthContext";
import AuthService from "@/services/authService";
import { useState } from "react";

type Props = {};

const SettingMenu = () => {
  const { isAuthenticated, setData } = useAuthContext();

  const handleLogout = async () => {
    const data = await AuthService.logout();
    if (data.isSuccess) {
      window.localStorage.removeItem("user");
      setData({ isAuthenticated: false, user: undefined });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Settings className="hover:rotate-12 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2 text-2xl min-w-52" collisionPadding={30}>
        <DropdownMenuLabel className="text-xl">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="">
          <CircleUserRound className="mr-2" strokeWidth={0.85} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="">
          <Settings2 strokeWidth={0.85} className="mr-2" />
          Settings
        </DropdownMenuItem>
        {isAuthenticated ? (
          <DropdownMenuItem onClick={handleLogout} className="">
            <Power className="mr-2" strokeWidth={0.75} /> Logout
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>Login</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingMenu;

/*

*/
