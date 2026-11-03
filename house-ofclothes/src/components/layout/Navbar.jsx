import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold tracking-wide">
            HOUSE OF CLOTHES
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex gap-8 font-medium">
            <Link to="/">Home</Link>

            <Link to="/products">Men</Link>

            <Link to="/products">Women</Link>

            <Link to="/products">Footwear</Link>

            <Link to="/products">Accessories</Link>
          </nav>

          {/* Search */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-72">
            <Search className="text-gray-500" />

            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none ml-3 w-full"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5 text-xl">
            <Link to="/wishlist">
              <Heart />
            </Link>

            <Link to="/cart">
              <ShoppingCart />
            </Link>

            <Link to="/login">
              <User />
            </Link>

            <button className="lg:hidden">
              <Menu />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
