import { EyeIcon, LockIcon, MailIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { useAuthStore } from "../../store/authStore";

export const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const socialLogins = [
    { name: "Facebook", src: "/facebook.svg", alt: "Facebook" },
    { name: "Apple", src: "/apple.svg", alt: "Apple" },
    { name: "Google", src: "/google.svg", alt: "Google" },
  ];

  return (
    <div className="bg-white flex flex-col md:flex-row justify-center w-full min-h-screen">
      <div className="w-full relative bg-web3-bg">
        {/* Logo */}
        <div className="p-8 md:p-[30px] font-['Poppins',Helvetica] font-semibold text-web3-red text-xl">
          Your Logo
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-0">
          {/* Login form section */}
          <Card className="w-full max-w-[433px] md:ml-[122px] bg-transparent border-none shadow-none mb-8 md:mb-0">
            <CardContent className="p-4 md:p-0">
              <form onSubmit={handleLogin} className="w-full">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="font-['Poppins',Helvetica] font-medium text-white text-3xl mb-6">
                    Sign in
                  </h1>
                  <div>
                    <p className="font-['Poppins',Helvetica] font-normal text-white text-base">
                      If you don't have an account register
                    </p>
                    <p className="font-['Poppins',Helvetica] font-normal text-base mt-2">
                      <span className="text-white">You can </span>
                      <Link to="/signup" className="font-semibold text-web3-red hover:text-web3-red_hover">
                        Register here!
                      </Link>
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 mb-4 text-sm">{error}</div>
                )}

                {/* Form fields */}
                <div className="space-y-6">
                  {/* Email field */}
                  <div>
                    <label className="font-['Poppins',Helvetica] font-medium text-[#999999] text-[13px] block">
                      Email
                    </label>
                    <div className="relative mt-2">
                      <MailIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-white rotate-180" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 border-b border-[#f8fff8] rounded-none pl-[27px] bg-transparent text-[#f8fff8] font-['Poppins',Helvetica] text-base focus-visible:ring-0 h-8"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="font-['Poppins',Helvetica] font-medium text-web3-red text-[13px] block">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-web3-red" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className=" border-0 border-b border-web3-red rounded-none pl-[29px] bg-transparent text-web3-red_hover font-['Poppins',Helvetica] text-base focus-visible:ring-0 h-8"
                        placeholder="Enter your Password"
                      />
                      <EyeIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-web3-red cursor-pointer" />
                    </div>
                  </div>

                  {/* Remember me and Forgot Password */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Checkbox
                        id="remember"
                        className="w-[15px] h-[15px] border-white rounded-none"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-[10px] font-['Poppins',Helvetica] font-light text-white text-xs cursor-pointer"
                      >
                        Remember me
                      </label>
                    </div>
                    <div className="font-['Poppins',Helvetica] font-light text-[#fff5f5] text-xs cursor-pointer">
                      Forgot Password?
                    </div>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[53px] bg-web3-red rounded-[32px] shadow-[0px_4px_26px_#00000040] font-['Poppins',Helvetica] font-medium text-white text-[17px] hover:bg-web3-red_hover"
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>
                </div>

                {/* Or continue with */}
                <div className="text-center mt-8 font-['Poppins',Helvetica] font-medium text-[#b4b4b4] text-base">
                  or continue with
                </div>

                {/* Social login options */}
                <div className="flex justify-center gap-[21px] mt-4">
                  {socialLogins.map((social, index) => (
                    <img
                      key={index}
                      className="w-[41px] h-[41px] cursor-pointer"
                      alt={social.alt}
                      src={social.src}
                    />
                  ))}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Right side content */}
          <div className="hidden md:block w-full max-w-[735px] p-8">
            <div className="relative">
              <div className="w-[521px] h-[521px] mx-auto bg-[url(/saly-10.png)] bg-cover bg-[50%_50%]" />
              <div className="text-center mt-8">
                <h2 className="font-['Poppins',Helvetica] font-semibold text-white text-[40px]">
                  Sign in to name
                </h2>
                <p className="font-['Poppins',Helvetica] font-light text-white text-xl mt-4">
                  Lorem Ipsum is simply
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};