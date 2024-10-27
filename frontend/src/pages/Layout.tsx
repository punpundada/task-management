import SideBar from "@/components/SideBar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen">
      <div className="w-16 min-w-14 h-screen hidden md:block"><SideBar/></div>
      <div className="w-full  md:w-[96%] h-full p-4 ">
       <ScrollArea className="w-full h-full">
         <Outlet/>
       </ScrollArea>
      </div>
    </div>
  )
}

export default Layout
