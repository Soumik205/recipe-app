import React from "react";
import SignUpForm from "@/components/Signup/SignupForm";

const Signup = async () => {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="container mx-auto">
        <SignUpForm />
      </div>
    </div>
  );
};

export default Signup;
