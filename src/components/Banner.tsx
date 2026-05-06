import { Link } from "react-router-dom";

const Banner = () => {
  // ملاحظة: قم باستبدال الروابط أدناه بروابط الصور الحقيقية لديك
  const desktopImageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070";
  const mobileImageUrl = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000";

  return (
    <div
      className="w-full flex flex-col justify-end items-center 
                 h-[100vh] max-sm:h-[550px] 
                 gap-4 max-sm:gap-2
                 
                 /* 1. تنسيقات الخلفية الأساسية */
                 bg-cover bg-center bg-no-repeat
                 
                 /* 2. تأثير تعتيم (Overlay) لتوضيح النص (اختياري ولكنه مهم جداً للموبايل) */
                 relative before:content-[''] before:absolute before:inset-0 before:bg-black/40
                 
                 /* 3. التعامل مع الصور (Desktop vs Mobile) */
                 /* ملاحظة: استخدم الـ Inline style أدناه بدلاً من كتابة الرابط هنا */
                 "
      style={{
        // سنستخدم خاصية التحقق من حجم الشاشة عبر جافاسكريبت لتعيين الصورة (اختياري ولكن أحي مستحسن)
        // أو الأفضل، استخدام خاصية Tailwind لتبديل الصورة وهي ما سنطبقه في ال className
        backgroundImage: `url(${desktopImageUrl})`, // القيمة الافتراضية للديسكتاب
      }}
    >
      {/* سأقوم بتعديل طريقة وضع الخلفية لجعلها تعمل بالتبديل بين الموبايل والديسكتاب عبر Tailwind */}
      <style>
        {`
          @media (max-width: 640px) {
            .dynamic-banner-bg {
              background-image: url('${mobileImageUrl}') !important;
            }
          }
          @media (min-width: 641px) {
            .dynamic-banner-bg {
              background-image: url('${desktopImageUrl}') !important;
            }
          }
        `}
      </style>

      {/* المحتوى الآن داخل relative z-10 ليكون فوق التعتيم */}
      <div className="dynamic-banner-bg absolute inset-0 bg-cover bg-center bg-no-repeat"></div>
      <div className="absolute inset-0 bg-black/30"></div> {/* طبقة تعتيم خفيفة */}
      
      <div className="relative z-10 flex flex-col items-center pb-12 max-sm:pb-8 px-4 w-full">
        <h2 className="text-white text-center text-6xl font-bold tracking-[1.86px] leading-[70px] max-lg:text-5xl max-sm:text-4xl max-[400px]:text-3xl max-sm:leading-[1.2]">
          Discover the Best <br />
          Fashion Collection
        </h2>
        <h3 className="text-white text-3xl font-normal leading-[72px] tracking-[0.9px] max-sm:text-xl max-sm:leading-normal mt-2 mb-6 max-[400px]:text-lg">
          The High-Quality Collection
        </h3>
        
        <div className="flex justify-center items-center gap-4 max-[400px]:flex-col max-[400px]:gap-3 w-[420px] max-sm:w-full max-sm:max-w-[350px]">
          <Link to="/shop" className="bg-white text-black text-center text-xl border border-[rgba(0,0,0,0.4)] font-semibold tracking-[0.6px] w-full h-14 max-sm:h-12 flex items-center justify-center rounded-sm hover:bg-gray-100 transition-all">
            Shop Now
          </Link>
          <Link to="/shop" className="text-white border-white border-2 text-center text-xl font-semibold tracking-[0.6px] w-full h-14 max-sm:h-12 flex items-center justify-center rounded-sm hover:bg-white/10 transition-all">
            See Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;