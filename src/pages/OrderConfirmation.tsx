import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  HiOutlineCheckCircle, 
  HiOutlineShoppingBag, 
  HiOutlineClipboardDocumentList,
  HiOutlineEnvelope,
  HiOutlineTruck
} from "react-icons/hi2";

const OrderConfirmation = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce-slow">
            <HiOutlineCheckCircle className="w-14 h-14 text-green-500" />
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            {t("orderConfirmation.title")}
          </h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto leading-relaxed">
            {t("orderConfirmation.subtitle")}
          </p>
        </div>

        {/* Order Info Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Email Notification */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiOutlineEnvelope className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {t("orderConfirmation.email.title")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("orderConfirmation.email.description")}
                </p>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <HiOutlineTruck className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {t("orderConfirmation.shipping.title")}
                </h3>
                <p className="text-sm text-gray-500">
                  {t("orderConfirmation.shipping.description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/shop"
            className="group flex items-center justify-center gap-3 w-full bg-black text-white py-4 px-6 rounded-xl font-medium tracking-wide hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <HiOutlineShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t("orderConfirmation.buttons.continueShopping")}
          </Link>

          <Link
            to="/order-history"
            className="group flex items-center justify-center gap-3 w-full bg-white text-gray-900 border-2 border-gray-200 py-4 px-6 rounded-xl font-medium tracking-wide hover:border-gray-900 hover:bg-gray-50 transition-all duration-300"
          >
            <HiOutlineClipboardDocumentList className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {t("orderConfirmation.buttons.viewOrders")}
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {t("orderConfirmation.trust.secure")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {t("orderConfirmation.trust.returns")}
              </span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                {t("orderConfirmation.trust.support")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;