import { ShakaLogo } from "../ui/shaka-logo"
import ProfileModal from "./profile-modal"
import Cart from "./cart"

export default function Navbar() {
    return(
        <div className="flex items-center justify-between px-4 py-3 shadow-md  dark:bg-gray-900 sticky top-0 z-50 bg-white">
         <div>
            < ShakaLogo  />
        
         </div>
         <div className="flex items-center gap-4 ">
            <div className="p-2 rounded cursor-pointer hover:bg-[#fff8f0] transition">
                <ProfileModal />
            </div>
            <div className="p-2 rounded cursor-pointer hover:bg-[#fff8f0] transition">
                <Cart/>
            </div>
         </div>
         

        </div>
    )
}