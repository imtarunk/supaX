import { FaGift } from "react-icons/fa";
import { IoFlame } from "react-icons/io5";
import { RiFlashlightFill } from "react-icons/ri";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-[#0F0F0F] text-white ">
      <div className="flex items-center space-x-4">
        {/* Logos */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold">Ordzaar</span>
          <span className="text-xl font-bold">OdinSwap</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Gift Button */}
        <button className="flex items-center justify-center bg-transparent border border-red-500 rounded-lg px-3 py-1">
          <FaGift className="text-red-500" />
        </button>

        {/* Streak Counter */}
        <div className="flex items-center space-x-2 bg-[#1A1A1A] rounded-lg px-3 py-1">
          <IoFlame className="text-orange-500" />
          <span>2 Day streak</span>
        </div>

        {/* XP Display */}
        <div className="flex items-center space-x-2">
          <RiFlashlightFill className="text-yellow-500" />
          <span>11,121 XP</span>
        </div>

        {/* Level Indicator */}
        <div className="flex items-center space-x-2">
          <span className="bg-[#1A1A1A] rounded-lg px-2 py-1">#9</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
