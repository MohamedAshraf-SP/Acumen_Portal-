import { Link } from "react-router-dom";
import notfoundImg from "/images/Not found/error-401.png";
import { useAuth } from "../../Contexts/AuthContext";
 
export default function Unauthorized() {
  const { user } = useAuth();
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col justify-center items-center space-y-10">
        <div className="text-center mx-auto   md:max-w-96 max-w-80">
          <h1 className="text-4xl font-bold text-slate-700">Opps!!!</h1>
          <h2 className="font-bold text-3xl  text-slate-500  py-4">
            You are not authorized to be here⚠️
          </h2>
        </div>
        <div className="md:w-[300px] w-[250px] h-[300px] overflow-hidden">
          <img src={notfoundImg} alt="not found img" loading="lazy" />
        </div>
        <Link
          to={`${user?.role}/dashboard`}
          className="px-4 py-3 bg-[#1C252E] text-white rounded-md cursor-pointer hover:bg-slate-950  transition-all duration-300 font-medium"
        >
          Take me back
        </Link>
      </div>
    </div>
  );
}
