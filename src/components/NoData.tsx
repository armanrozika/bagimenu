import { BsFolder } from "react-icons/bs";
function NoData({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center my-20">
      <p className="text-gray-400">{text}</p>
      <BsFolder className="mt-3 text-5xl text-gray-300" />
    </div>
  );
}

export default NoData;
