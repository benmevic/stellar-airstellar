'use client';

import { useState, useEffect, useMemo } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiHome, FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiTrendingUp, FiEye, FiEyeOff, FiSettings, FiUsers, FiStar, FiMessageSquare, FiBarChart2, FiClock, FiX } from 'react-icons/fi';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Property {
  id: string;
  title: string;
  location: string;
  pricePerNight: number;
  totalBookings: number;
  totalRevenue: number;
  status: 'active' | 'inactive';
  upcomingBookings: number;
  rating: number;
  reviews: number;
  views: number;
  image: string;
  createdAt: string;
  unreadMessages: number; // ✅ Artık prop olarak geliyor
}

interface MyPropertiesProps {
  publicKey: string;
}

export default function MyProperties({ publicKey }: MyPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Chart data
  const revenueData = [
    { month: 'Oca', revenue: 450 },
    { month: 'Şub', revenue: 680 },
    { month: 'Mar', revenue: 920 },
    { month: 'Nis', revenue: 1100 },
    { month: 'May', revenue: 850 },
    { month: 'Haz', revenue: 1300 },
  ];

  const bookingsData = [
    { month: 'Oca', bookings: 3 },
    { month: 'Şub', bookings: 5 },
    { month: 'Mar', bookings: 7 },
    { month: 'Nis', bookings: 8 },
    { month: 'May', bookings: 6 },
    { month: 'Haz', bookings: 10 },
  ];

  useEffect(() => {
    loadProperties();
  }, [publicKey]);

  const loadProperties = async () => {
    try {
      setLoading(true);

      const mockProperties: Property[] = [
        {
          id: '1',
          title: 'Boğaz Manzaralı Lüks Daire',
          location: 'İstanbul, Beşiktaş',
          pricePerNight: 150,
          totalBookings: 28,
          totalRevenue: 4200,
          status: 'active',
          upcomingBookings: 3,
          rating: 4.9,
          reviews: 24,
          views: 487,
          image: '🏙️',
          createdAt: '2025-01-15',
          unreadMessages: 2, // ✅ Sabit değer
        },
        {
          id: '2',
          title: 'Deniz Kenarı Villa',
          location: 'Antalya, Kaş',
          pricePerNight: 350,
          totalBookings: 15,
          totalRevenue: 5250,
          status: 'active',
          upcomingBookings: 2,
          rating: 5.0,
          reviews: 12,
          views: 623,
          image: '🏖️',
          createdAt: '2025-02-10',
          unreadMessages: 5, // ✅ Sabit değer
        },
      ];

      setProperties(mockProperties);
    } catch (error) {
      console.error('Mülkler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyStatus = (propertyId: string) => {
    setProperties(properties.map(p => 
      p.id === propertyId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' as 'active' | 'inactive' }
        : p
    ));
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Bu mülkü silmek istediğinizden emin misiniz?')) return;

    setProperties(properties.filter(p => p.id !== propertyId));
    alert('✅ Mülk başarıyla silindi!');
  };

  const totalStats = useMemo(() => ({
    totalProperties: properties.length,
    activeProperties: properties.filter(p => p.status === 'active').length,
    totalRevenue: properties.reduce((sum, p) => sum + p.totalRevenue, 0),
    totalBookings: properties.reduce((sum, p) => sum + p.totalBookings, 0),
    avgRating: properties.length > 0 
      ? (properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1)
      : '0.0',
  }), [properties]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiHome className="w-6 h-6 text-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Mülklerim</h2>
        <p className="text-gray-400">Listelediğiniz tüm mülkler ve detaylı istatistikler</p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-pink-400 text-sm mb-1">
            <FiHome className="w-4 h-4" />
            <span>Toplam Mülk</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.totalProperties}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
            <FiEye className="w-4 h-4" />
            <span>Aktif</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.activeProperties}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-1">
            <FiCalendar className="w-4 h-4" />
            <span>Rezervasyon</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.totalBookings}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-purple-400 text-sm mb-1">
            <FiDollarSign className="w-4 h-4" />
            <span>Toplam Gelir</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalStats.totalRevenue} XLM</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
            <FiStar className="w-4 h-4" />
            <span>Ort. Puan</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalStats.avgRating}</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all hover:scale-105 flex items-center gap-2">
          <FiHome className="w-5 h-5" />
          Yeni Mülk Ekle
        </button>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">🏠</div>
          <h3 className="text-2xl font-bold text-white mb-2">Henüz mülk yok</h3>
          <p className="text-gray-400 mb-6">İlk mülkünüzü listeleyerek başlayın!</p>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:scale-105 transition-all">
            Mülk Listele
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-pink-500/20 to-orange-500/20 p-4 rounded-xl text-4xl">
                    {property.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{property.title}</h3>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <FiHome className="w-4 h-4" />
                      {property.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {property.status === 'active' ? '🟢 Aktif' : '⚫ Pasif'}
                      </span>
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-full">
                        <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs font-semibold">{property.rating}</span>
                        <span className="text-gray-400 text-xs">({property.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => togglePropertyStatus(property.id)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all" 
                    title={property.status === 'active' ? 'Pasif Yap' : 'Aktif Yap'}
                  >
                    {property.status === 'active' ? (
                      <FiEye className="w-5 h-5 text-green-400" />
                    ) : (
                      <FiEyeOff className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProperty(property);
                      setShowEditModal(true);
                    }}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all" 
                    title="Düzenle"
                  >
                    <FiEdit className="w-5 h-5 text-blue-400" />
                  </button>
                  <button 
                    onClick={() => deleteProperty(property.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all" 
                    title="Sil"
                  >
                    <FiTrash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiDollarSign className="w-3 h-3" />
                    <span>Gecelik</span>
                  </div>
                  <div className="text-lg font-bold text-white">{property.pricePerNight} XLM</div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiCalendar className="w-3 h-3" />
                    <span>Rezervasyon</span>
                  </div>
                  <div className="text-lg font-bold text-white">{property.totalBookings}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiTrendingUp className="w-3 h-3" />
                    <span>Gelir</span>
                  </div>
                  <div className="text-lg font-bold text-pink-400">{property.totalRevenue} XLM</div>
                </div>

                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <FiClock className="w-3 h-3" />
                    <span>Yaklaşan</span>
                  </div>
                  <div className="text-lg font-bold text-blue-400">{property.upcomingBookings}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowStatsModal(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2"
                >
                  <FiBarChart2 className="w-4 h-4" />
                  İstatistikler
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 border border-white/10 relative">
                  <FiMessageSquare className="w-4 h-4" />
                  Mesajlar ({property.unreadMessages})
                  {/* ✅ Artık sabit değer kullanılıyor */}
                  {property.unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {property.unreadMessages}
                    </span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-4xl w-full border border-white/10 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Detaylı İstatistikler</h3>
              <button
                onClick={() => setShowStatsModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Property Info */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-5xl">{selectedProperty.image}</div>
              <div>
                <h4 className="text-xl font-bold text-white">{selectedProperty.title}</h4>
                <p className="text-gray-400">{selectedProperty.location}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FiTrendingUp className="w-5 h-5 text-pink-400" />
                  Aylık Gelir Trendi
                </h5>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ec4899" fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h5 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-blue-400" />
                  Aylık Rezervasyon Sayısı
                </h5>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={bookingsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff20', borderRadius: '8px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="text-blue-400 text-sm mb-1">Görüntülenme</div>
                <div className="text-2xl font-bold text-white">{selectedProperty.views}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="text-green-400 text-sm mb-1">Doluluk Oranı</div>
                <div className="text-2xl font-bold text-white">78%</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl p-4">
                <div className="text-purple-400 text-sm mb-1">Ort. Konaklama</div>
                <div className="text-2xl font-bold text-white">3.2 gün</div>
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-4">
                <div className="text-pink-400 text-sm mb-1">Tekrar Eden</div>
                <div className="text-2xl font-bold text-white">12%</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}