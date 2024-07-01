import SideBar from "@/components/SideBar"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="w-screen flex min-h-screen">
      <div className="w-[6%] h-screen"><SideBar/></div>
      <div className="w-[94%] h-full">
        <Outlet/>
      </div>
    </div>
  )
}

export default Layout
