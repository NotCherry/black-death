import Image from "next/image";
import { ReactChild } from "react";

interface RowProps {
  children: ReactChild;
  key: number;
}

function RowElement({ children, key }: RowProps) {
  return (
    <h2 className="text-3xl text-center" key={`column:${key}`}>
      {children}
    </h2>
  );
}

interface Props {
  killer: any;
  i: number;
}

export default function RankingRow({ killer, i }: Props) {
  return (
    <div
      className=" bg-slate-200 w-6/12 py-7 m-4 rounded-lg flex items-center"
      key={"row" + i}
    >
      <div className="flex items-center  w-6/12">
        <h1 className="text-3xl font-bold mx-4">{"#" + i}</h1>
        {
          <Image
            src={
              killer.avatar ||
              "https://i.pinimg.com/originals/f5/ec/14/f5ec1493f8cf15a2f2d017ac9afe628d.jpg"
            }
            width={50}
            height={50}
            className="rounded-full"
            alt=""
          />
        }
        <h1 className="text-3xl ml-4">{killer.username}</h1>
      </div>
      <div className="w-6/12 grid grid-cols-4 mr-5">
        <RowElement key={i}>{killer.killedServersCount}</RowElement>
        <RowElement key={i}>{killer.removedMembers}</RowElement>
        <RowElement key={i}>{killer.removedTextChannels}</RowElement>
        <RowElement key={i}>{killer.removedVoiceChannels}</RowElement>
      </div>
    </div>
  );
}
