import "./index.css";

const FailureView = () => (
  <div className="flex flex-col justify-center items-center bg-[#ffffff] w-[85%] rounded-[13px] p-[13px] ml-[3%] mt-[3%]">
    <h1 className="font-[Arial, Helvetica, sans-serif] text-[25px] leading-[33.38px] text-[#343c6a] p-[3px] m-[3px] font-[600]">
      Your Request cannot be processed right now.
    </h1>
    <p className="font-[Arial, Helvetica, sans-serif] text-[15px] leading-[33.38px] text-[#718ebf] p-[3px] m-[5px] mt-[0px] font-[400]">
      Please refresh the page or try again later...
    </p>
  </div>
);

export default FailureView;
