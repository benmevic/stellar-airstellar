'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiCalendar, FiMapPin, FiCheck, FiClock, FiXCircle, FiDollarSign, FiMessageSquare, FiDownload, FiStar, FiPhone, FiMail, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';
import { format, differenceInDays, isPast, isFuture, isToday } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Booking {
  id: string;
  propertyTitle: string;
  propertyImage: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  deposit: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  txHash: string;
  hostName: string;
  hostAvatar: string;
  hostContact: string;
  rating?: number;
  review?: string;
  amenities: string[];
}

interface MyBookingsProps {
  publicKey: string;
}

export default function MyBookings({ publicKey }: MyBookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'active' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');

  useEffect(() => {
    loadBookings();
  }, [publicKey]);

  const loadBookings = async () => {
  try {
    setLoading(true);

    // ✅ ÖNCE LOCALSTORAGE'DAN KAYITLI REZERVASYONLARI AL
    const savedBookings = localStorage.getItem('airstellar-bookings');
    
    if (savedBookings) {
      const bookingsData = JSON.parse(savedBookings);
      
      // Tarihe göre status güncelle
      const updatedBookings = bookingsData.map((booking: any) => {
        const now = new Date();
        const checkInDate = new Date(booking.checkIn);
        const checkOutDate = new Date(booking.checkOut);
        
        let status = booking.status;
        
        // Status'u otomatik güncelle
        if (booking.status !== 'cancelled') {
          if (now < checkInDate) {
            status = 'upcoming';
          } else if (now >= checkInDate && now <= checkOutDate) {
            status = 'active';
          } else if (now > checkOutDate) {
            status = 'completed';
          }
        }
        
        return {
          ...booking,
          status,
          hostName: 'Mülk Sahibi',
          hostAvatar: '👨‍💼',
          hostContact: '+90 555 123 4567',
        };
      });
      
      // LocalStorage'ı güncelle (status değişiklikleri için)
      localStorage.setItem('airstellar-bookings', JSON.stringify(updatedBookings));
      
      setBookings(updatedBookings);
    } else {
      // Hiç rezervasyon yoksa boş liste
      setBookings([]);
    }

  } catch (error) {
    console.error('Rezervasyonlar yüklenemedi:', error);
    setBookings([]);
  } finally {
    setLoading(false);
  }
};

  // ... (geri kalan fonksiyonlar aynı kalacak)
  
  const getStatusBadge = (status: Booking['status']) => {
    const styles = {
      upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      completed: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const icons = {
      upcoming: <FiClock className="w-4 h-4" />,
      active: <FiCheck className="w-4 h-4" />,
      completed: <FiCheck className="w-4 h-4" />,
      cancelled: <FiXCircle className="w-4 h-4" />,
    };

    const labels = {
      upcoming: 'Yaklaşan',
      active: 'Aktif',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi',
    };

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const getDaysUntil = (date: string) => {
    return differenceInDays(new Date(date), new Date());
  };

  const handleCancelBooking = async (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
  if (!selectedBooking) return;

  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // ✅ LOCALSTORAGE'I GÜNCELLE
    const savedBookings = localStorage.getItem('airstellar-bookings');
    if (savedBookings) {
      const bookingsData = JSON.parse(savedBookings);
      const updatedBookings = bookingsData.map((b: any) => 
        b.id === selectedBooking.id 
          ? { ...b, status: 'cancelled' }
          : b
      );
      localStorage.setItem('airstellar-bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    }

    alert('✅ Rezervasyon iptal edildi. Depozito iade edilecektir.');
    setShowCancelModal(false);
  } catch (error) {
    alert('❌ İptal işlemi başarısız oldu.');
  }
};

  const handleReview = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
    setRating(0);
    setReview('');
  };

  const submitReview = async () => {
  if (!selectedBooking || rating === 0) return;

  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // ✅ LOCALSTORAGE'I GÜNCELLE
    const savedBookings = localStorage.getItem('airstellar-bookings');
    if (savedBookings) {
      const bookingsData = JSON.parse(savedBookings);
      const updatedBookings = bookingsData.map((b: any) => 
        b.id === selectedBooking.id 
          ? { ...b, rating, review }
          : b
      );
      localStorage.setItem('airstellar-bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
    }

    alert('🎉 Değerlendirmeniz kaydedildi! Teşekkürler.');
    setShowReviewModal(false);
  } catch (error) {
    alert('❌ Değerlendirme gönderilemedi.');
  }
};

  const downloadReceipt = (booking: Booking) => {
    const receiptText = `
AirStellar Rezervasyon Faturası
================================
Rezervasyon ID: ${booking.id}
Mülk: ${booking.propertyTitle}
Konum: ${booking.location}
Giriş: ${format(new Date(booking.checkIn), 'dd MMMM yyyy', { locale: tr })}
Çıkış: ${format(new Date(booking.checkOut), 'dd MMMM yyyy', { locale: tr })}
Konuk Sayısı: ${booking.guests}
Toplam Tutar: ${booking.totalAmount} XLM
Depozito: ${booking.deposit} XLM
Durum: ${booking.status}
İşlem Hash: ${booking.txHash}
================================
Stellar Blockchain üzerinde doğrulanmıştır.
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airstellar-receipt-${booking.id}.txt`;
    a.click();
  };

  const filteredBookings = bookings
    .filter(booking => {
      const matchesFilter = filter === 'all' || booking.status === filter;
      const matchesSearch = 
        booking.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime();
      } else {
        return b.totalAmount - a.totalAmount;
      }
    });

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalSpent: bookings.reduce((sum, b) => sum + b.totalAmount, 0),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiCalendar className="w-6 h-6 text-pink-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">Rezervasyonlarım</h2>
          <button
            onClick={loadBookings}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl transition-all text-sm font-medium"
          >
            🔄 Yenile
          </button>
        </div>
        <p className="text-gray-400 mb-6">Tüm konaklama rezervasyonlarınız ve detayları</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-lg">
            <div className="text-blue-400 text-sm mb-1">Toplam</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-lg">
            <div className="text-purple-400 text-sm mb-1">Yaklaşan</div>
            <div className="text-3xl font-bold text-white">{stats.upcoming}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-4 backdrop-blur-lg">
            <div className="text-green-400 text-sm mb-1">Aktif</div>
            <div className="text-3xl font-bold text-white">{stats.active}</div>
          </div>
          <div className="bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/30 rounded-xl p-4 backdrop-blur-lg">
            <div className="text-gray-400 text-sm mb-1">Tamamlanan</div>
            <div className="text-3xl font-bold text-white">{stats.completed}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/30 rounded-xl p-4 backdrop-blur-lg">
            <div className="text-pink-400 text-sm mb-1">Toplam Harcama</div>
            <div className="text-2xl font-bold text-white">{stats.totalSpent.toFixed(0)} XLM</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mülk veya konum ara..."
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-lg"
          />
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 backdrop-blur-lg"
        >
          <option value="date">Tarihe Göre</option>
          <option value="price">Fiyata Göre</option>
        </select>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[
          { value: 'all', label: 'Tümü', count: stats.total },
          { value: 'upcoming', label: 'Yaklaşan', count: stats.upcoming },
          { value: 'active', label: 'Aktif', count: stats.active },
          { value: 'completed', label: 'Tamamlanan', count: stats.completed },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              filter === tab.value ? 'bg-white/20' : 'bg-white/10'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-2xl font-bold text-white mb-2">Rezervasyon yok</h3>
          <p className="text-gray-400 mb-6">
            {filter === 'all'
              ? 'Henüz rezervasyonunuz bulunmuyor. Bir mülk kiralayarak başlayın!'
              : `${
                  filter === 'upcoming'
                    ? 'Yaklaşan'
                    : filter === 'active'
                    ? 'Aktif'
                    : 'Tamamlanan'
                } rezervasyon yok`}
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:scale-105 transition-all">
            Mülk Keşfet
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-pink-500/50 transition-all hover:shadow-xl hover:shadow-pink-500/10"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Property Image & Basic Info */}
                <div className="flex gap-4 flex-1">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                    {booking.propertyImage}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {booking.propertyTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <FiMapPin className="w-4 h-4" />
                          {booking.location}
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-500 text-xs mb-1">Giriş</div>
                        <div className="text-white font-medium text-sm flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-pink-400" />
                          {format(new Date(booking.checkIn), 'dd MMM', { locale: tr })}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-500 text-xs mb-1">Çıkış</div>
                        <div className="text-white font-medium text-sm flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-pink-400" />
                          {format(new Date(booking.checkOut), 'dd MMM', { locale: tr })}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-500 text-xs mb-1">Konuk</div>
                        <div className="text-white font-medium text-sm">{booking.guests} kişi</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="text-gray-500 text-xs mb-1">Toplam</div>
                        <div className="text-pink-400 font-bold text-sm">{booking.totalAmount.toFixed(2)} XLM</div>
                      </div>
                    </div>

                    {/* Host Info */}
                    <div className="mt-4 flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl">
                        {booking.hostAvatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{booking.hostName}</div>
                        <div className="text-gray-400 text-xs">Ev Sahibi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2 lg:w-48">
                  <a
                    href={stellar.getExplorerLink(booking.txHash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 lg:flex-none px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FiTrendingUp className="w-4 h-4" />
                    Explorer
                  </a>

                  <button
                    onClick={() => downloadReceipt(booking)}
                    className="flex-1 lg:flex-none px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <FiDownload className="w-4 h-4" />
                    Fatura
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals kısmı aynı kalacak - çok uzun olduğu için省略 */}
    </div>
  );
}