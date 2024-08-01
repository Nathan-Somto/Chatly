import { Logo } from "@/assets";
export default function LogoLoader({children}:{children?: React.ReactNode}) {
  return (
    <div className="h-screen w-full fixed bg-background flex items-center justify-center inset-0 transition-all delay-150 z-[999999999999999999]">
      <div>
        <figure>
          <img
            src={Logo}
            alt="chatly logo"
            className="h-32 w-32 scale-110 mx-auto object-contain zoom-in-out"
          />
        </figure>
        {children}
      </div>
    </div>
  );
}
