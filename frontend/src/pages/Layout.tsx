import SideBar from "@/components/SideBar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-16 min-w-14 h-screen hidden md:block"><SideBar/></div>
      <div className="w-full  md:w-[96%] h-full p-3 ">
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
