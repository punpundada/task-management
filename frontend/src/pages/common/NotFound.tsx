
import { Separator } from "@/components/ui/separator"

const NotFound = () => {
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
        <div className="flex items-center space-x-3">
        <span className="text-lg font-bold">404</span> 
      <Separator orientation="vertical" className="border h-11" />
      <span>Page not found</span>
        </div>
    </div>
  )
}

export default NotFound
