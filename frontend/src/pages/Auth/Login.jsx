import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useLoginMutation } from "../../redux/api/usersApislice";

import Loader from "../../components/Loader.jsx";
import { HiOutlineMail } from "react-icons/hi";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiHide, BiShowAlt } from "react-icons/bi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisiblePass, setIsVisiblePass] = useState(false);

  // Define a login mutation function and check if it's loading
  const [login, { isLoading, error, data }] = useLoginMutation();
  // console.log(isLoading, error, data);
  // Get user information from the application state
  const { userInfo } = useSelector((state) => state.auth);

  // Access the dispatch function to modify the application state
  const dispatch = useDispatch();

  // Get a function to navigate to different pages
  const navigate = useNavigate();

  // Get the current URL location and extract the 'redirect' parameter
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  // Use an effect to navigate to the 'redirect' page when userInfo is available
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      console.log(res);
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success("User Successfully LoggedIn");
    } catch (err) {
      if (err instanceof Error) {
        // Handle errors here
        toast.error(err.message);
      } else {
        toast.error("An error occurred during login.");
      }
    }
  };

  return (
    <div className="">
      <section className="px-4 flex justify-around items-center flex-wrap gap-8 h-[100vh] w-full text-gray-500 overflow-hidden">
        {/* bg-[#2F3349] */}

        {/* <div id="pattern" className="h-[80vh] w-[30%]"></div> */}
        <div className="text-[#eaeaeab9]">
          <h1 className="text-3xl font-semibold mb-4 text-[#F6F6F6]">Log In</h1>
          <h1 className="text-2xl font-medium mb-2">
            Welcome to LuxeHaven! 👋🏻
          </h1>
          <p className="text-lg font-medium mb-4">
            Please sign-in to your account and start the adventure
          </p>

          <form onSubmit={submitHandler} className="container w-[33rem]">
            <div className="">
              <label
                htmlFor="email"
                className="flex items-center gap-3 text-lg font-medium mb-2 "
              >
                <HiOutlineMail size={26} className="text-[#08D9D6]" />
                <span>Email</span>
              </label>

              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-[480px] mb-4 bg-[#0F0F10] placeholder-[#eaeaeab9]  text-[#F6F6F6] outline-none border-[#57575b] focus:border-[#FF2E63]"
                placeholder="jhon.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="password"
                className="flex items-center gap-3 text-lg font-medium mb-2 "
              >
                <RiLockPasswordLine size={26} className="text-[#08D9D6]" />
                Password
              </label>
              <div className="relative">
                <input
                  type={isVisiblePass ? "text" : "password"}
                  id="password"
                  className="mt-1 p-2 border rounded w-[480px] mb-4 bg-[#0F0F10] placeholder-[#eaeaeab9] text-[#F6F6F6] outline-none border-[#57575b] focus:border-[#FF2E63]"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="absolute top-[15px] left-[28rem] cursor-pointer"
                  onClick={() => setIsVisiblePass(!isVisiblePass)}
                >
                  {isVisiblePass ? (
                    <BiShowAlt size={20} />
                  ) : (
                    <BiHide size={20} />
                  )}
                </span>
              </div>
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="bg-[#db1143f3] hover:bg-[#FF2E63] transition-colors text-white border-none outline-none w-[480px] px-4 py-2 rounded cursor-pointer my-[1rem] text-base font-semibold"
            >
              {isLoading ? "Signing In..." : "Login"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-4">
            <p className="text-lg">
              New Customer?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
                className="text-[#7367F0] hover:underline shadow-2xl shadow-white"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Login;
