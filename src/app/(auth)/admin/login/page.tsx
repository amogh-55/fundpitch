import Adminform from "./form";

const Login = () => {
  return (
    <div className="flex w-full h-screen flex-grow">
      <div className="flex w-full flex-col justify-center px-8  md:w-1/2 md:px-8 lg:px-32">
        <div className="my-10 flex flex-col items-start text-center font-poppins">
          <p className="text-26 font-bold  text-gray-6">Hello Again!</p>
          <p className="mb-2  text-lg text-gray-6">Welcome back</p>
        </div>
        <div className="flex flex-col ">
          <Adminform />
        </div>
      </div>
      <div className="w-1/2 h-full flex bg-[#5356FF]">
      <div className="w-full flex items-center text-3xl justify-center text-center">Admin Portal</div>
      </div>
     
    </div>
  );
};

export default Login;
