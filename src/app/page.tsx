import buttonBackground from "@/assets/image/button.svg";
import background from "@/assets/image/main-menu-background.png";
import Image from "next/image";

export default function MainMenu() {
  const buttonConfig = [
    {
      id: 1,
      label: "Play",
      action: () => {},
    },
    {
      id: 2,
      label: "Settings",
      action: () => {},
    },
  ];

  return (
    <div className="relative bg-orange-600 min-h-screen z-50 flex items-center justify-center">
      <div className="w-full flex max-w-[1980px] 2xl aspect-video max-h-screen rounded-2xl overflow-hidden flex-col relative bg-orange-600 items-center justify-center py-2 -z-40">
        <Image
          className="w-full h-full object-cover absolute top-0 left-0 -z-40"
          src={background}
          alt="background"
        />
        <div className="text-center bg-orange-300 flex flex-col items-center rounded-lg px-8 py-8 bg-opacity-75">
          <h1 className="text-2xl text-orange-800 font-bold mb-4">
            Welcome to Jeton
          </h1>
          <p className="mb-8 text-orange-700">
            Best Opportunity to lose your money
          </p>
          <div className="flex flex-col gap-5 relative z-20">
            {buttonConfig.map((btn) => (
              <button
                key={btn.id}
                style={{ backgroundImage: buttonBackground }}
                className="relative w-72 h-14 p-4 flex justify-center items-center hover:brightness-110 shadow-2xl active:brightness-75 rounded-lg duration-150 overflow-hidden"
              >
                <Image
                  src={buttonBackground}
                  alt="Button Background"
                  layout="fill"
                  objectFit="cover"
                  className="w-full absolute left-0 top-0 -z-10"
                />
                <span className="">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
