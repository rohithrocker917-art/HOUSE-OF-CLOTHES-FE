import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-[#24251f] px-5 pb-5 pt-[38px] text-[#f4f2ec] sm:px-8 sm:pt-[50px]">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-[30px] pb-[45px] sm:grid-cols-[2fr_1fr_1fr_1.4fr] sm:gap-[35px]">
        <div>
          <Link to="/" className="flex items-center gap-2.5 whitespace-nowrap text-xs font-bold tracking-[0.09em] text-[#f4f2ec]">
            <span className="font-serif text-[32px] font-semibold tracking-[-0.08em]">
              H<span className="text-[#9ebd42]">.</span>
            </span>
            <span>
              HOUSE OF CLOTHES
              <small className="mt-1 block text-[8px] tracking-[0.22em] text-[#aaa99f]">
                STYLE, YOUR WAY
              </small>
            </span>
          </Link>
          <p className="text-[11px] leading-[1.8] text-[#aaa99f]">
            Wear what feels like you.
            <br />
            Discover pieces made for every version of you.
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] justify-between gap-[15px] border-t border-[#41423b] pt-[18px] text-[9px] text-[#92928a]">
        <span>© 2026 House of Clothes</span>
        <span>Made for your everyday.</span>
      </div>
    </footer>
  );
}
