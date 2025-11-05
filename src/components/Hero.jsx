import React from 'react'
import { MapPin, HeartPulse, Camera, FileText } from 'lucide-react'

/**
 * Hero section component for the blog homepage
 * Features a beautiful layout with personal photos and intro text
 */
const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">


              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                مرحباً بك <br />
                
                <span className="text-primary-600 dark:text-primary-400 ">أنا د. محمد شمس.</span>
              </h1>

              <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                <p className="text-xl font-medium">
                  طبيب مصري أعيش وأعمل في المملكة العربية السعودية، لكن رحلتي أكبر من غرفة الكشف أو سماعة الطبيب.
                </p>

                <p>
                  هنا على هذا الموقع أكتب عن الطب كما أراه: علمٌ نابض بالحياة، وإنسانية لا تُفارق المريض ولا الطبيب.
                  أشاركك قصصي من العيادات، خواطري من المناوبات الطويلة، وتجربتي في السعي وراء المعرفة — من التحضير للـUSMLE إلى التأمل في معنى الشفاء نفسه.
                </p>

                <p className="font-medium text-primary-700 dark:text-primary-300">
                  من قلب التجربة، إلى عُمق الفكرة.
                </p>



                <p className="text-xl font-semibold text-gray-800 dark:text-gray-100 pt-2">
                  أهلاً بك في عالمي، حيث تلتقي القصة بالعلم، والطبّ بالشغف، والعقل بالقلب. <span className="text-red-500">❤️</span>
                </p>
              </div>
            </div>




          </div>

          {/* Images Grid */}
          <div className="relative">
            {/* Main large image */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-dark-700">
                <img
                  src="/pictures/mohamed-profile.jpg"
                  alt="Mohamed - Main Profile"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>


            </div>

            {/* Decorative elements with animation */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute top-1/4 -right-8 w-8 h-8 bg-secondary-200 dark:bg-secondary-800/50 rounded-full blur-sm animate-bounce"></div>
            <div className="absolute bottom-1/4 -left-6 w-6 h-6 bg-primary-200 dark:bg-primary-800/50 rounded-full blur-sm animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-8 lg:h-12 text-gray-50 dark:text-dark-900" fill="currentColor" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  )
}

export default Hero
