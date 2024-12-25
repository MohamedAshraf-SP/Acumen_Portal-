import { Link } from "react-router-dom";
import notfoundImg from "/images/Not found/notFound.svg";
export default function NotFind() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center space-y-14">
        <div className="text-center mx-auto   md:max-w-96 max-w-80">
          <h2 className="font-bold text-3xl text-black py-6">
            Sorry, page not found ⚠️
          </h2>
          <p className="text-paragraphColor font-thin">
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </p>
        </div>
        <div className="md:w-[300px] w-[250px] h-[300px] overflow-hidden">
          <img src={notfoundImg} alt="not found img" loading="lazy" />
        </div>
        <Link
          to="/"
          className="px-4 py-3 bg-[#1C252E] text-white rounded-md cursor-pointer hover:bg-slate-950  transition-all duration-300 font-medium"
        >
          Back To Home
        </Link>
      </div>
    </div>
  );
}
