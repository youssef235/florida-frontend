import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaLinkedinIn,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa6";

const SocialMediaFooter = () => {
  return (
<div className="w-full mt-10 sm:mt-1 px-4">
      <div
        className="
          max-w-screen-xl mx-auto
          rounded-3xl
          bg-white/80
          backdrop-blur-xl
          border border-slate-200
          shadow-[0_20px_60px_rgba(15,23,42,0.08)]
          py-10
          flex flex-col items-center gap-6
        "
      >

        {/* Title */}
        <p className="text-sm sm:text-base text-slate-500 font-medium tracking-wide uppercase">
          Follow us
        </p>

        {/* Icons */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">

          {[
            FaFacebookF,
            FaInstagram,
            FaTiktok,
            FaLinkedinIn,
            FaPinterestP,
            FaYoutube,
          ].map((Icon, i) => (
            <div
              key={i}
              className="
                w-11 h-11
                sm:w-12 sm:h-12
                rounded-full
                bg-slate-900
                text-white
                flex items-center justify-center
                cursor-pointer
                transition-all duration-300
                hover:scale-110
                hover:bg-black
                shadow-md
              "
            >
              <Icon size={16} />
            </div>
          ))}

        </div>

        {/* Bottom text */}
        <p className="text-xs text-slate-400 text-center">
          Stay connected with our latest updates & drops
        </p>

      </div>

    </div>
  );
};

export default SocialMediaFooter;