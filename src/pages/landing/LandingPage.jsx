import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  TrendingUp, 
  ChevronRight, 
  Menu, 
  X,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import dashboardScreenshot from '../../assets/dashboard_screenshot.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: 'Bosh sahifa', id: 'home' },
    { name: 'Biz haqimizda', id: 'about' },
    { name: 'Afzalliklar', id: 'features' },
    { name: 'Aloqa', id: 'contact' },
  ];

  const features = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "O'quvchilar nazorati",
      description: "O'quvchilar va guruhlarni oson va samarali shaklda boshqarish imkoniyati."
    },
    {
      icon: <Calendar className="w-6 h-6 text-indigo-500" />,
      title: "Dars jadvallari",
      description: "Aqlli va avtomatik dars jadvallarini tuzish orqali vaqtingizni tejang."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Moliya va Hisobotlar",
      description: "To'lovlar va xarajatlarni aniq hisob-kitob qilish va tahlil etish."
    },
    {
      icon: <BookOpen className="w-6 h-6 text-purple-500" />,
      title: "O'quv materiallari",
      description: "Darsliklar va resurslarni bir joyda xavfsiz saqlash va ulashish."
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Tezkor bildirishnomalar",
      description: "O'quvchilar va ota-onalarga SMS yoki Telegram orqali xabarlar yuborish."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      title: "Yuqori xavfsizlik",
      description: "Ma'lumotlaringiz eng zamonaviy texnologiyalar bilan himoyalangan."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-500 selection:text-white pb-0">
      
      {/* Navbar segment */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-slate-900'}`}>
                Studix
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="w-px h-6 bg-slate-200"></div>
              <button
                onClick={() => navigate('/staff/login')}
                className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-md shadow-slate-200"
              >
                Kirish
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-600 hover:text-slate-900 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-slate-100 shadow-xl py-4 flex flex-col px-4 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-left py-3 px-4 rounded-lg hover:bg-slate-50 text-slate-700 font-medium"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => navigate('/staff/login')}
              className="mt-2 w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-medium"
            >
              Tizimga kirish
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>O'quv markazlari uchun eng yaxshi yechim</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            O'quv markazingizni <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              avtomatlashtiring
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg lg:text-xl text-slate-600 mb-10 leading-relaxed">
            Studix - bu o'quv markazlari, maktablar va repetitorlar uchun 
            biznesni boshqarish, o'quvchilarni nazorat qilish va moliyaviy hisobotlarni yuritish 
            uchun zamonaviy platforma.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/staff/login')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-all shadow-xl shadow-indigo-200 hover:shadow-2xl hover:shadow-indigo-200 flex items-center justify-center gap-2"
            >
              Bepul boshlash
              <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-medium text-lg transition-all border border-slate-200 shadow-sm"
            >
              Batafsil ma'lumot
            </button>
          </div>

          {/* Hero Image Mockup (Optional UI Element) */}
          <div className="mt-20 relative mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden">
               <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
               </div>
               <div className="aspect-[16/9] bg-slate-50 relative overflow-hidden">
                  <img 
                    src={dashboardScreenshot} 
                    alt="Studix Platforma Interfeysi" 
                    className="w-full h-full object-cover object-top"
                  />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                Biz haqimizda
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Studix platformasi zamonaviy o'quv markazlarining barcha ehtiyojlarini qondirish 
                maqsadida yaratilgan muhitdir. Biz ta'lim sifatini oshirish va boshqaruv 
                jarayonlarini osonlashtirishga yordam beramiz.
              </p>
              <div className="space-y-4">
                {[
                  "Foydalanish uchun qulay va tushunarli interfeys",
                  "Ma'lumotlarning 100% xavfsizligi va maxfiyligi",
                  "24/7 texnik qo'llab-quvvatlash xizmati"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-tr from-indigo-100 to-blue-50 rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
                  <div className="relative h-full flex items-center justify-center">
                      <GraduationCap className="w-48 h-48 text-indigo-300" />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
              Platformaning afzalliklari
            </h2>
            <p className="text-lg text-slate-600">
              Barcha kerakli vositalar bir joyda jamlangan. O'quv markazingizni boshqarish hech qachon bunchalik oson bo'lmagan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-900 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <div className="grid lg:grid-cols-2 gap-0">
              <div className="p-12 lg:p-16 flex flex-col justify-center relative z-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                  Biz bilan aloqaga chiqing
                </h2>
                <p className="text-indigo-100 mb-10 text-lg">
                  Platforma haqida batafsil ma'lumot olish yoki bepul demonstratsiya uchun bizga murojaat qiling.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-indigo-50">
                    <div className="w-12 h-12 bg-indigo-800/50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-700/50">
                      <Phone className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-300 mb-1">Telefon raqam</p>
                      <p className="font-medium">+998 90 123 45 67</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-indigo-50">
                    <div className="w-12 h-12 bg-indigo-800/50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-700/50">
                      <Mail className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-300 mb-1">Elektron pochta</p>
                      <p className="font-medium">info@studix.uz</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-indigo-50">
                    <div className="w-12 h-12 bg-indigo-800/50 rounded-xl flex items-center justify-center shrink-0 border border-indigo-700/50">
                      <MapPin className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <p className="text-sm text-indigo-300 mb-1">Manzil</p>
                      <p className="font-medium">Toshkent shahar, Yunusobod tumani</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-12 lg:p-16 bg-white flex flex-col justify-center">
                 <h3 className="text-2xl font-bold text-slate-900 mb-6">Xabar yuborish</h3>
                 <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ismingiz</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-slate-50" placeholder="Ali Valiyev" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefon raqamingiz</label>
                      <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-slate-50" placeholder="+998 90 123 45 67" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Xabar</label>
                      <textarea rows="4" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow bg-slate-50 resize-none" placeholder="O'z xabaringizni yozing..."></textarea>
                    </div>
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-colors shadow-md shadow-indigo-200">
                      Yuborish
                    </button>
                 </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Studix
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Bosh sahifa</a>
            <a href="#about" className="text-slate-400 hover:text-white transition-colors">Biz haqimizda</a>
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Afzalliklar</a>
            <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Aloqa</a>
          </div>

          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Studix. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
