export default function RankingHeader() {
  const columns = ["Servers", "Member", "Text Channels", "Voice Channels"];

  return (
    <div className=" bg-slate-200 w-6/12 py-7 m-4 rounded-lg flex items-center">
      <div className="w-6/12"></div>
      <div className="w-6/12 grid grid-cols-4 mr-5">
        {columns.map((text) => (
          <h1 className="text-center" key={text}>
            {text}
          </h1>
        ))}
      </div>
    </div>
  );
}
