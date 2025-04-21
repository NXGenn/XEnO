import { EyeIcon, LockIcon, MailIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useAuthStore } from "../../store/authStore";

export const Signup = (): JSX.Element => {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white flex flex-col md:flex-row justify-center w-full min-h-screen">
      <div className="w-full relative bg-web3-bg">
        {/* Logo */}
        <div className="p-8 md:p-[30px] font-['Poppins',Helvetica] font-semibold text-web3-red text-xl">
          Your Logo
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center px-4 md:px-0">
          {/* Signup form section */}
          <Card className="w-full max-w-[433px] md:ml-[122px] bg-transparent border-none shadow-none mb-8 md:mb-0">
            <CardContent className="p-4 md:p-0">
              <form onSubmit={handleSignup} className="w-full">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="font-['Poppins',Helvetica] font-medium text-white text-3xl mb-6">
                    Sign up
                  </h1>
                  <div>
                    <p className="font-['Poppins',Helvetica] font-normal text-white text-base">
                      Already have an account?
                    </p>
                    <p className="font-['Poppins',Helvetica] font-normal text-base mt-2">
                      <span className="text-white">You can </span>
                      <Link to="/login" className="font-semibold text-web3-red hover:text-web3-red_hover">
                        Login here!
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
                    <label className="font-['Poppins',Helvetica] font-medium text-[#999999] text-[13px] block">
                      Password
                    </label>
                    <div className="relative mt-2">
                      <LockIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-web3-red" />
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 border-b border-web3-red rounded-none pl-[29px] bg-transparent text-web3-red font-['Poppins',Helvetica] text-base focus-visible:ring-0 h-8"
                        placeholder="Enter your Password"
                      />
                      <EyeIcon className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-web3-red cursor-pointer" />
                    </div>
                  </div>

                  {/* Signup button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[53px] bg-web3-red rounded-[32px] shadow-[0px_4px_26px_#00000040] font-['Poppins',Helvetica] font-medium text-white text-[17px] hover: bg-web3-red_hover]"
                  >
                    {loading ? "Loading..." : "Sign up"}
                  </Button>
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
                  Create your account
                </h2>
                <p className="font-['Poppins',Helvetica] font-light text-white text-xl mt-4">
                  Join our community today
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};