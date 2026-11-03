import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Truck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Layout from "../../components/layout/Layout";
import ProductCard from "../../components/product/ProductCard";
import {
  fetchProducts,
  fetchCategories,
} from "../../redux/slices/productSlice";

const perks = [
  { icon: Truck, title: "Free shipping", desc: "On orders above ₹999" },
  {
    icon: RotateCcw,
    title: "Easy returns",
    desc: "15 days to change your mind",
  },
  { icon: ShieldCheck, title: "Quality first", desc: "Pieces made to last" },
];

export default function Home() {
  const dispatch = useDispatch();
  const { products = [], loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <Layout>
      <section className="relative grid min-h-[530px] grid-cols-1 items-center gap-[30px] py-[38px] md:grid-cols-2 md:py-[55px]">
        <div className="max-w-[520px] py-5 md:pb-[25px]">
          <div className="inline-flex items-center gap-[9px] text-[10px] font-bold tracking-[0.16em] text-[#77766f] dark:text-[#a7a69e]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#9ebd42]" />
            THE EVERYDAY EDIT · 2026
          </div>
          <h1 className="my-[25px] text-[58px] font-semibold leading-[0.99] tracking-[-0.065em] md:text-[clamp(48px,6.4vw,82px)]">
            Find your
            <br />
            <em className="font-serif font-medium text-[#9ebd42]">
              own kind
            </em>{" "}
            of style.
          </h1>
          <p className="max-w-[400px] text-[13px] leading-[1.8] text-[#77766f] dark:text-[#a7a69e] md:text-sm">
            Good fits. Better feels. Discover the pieces that make getting
            dressed your favourite part of the day.
          </p>
          <div className="mt-[30px] flex items-center gap-6">
            <Link
              className="inline-flex items-center justify-center gap-3 rounded-sm bg-[#252620] px-5 py-3.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#45483b]"
              to="/products"
            >
              Shop the collection <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
        <div className="relative mx-3 h-[330px] overflow-visible md:mx-0 md:h-[440px]">
          <div className="relative h-full w-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-[center_38%]">
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-black/20" />
          </div>
          <div className="absolute bottom-5 left-[-18px] flex h-[110px] w-[110px] rotate-[-10deg] flex-col items-center justify-center gap-[7px] rounded-full bg-[#d3ef72] text-[#252620] md:bottom-10 md:left-[-35px] md:h-[145px] md:w-[145px]">
            <span className="text-[9px] tracking-[0.15em]">NEW</span>
            <b className="text-center font-serif text-[18px] font-medium leading-[1.05] md:text-[23px]">
              Spring
              <br />
              in motion
            </b>
            <ArrowUpRight size={20} />
          </div>
          <div className="absolute bottom-[-25px] right-0 text-[9px] tracking-[0.14em] text-[#77766f] dark:text-[#a7a69e]">
            01 / THE NEW SEASON
          </div>
        </div>
        <div className="absolute right-[-28px] top-1/2 hidden -translate-y-1/2 text-[9px] tracking-[0.2em] text-[#77766f] [writing-mode:vertical-rl] dark:text-[#a7a69e] md:block">
          DRESS LIKE YOU MEAN IT ↗
        </div>
      </section>

      <section className="my-[35px] grid grid-cols-3 border-y border-[#e6e3dc] py-[15px] dark:border-[#33352f] md:my-[25px] md:mb-[75px] md:py-5">
        {perks.map((perk, index) => (
          <div
            className={`flex items-center justify-start gap-[7px] border-r border-[#e6e3dc] px-[7px] last:border-r-0 dark:border-[#33352f] md:justify-center md:gap-3 ${
              index === 2 ? "border-r-0" : ""
            }`}
            key={perk.title}
          >
            <span className="grid h-[29px] w-[29px] shrink-0 place-items-center rounded-full border border-[#e6e3dc] bg-white dark:border-[#33352f] dark:bg-[#20221e] md:h-9 md:w-9">
              <perk.icon className="h-[14px] w-[14px] md:h-[19px] md:w-[19px]" />
            </span>
            <div>
              <b className="block text-[9px] md:text-[11px]">{perk.title}</b>
              <small className="mt-1 block text-[8px] text-[#77766f] dark:text-[#a7a69e] md:text-[10px]">
                {perk.desc}
              </small>
            </div>
          </div>
        ))}
      </section>

      <section className="my-[55px] md:my-[75px]">
        <div className="mb-7 flex items-start justify-between gap-[15px] md:items-end">
          <div>
            <span className="inline-flex items-center gap-[9px] text-[10px] font-bold tracking-[0.16em] text-[#77766f] dark:text-[#a7a69e]">
              A GOOD PLACE TO START
            </span>
            <h2 className="my-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] md:text-[clamp(35px,4vw,52px)]">
              Shop by{" "}
              <em className="font-serif font-medium text-[#9ebd42]">mood.</em>
            </h2>
          </div>
          <Link
            className="mt-[25px] inline-flex shrink-0 items-center gap-[9px] border-b border-[#22231f] pb-[5px] text-[10px] font-semibold transition-all hover:gap-3.5 dark:border-[#f4f2ec] md:mt-0 md:text-xs"
            to="/products"
          >
            All categories <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3">
          <Link
            to="/products?category=womens-clothing"
            className="flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#e7d8ce] p-[17px] text-[#46342e] transition-transform hover:-translate-y-1 md:min-h-[290px] md:p-6"
          >
            <span className="text-[9px] tracking-[0.15em] opacity-75">
              01 / HER EDIT
            </span>
            <b className="font-serif text-[27px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[34px]">
              Everyday
              <br />
              elevated.
            </b>
            <i className="flex items-center gap-2 text-[11px] font-semibold not-italic">
              Shop women <ArrowUpRight size={17} />
            </i>
          </Link>
          <Link
            to="/products?category=mens-clothing"
            className="flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#c9d0c2] p-[17px] text-[#29372b] transition-transform hover:-translate-y-1 md:min-h-[290px] md:p-6"
          >
            <span className="text-[9px] tracking-[0.15em] opacity-75">
              02 / HIS EDIT
            </span>
            <b className="font-serif text-[27px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[34px]">
              Off-duty
              <br />
              essentials.
            </b>
            <i className="flex items-center gap-2 text-[11px] font-semibold not-italic">
              Shop men <ArrowUpRight size={17} />
            </i>
          </Link>
          <Link
            to="/products"
            className="col-span-2 flex min-h-[180px] flex-col justify-between overflow-hidden bg-[#d9d7e4] p-[17px] text-[#363349] transition-transform hover:-translate-y-1 md:col-span-1 md:min-h-[290px] md:p-6"
          >
            <span className="text-[9px] tracking-[0.15em] opacity-75">
              03 / THE WHOLE THING
            </span>
            <b className="font-serif text-[27px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[34px]">
              Find your
              <br />
              next favourite.
            </b>
            <i className="flex items-center gap-2 text-[11px] font-semibold not-italic">
              Explore everything <ArrowUpRight size={17} />
            </i>
          </Link>
        </div>
      </section>

      <section className="my-[55px] md:my-[75px]">
        <div className="mb-7 flex items-start justify-between gap-[15px] md:items-end">
          <div>
            <span className="inline-flex items-center gap-[9px] text-[10px] font-bold tracking-[0.16em] text-[#77766f] dark:text-[#a7a69e]">
              HANDPICKED FOR YOU
            </span>
            <h2 className="my-3 text-[38px] font-medium leading-[1.05] tracking-[-0.05em] md:text-[clamp(35px,4vw,52px)]">
              The{" "}
              <em className="font-serif font-medium text-[#9ebd42]">
                good stuff.
              </em>
            </h2>
            <p className="m-0 text-xs text-[#77766f] dark:text-[#a7a69e]">
              Pieces you'll reach for on repeat.
            </p>
          </div>
          <Link
            className="mt-[25px] inline-flex shrink-0 items-center gap-[9px] border-b border-[#22231f] pb-[5px] text-[10px] font-semibold transition-all hover:gap-3.5 dark:border-[#f4f2ec] md:mt-0 md:text-xs"
            to="/products"
          >
            View all products <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {loading && !products.length
            ? Array.from({ length: 4 }, (_, index) => (
                <div
                  className="h-[360px] animate-pulse bg-[#e6e3dc] dark:bg-[#33352f]"
                  key={index}
                />
              ))
            : products
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                  />
                ))}
        </div>
      </section>

      <section className="my-[65px] grid grid-cols-1 bg-[#e7e9df] text-[#282b23] md:my-[100px] md:min-h-[390px] md:grid-cols-2">
        <div className="relative grid min-h-[280px] place-items-center overflow-hidden bg-[#cbd2bd] md:min-h-0">
          <span className="absolute left-[25px] top-[25px] text-[9px] tracking-[0.15em]">
            HOC / EDIT 004
          </span>
          <div className="grid h-[210px] w-[210px] rotate-[-9deg] place-content-center rounded-full border border-[#5b6852] text-center text-[28px] font-bold leading-[0.95] tracking-[-0.05em] md:h-[260px] md:w-[260px] md:text-[34px]">
            YOUR
            <br />
            STYLE
            <br />
            <em className="font-serif font-medium">YOUR</em>
            <br />
            RULES.
          </div>
        </div>
        <div className="flex flex-col items-start justify-center px-[25px] py-[35px] md:p-[60px]">
          <span className="inline-flex items-center gap-[9px] text-[10px] font-bold tracking-[0.16em] text-[#77766f]">
            A NOTE FROM OUR EDITORS
          </span>
          <h2 className="my-3 text-[48px] font-medium leading-[1.05] tracking-[-0.05em] md:text-[56px]">
            Less rules.
            <br />
            <em className="font-serif font-medium text-[#9ebd42]">More you.</em>
          </h2>
          <p className="my-[10px] mb-[25px] max-w-[360px] text-[13px] leading-[1.8] text-[#64695c]">
            We believe style isn't about fitting in. It's about finding the
            little things that feel unmistakably yours. So go ahead — mix it up,
            wear it out, make it yours.
          </p>
          <Link
            className="inline-flex items-center justify-center gap-3 rounded-sm border border-[#9ba18f] px-5 py-3.5 text-xs font-semibold transition hover:bg-[#252620] hover:text-white"
            to="/products"
          >
            Find your fit <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
