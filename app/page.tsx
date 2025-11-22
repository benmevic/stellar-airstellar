'use client';

import { useState, useEffect } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PropertyListing from '@/components/PropertyListing';
import PropertyMarketplace from '@/components/PropertyMarketplace';
import MyBookings from '@/components/MyBookings';
import MyProperties from '@/components/MyProperties';
import { FiHome, FiCalendar, FiKey, FiMapPin, FiTrendingUp, FiShield, FiZap, FiGlobe, FiUsers, FiDollarSign, FiAward, FiStar, FiCheck } from 'react-icons/fi';

export default function AirStellarPage() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'marketplace' | 'list' | 'bookings' | 'properties'>('marketplace');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('airstellar-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    }

    // Scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Mouse move effect - ÇOOK DAHA YUMUŞAK
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ 
        x: (e.clientX / window.innerWidth) * 100, 
        y: (e.clientY / window.innerHeight) * 100 
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('airstellar-theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  // Stats data
  const stats = [
    { icon: FiHome, value: '10,000+', label: 'Mülkler', color: 'from-pink-500 to-rose-500' },
    { icon: FiUsers, value: '50,000+', label: 'Kullanıcı', color: 'from-purple-500 to-indigo-500' },
    { icon: FiDollarSign, value: '₺2M+', label: 'İşlem Hacmi', color: 'from-blue-500 to-cyan-500' },
    { icon: FiGlobe, value: '150+', label: 'Şehir', color: 'from-orange-500 to-yellow-500' },
  ];

  // Features data
  const features = [
    {
      icon: FiShield,
      title: 'Blockchain Güvenliği',
      description: 'Tüm işlemleriniz Stellar blockchain üzerinde şifrelenir ve değiştirilemez kayıtlarda saklanır.',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: FiZap,
      title: 'Anında İşlemler',
      description: 'Stellar\'ın hızı ile 3-5 saniyede rezervasyon onayı. Geleneksel bankacılık sistemlerinden 1000x daha hızlı.',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      icon: FiDollarSign,
      title: 'Düşük Komisyon',
      description: 'Merkezi platformların %15-20 komisyonu yerine sadece %2. Blockchain\'in gücüyle tasarruf edin.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: FiKey,
      title: 'Akıllı Escrow',
      description: 'Depozito ve kira ödemeleri akıllı kontratlarla güvence altında. Otomatik iade sistemi.',
      gradient: 'from-orange-500 to-yellow-600',
    },
    {
      icon: FiAward,
      title: 'NFT Sertifikalar',
      description: 'Her konaklama için blockchain üzerinde NFT sertifika. Konaklama geçmişiniz dijital varlık olarak saklanır.',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: FiGlobe,
      title: 'Global Erişim',
      description: 'Dünyanın her yerinden XLM ile ödeme yapın. Döviz çevirimi, banka transferi yok.',
      gradient: 'from-red-500 to-pink-600',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Mülk Sahibi',
      avatar: '👨‍💼',
      rating: 5,
      text: 'AirStellar sayesinde mülkümü tokenize ettim ve pasif gelir elde etmeye başladım. Blockchain güvenliği inanılmaz!',
    },
    {
      name: 'Ayşe Demir',
      role: 'Dijital Nomad',
      avatar: '👩‍💻',
      rating: 5,
      text: 'Dünyanın her yerinden XLM ile ödeme yapabiliyorum. Banka işlemleriyle uğraşmadan saniyeler içinde rezervasyon!',
    },
    {
      name: 'Mehmet Kaya',
      role: 'Yatırımcı',
      avatar: '👨‍🚀',
      rating: 5,
      text: 'Mülk tokenizasyonu muhteşem bir konsept. Portföyüme blockchain tabanlı gayrimenkul ekledim.',
    },
  ];

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    } relative overflow-hidden`}>
      {/* Animated Background Elements - YUMUŞATILMIŞ */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs - Çok daha yavaş hareket */}
        <div 
          className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
            theme === 'dark' ? 'bg-pink-500/20' : 'bg-pink-400/30'
          }`}
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        />
        <div 
          className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-400/30'
          }`}
          style={{
            top: '50%',
            right: '10%',
            transform: `translate(${mousePosition.x * -0.2}px, ${mousePosition.y * 0.2}px)`,
          }}
        />
        <div 
          className={`absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ${
            theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-400/30'
          }`}
          style={{
            bottom: '10%',
            left: '50%',
            transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * -0.15}px)`,
          }}
        />

        {/* Grid Pattern */}
        <div className={`absolute inset-0 opacity-40 ${
          theme === 'dark' 
            ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")]'
            : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")]'
        }`} />
        
        {/* Floating Particles - AZALTILDI ve YAVAŞLATILDI */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              theme === 'dark' ? 'bg-white' : 'bg-purple-500'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${15 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: theme === 'dark' ? 0.3 : 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-colors ${
        theme === 'dark' 
          ? 'border-white/10 bg-black/20' 
          : 'border-gray-200 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-pink-500 to-orange-500 p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform">
                  <FiHome className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AirStellar
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Powered by Stellar Blockchain
                </p>
              </div>
            </div>

            {/* Theme Toggle & Wallet */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl backdrop-blur-lg border transition-all group ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-pink-500/50'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-pink-400'
                }`}
                aria-label="Toggle theme"
              >
                <span className="text-2xl group-hover:scale-110 inline-block transition-transform">
                  {theme === 'dark' ? '🌞' : '🌙'}
                </span>
              </button>
              <WalletConnection onConnect={setPublicKey} />
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {/* Balance Display */}
        {publicKey && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <BalanceDisplay publicKey={publicKey} />
          </div>
        )}

        {/* Hero Section - ULTRA PREMIUM */}
        {!publicKey ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Hero */}
            <div className="text-center py-20 md:py-32 relative">
              {/* Floating Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full mb-8 backdrop-blur-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-pink-500/30'
                  : 'bg-gradient-to-r from-pink-100 to-purple-100 border-pink-300'
              }`}>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-pink-300' : 'text-pink-700'
                }`}>
                  🚀 Stellar Blockchain Üzerinde Çalışıyor
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Konaklama Devrimi
                </span>
                <br />
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Blockchain'de Başlıyor
                </span>
              </h1>

              <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Ev ve odalarınızı <span className="text-pink-500 font-semibold">tokenize</span> edin, 
                <span className="text-purple-500 font-semibold"> blockchain güvenliği</span> ile kiralayın.
                Merkezi platformlara veda edin, <span className="text-blue-500 font-semibold">geleceğe merhaba</span> deyin.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button 
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-white text-lg shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Keşfetmeye Başla
                    <FiZap className="w-5 h-5 group-hover:animate-pulse" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                </button>
                <button className={`px-8 py-4 backdrop-blur-lg border rounded-xl font-semibold text-lg transition-all flex items-center gap-2 ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-pink-500/50'
                    : 'bg-white/80 border-gray-200 text-gray-900 hover:bg-white hover:border-pink-400'
                }`}>
                  <FiHome className="w-5 h-5" />
                  Nasıl Çalışır?
                </button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-lg border rounded-2xl p-6 transition-all hover:scale-105 group ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 hover:border-pink-500/50'
                        : 'bg-white/80 border-gray-200 hover:border-pink-400'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-3 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="py-20">
              <div className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Neden <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">AirStellar?</span>
                </h2>
                <p className={`text-xl max-w-2xl mx-auto ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Blockchain teknolojisi ile konaklama sektörünü yeniden tanımlıyoruz
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group backdrop-blur-lg border rounded-2xl p-8 transition-all hover:scale-105 hover:shadow-2xl ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 hover:border-pink-500/50 hover:shadow-pink-500/20'
                        : 'bg-white/80 border-gray-200 hover:border-pink-400 hover:shadow-pink-400/20'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20">
              <div className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3 Adımda</span> Başlayın
                </h2>
                <p className={`text-xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Blockchain üzerinde konaklama bu kadar kolay
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[
                  {
                    step: '01',
                    icon: '🔗',
                    title: 'Wallet Bağlayın',
                    description: 'Freighter veya herhangi bir Stellar wallet ile bağlanın. 5 saniyede hazırsınız!',
                  },
                  {
                    step: '02',
                    icon: '🏠',
                    title: 'Mülk Listeleyin veya Keşfedin',
                    description: 'Mülkünüzü tokenize edin veya binlerce seçenek arasından seçim yapın.',
                  },
                  {
                    step: '03',
                    icon: '⚡',
                    title: 'Anında İşlem',
                    description: 'XLM ile ödeme yapın. Blockchain\'de kayıt altına alın. Hepsi 3-5 saniyede!',
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    className={`relative backdrop-blur-lg border rounded-2xl p-8 transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-gradient-to-br from-white/5 to-white/10 border-white/10 hover:border-cyan-500/50'
                        : 'bg-gradient-to-br from-white/80 to-white/60 border-gray-200 hover:border-cyan-400'
                    }`}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl">
                      {step.step}
                    </div>

                    <div className="text-6xl mb-6">{step.icon}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="py-20">
              <div className="text-center mb-16">
                <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Kullanıcılarımız <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Ne Diyor?</span>
                </h2>
                <p className={`text-xl ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Blockchain devrimi zaten başladı
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`backdrop-blur-lg border rounded-2xl p-8 transition-all hover:scale-105 ${
                      theme === 'dark'
                        ? 'bg-white/5 border-white/10 hover:border-yellow-500/50'
                        : 'bg-white/80 border-gray-200 hover:border-yellow-400'
                    }`}
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>

                    <p className={`mb-6 leading-relaxed italic ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className={`font-bold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {testimonial.name}
                        </div>
                        <div className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="py-20">
              <div className={`border rounded-3xl p-12 md:p-16 text-center backdrop-blur-lg ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-pink-500/30'
                  : 'bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 border-pink-300'
              }`}>
                <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Geleceğe Hazır mısınız?
                </h2>
                <p className={`text-xl mb-8 max-w-2xl mx-auto ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Wallet bağlayın ve blockchain üzerinde konaklama deneyimini yaşayın
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="group relative px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-bold text-white text-xl shadow-2xl hover:shadow-pink-500/50 transition-all hover:scale-105">
                    <span className="relative z-10 flex items-center gap-2">
                      <FiZap className="w-6 h-6" />
                      Şimdi Başla
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Tab Navigation - Premium */}
            <div className="mb-8">
              <div className={`backdrop-blur-lg rounded-2xl p-2 border inline-flex gap-2 flex-wrap shadow-xl ${
                theme === 'dark'
                  ? 'bg-white/5 border-white/10'
                  : 'bg-white/80 border-gray-200'
              }`}>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'marketplace'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiMapPin className="w-5 h-5" />
                  <span className="hidden sm:inline">Keşfet</span>
                </button>
                <button
                  onClick={() => setActiveTab('list')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'list'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiHome className="w-5 h-5" />
                  <span className="hidden sm:inline">Mülk Listele</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiCalendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Rezervasyonlarım</span>
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === 'properties'
                      ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <FiKey className="w-5 h-5" />
                  <span className="hidden sm:inline">Mülklerim</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'marketplace' && <PropertyMarketplace publicKey={publicKey} />}
              {activeTab === 'list' && <PropertyListing publicKey={publicKey} />}
              {activeTab === 'bookings' && <MyBookings publicKey={publicKey} />}
              {activeTab === 'properties' && <MyProperties publicKey={publicKey} />}
            </div>
          </div>
        )}
      </div>

      {/* Footer - Premium */}
      <footer className={`relative z-10 border-t backdrop-blur-xl mt-20 ${
        theme === 'dark'
          ? 'border-white/10 bg-black/20'
          : 'border-gray-200 bg-white/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-3 rounded-2xl">
                  <FiHome className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  AirStellar
                </h3>
              </div>
              <p className={`mb-4 max-w-md ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Blockchain teknolojisi ile konaklama endüstrisini merkeziyetsizleştiriyoruz.
                Stellar üzerinde güvenli, hızlı ve şeffaf kiralama deneyimi.
              </p>
              <div className="flex gap-3">
                {['🐦', '📘', '📷', '💼'].map((emoji, i) => (
                  <button
                    key={i}
                    className={`w-10 h-10 border rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                      theme === 'dark'
                        ? 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-pink-500/50'
                        : 'bg-gray-100 hover:bg-gray-200 border-gray-200 hover:border-pink-400'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className={`font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Platform
              </h4>
              <ul className="space-y-2">
                {['Mülk Listele', 'Keşfet', 'Nasıl Çalışır', 'Fiyatlandırma'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-pink-400'
                        : 'text-gray-600 hover:text-pink-600'
                    }`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className={`font-semibold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Destek
              </h4>
              <ul className="space-y-2">
                {['Yardım Merkezi', 'İletişim', 'Blog', 'SSS'].map((item) => (
                  <li key={item}>
                    <a href="#" className={`transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-pink-400'
                        : 'text-gray-600 hover:text-pink-600'
                    }`}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center ${
            theme === 'dark' ? 'border-white/10' : 'border-gray-200'
          }`}>
            <p className={`text-sm mb-4 md:mb-0 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 AirStellar. Tüm hakları saklıdır. Powered by Stellar Blockchain.
            </p>
            <div className={`flex items-center gap-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Testnet Aktif</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}