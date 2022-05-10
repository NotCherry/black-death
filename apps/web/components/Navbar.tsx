import Image from "next/image";
import Link from "next/link";
import Logo from "../public/static/black-death.png";

export default function Navbar() {
  const pages = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Ranking",
      path: "/ranking",
    },
    {
      name: "Twitter",
      path: "https://twitter.com/BlackDeathNuke",
    },
    {
      name: "About",
      path: "https://github.com/NotCherry/black-death",
    },
  ];
  return (
    <div className="flex justify-center w-full">
      <div className="w-[50vw] bg-slate-300 p-6 m-3 rounded-lg shadow-lg flex justify-between">
        <div className="flex">
          <Link href="/" passHref>
            <Image src={Logo} alt="logo" />
          </Link>
        </div>
        <div className="flex justify-end items-center">
          {pages.map((p) => (
            <Link href={p.path} key={p.name} passHref>
              <h3 className="mx-4">{p.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
