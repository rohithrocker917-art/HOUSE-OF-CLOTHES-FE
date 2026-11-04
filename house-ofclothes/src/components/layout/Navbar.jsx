import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  UserRound,
  LogOut,
} from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import { toggleSidebar } from "../../redux/slices/uiSlice";
import { logout } from "../../redux/slices/authSlice";
export default function Navbar() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const dispatch = useDispatch();
  const count = useSelector((s) => s.cart.totalCount || 0),
    wish = useSelector((s) => s.wishlist.count || 0),
    authed = useSelector((s) => s.auth.isAuthenticated);
  const submit = (e) => {
    e.preventDefault();
    nav(`/products?search=${encodeURIComponent(q)}`);
  };
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#e6e3dc] bg-[#f8f7f3]/90 backdrop-blur-md dark:border-[#33352f] dark:bg-[#171815]/90">
        <div className="mx-auto flex h-[66px] w-[calc(100%-24px)] max-w-[1320px] items-center gap-2 md:h-[78px] md:w-[calc(100%-48px)] md:gap-[34px]">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f] min-[701px]:hidden"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Open menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <Link
            to="/"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[9px] font-bold tracking-[0.09em] md:gap-2.5 md:text-xs"
          >
            <span className="font-serif text-[27px] font-semibold tracking-[-0.08em] md:text-[32px]">
              H<span className="text-[#9ebd42]">.</span>
            </span>
            <span className="leading-tight">
              HOUSE OF CLOTHES
              <small className="mt-1 block text-[7px] tracking-[0.22em] text-[#77766f] dark:text-[#a7a69e] md:text-[8px]">
                STYLE, YOUR WAY
              </small>
            </span>
          </Link>
          <nav className="hidden gap-[25px] whitespace-nowrap text-xs text-[#77766f] dark:text-[#a7a69e] min-[1051px]:flex">
            <Link className="transition hover:text-[#22231f] dark:hover:text-[#f4f2ec]" to="/products">Shop all</Link>
            <Link className="transition hover:text-[#22231f] dark:hover:text-[#f4f2ec]" to="/products?category=mens-clothing">Men</Link>
            <Link className="transition hover:text-[#22231f] dark:hover:text-[#f4f2ec]" to="/products?category=womens-clothing">Women</Link>
            <Link className="transition hover:text-[#22231f] dark:hover:text-[#f4f2ec]" to="/products?category=accessories">Accessories</Link>
          </nav>
          <form
            className="ml-auto hidden w-[220px] items-center gap-2 rounded-[30px] border border-[#e6e3dc] bg-white px-3 py-2.5 text-[#77766f] dark:border-[#33352f] dark:bg-[#20221e] dark:text-[#a7a69e] min-[701px]:flex min-[1051px]:w-[min(300px,30vw)]"
            onSubmit={submit}
          >
            <Search size={17} className="shrink-0" />
            <input
              className="w-full border-0 bg-transparent text-[11px] text-[#22231f] outline-none dark:text-[#f4f2ec]"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search your next favourite…"
            />
            <kbd className="rounded border border-[#e6e3dc] px-1 text-[10px] dark:border-[#33352f]">↵</kbd>
          </form>
          <div className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-[7px]">
            <ThemeToggle />
            <Link
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f]"
              to="/wishlist"
              aria-label="Wishlist"
            >
              <Heart className="h-[18px] w-[18px]" />
              <i className="absolute right-0 top-0 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#d3ef72] text-[9px] not-italic text-[#22231f]">{wish}</i>
            </Link>
            <Link
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f]"
              to="/cart"
              aria-label="Cart"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              <i className="absolute right-0 top-0 grid h-[15px] min-w-[15px] place-items-center rounded-full bg-[#d3ef72] text-[9px] not-italic text-[#22231f]">{count}</i>
            </Link>
            <Link
              className="relative hidden h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f] min-[701px]:inline-flex"
              to={authed ? "/profile" : "/login"}
              aria-label="Account"
            >
              <UserRound className="h-[18px] w-[18px]" />
            </Link>
            {authed && (
              <button
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#22231f] transition hover:bg-[#e6e3dc] dark:text-[#f4f2ec] dark:hover:bg-[#33352f]"
                type="button"
                onClick={() => {
                  dispatch(logout());
                  nav("/login");
                }}
                aria-label="Log out"
                title="Log out"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
