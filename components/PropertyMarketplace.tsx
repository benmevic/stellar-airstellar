'use client';

import { useState, useEffect, useMemo } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiMapPin, FiUsers, FiStar, FiCalendar, FiDollarSign, FiSearch, FiFilter, FiHeart, FiShare2, FiMaximize2, FiTrendingUp, FiZap, FiCheck, FiX } from 'react-icons/fi';
import QRCode from 'qrcode';

interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  pricePerNight: number;
  maxGuests: number;
  propertyType: string;
  amenities: string[];
  owner: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  verified: boolean;
  instantBook: boolean;
}

interface PropertyMarketplaceProps {
  publicKey: string;
}

export default function PropertyMarketplace({ publicKey }: PropertyMarketplaceProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'popular'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadProperties();
    loadFavorites();
  }, []);

  // loadProperties fonksiyonunu bul ve güncelle (yaklaşık 60. satır civarı)

const loadProperties = async () => {
  try {
    setLoading(true);
    
    // ✅ SENİN GERÇEK ADRESİNLE MOCK DATA
    const mockProperties: Property[] = [
      {
        id: '1',
        title: 'Boğaz Manzaralı Lüks Daire',
        description: 'Muhteşem Boğaz manzaralı, modern ve konforlu 2+1 daire. Balkonda kahve keyfi yapabileceğiniz, güneşin doğuşunu izleyebileceğiniz eşsiz bir mekan.',
        location: 'İstanbul, Beşiktaş',
        pricePerNight: 150,
        maxGuests: 4,
        propertyType: 'apartment',
        amenities: ['wifi', 'parking', 'kitchen', 'ac', 'tv', 'washer'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 4.9,
        reviews: 127,
        image: '🏙️',
        category: 'luxury',
        verified: true,
        instantBook: true,
      },
      {
        id: '2',
        title: 'Deniz Kenarı Villa',
        description: 'Özel plajlı, havuzlu lüks villa. Tatil için ideal. Infinity pool, jakuzi ve barbekü alanı mevcut.',
        location: 'Antalya, Kaş',
        pricePerNight: 350,
        maxGuests: 8,
        propertyType: 'villa',
        amenities: ['wifi', 'parking', 'kitchen', 'ac', 'tv', 'washer'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 5.0,
        reviews: 89,
        image: '🏖️',
        category: 'beachfront',
        verified: true,
        instantBook: true,
      },
      {
        id: '3',
        title: 'Merkezi Konum Stüdyo',
        description: 'Şehir merkezinde, her yere yürüme mesafesinde stüdyo. Modern tasarım, yüksek hızlı internet.',
        location: 'İzmir, Alsancak',
        pricePerNight: 75,
        maxGuests: 2,
        propertyType: 'studio',
        amenities: ['wifi', 'kitchen', 'ac'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 4.7,
        reviews: 243,
        image: '🏢',
        category: 'urban',
        verified: true,
        instantBook: false,
      },
      {
        id: '4',
        title: 'Dağ Evi',
        description: 'Doğayla iç içe, huzurlu dağ evi. Hafta sonu kaçamağı için mükemmel. Şömine, geniş teras.',
        location: 'Bursa, Uludağ',
        pricePerNight: 200,
        maxGuests: 6,
        propertyType: 'house',
        amenities: ['wifi', 'parking', 'kitchen', 'washer'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 4.8,
        reviews: 56,
        image: '⛰️',
        category: 'nature',
        verified: true,
        instantBook: true,
      },
      {
        id: '5',
        title: 'Tarihi Taş Ev',
        description: 'Restore edilmiş otantik taş ev, eşsiz deneyim. Kapadokya\'nın büyüsünü yaşayın.',
        location: 'Kapadokya, Ürgüp',
        pricePerNight: 180,
        maxGuests: 4,
        propertyType: 'house',
        amenities: ['wifi', 'parking', 'kitchen', 'ac'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 4.95,
        reviews: 178,
        image: '🏰',
        category: 'unique',
        verified: true,
        instantBook: false,
      },
      {
        id: '6',
        title: 'Modern Loft',
        description: 'Endüstriyel tarz, geniş ve ferah loft daire. Sanat galerileri yakınında.',
        location: 'Ankara, Çankaya',
        pricePerNight: 120,
        maxGuests: 3,
        propertyType: 'apartment',
        amenities: ['wifi', 'kitchen', 'ac', 'tv'],
        owner: 'GDE5LJ5JRCFT2AC7MRQ5KWNJARJQGCHGVB642O4PJVCJLLXFICKT65AA', // ✅ SENİN ADRESİN
        rating: 4.6,
        reviews: 94,
        image: '🏭',
        category: 'trendy',
        verified: false,
        instantBook: true,
      },
    ];

    setProperties(mockProperties);
  } catch (error) {
    console.error('Mülkler yüklenemedi:', error);
  } finally {
    setLoading(false);
  }
};

  const loadFavorites = () => {
    const saved = localStorage.getItem('airstellar-favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const toggleFavorite = (propertyId: string) => {
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(id => id !== propertyId)
      : [...favorites, propertyId];
    
    setFavorites(newFavorites);
    localStorage.setItem('airstellar-favorites', JSON.stringify(newFavorites));
  };

  const handleBooking = (property: Property) => {
    setSelectedProperty(property);
    setShowBookingModal(true);
  };

  const handleViewProperty = async (property: Property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
    
    // Generate QR Code
    try {
      const qrData = `stellar:${property.owner}?amount=${property.pricePerNight}&memo=Property:${property.id}`;
      const qr = await QRCode.toDataURL(qrData);
      setQrCode(qr);
    } catch (err) {
      console.error('QR code generation failed:', err);
    }
  };

  const shareProperty = async (property: Property) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.description} - ${property.pricePerNight} XLM/gece`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link panoya kopyalandı!');
    }
  };

  // confirmBooking fonksiyonunu güncelle

const confirmBooking = async () => {
  if (!selectedProperty || !checkIn || !checkOut) return;

  setBookingLoading(true);
  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const days = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    // ✅ HESAPLAMALAR - NUMBER OLARAK
    const baseAmount = selectedProperty.pricePerNight * days;
    const feeAmount = baseAmount * 0.02;
    const totalPayment = baseAmount + feeAmount;
    const depositAmount = selectedProperty.pricePerNight * 0.3;

    // ✅ STRING'E ÇEVİR (Stellar için)
    const totalAmountStr = baseAmount.toFixed(7);
    const serviceFeeStr = feeAmount.toFixed(7);
    const grandTotalStr = totalPayment.toFixed(7);
    const depositStr = depositAmount.toFixed(7);

    console.log('💵 Hesaplamalar:');
    console.log('  Base:', baseAmount, '→', totalAmountStr);
    console.log('  Fee:', feeAmount, '→', serviceFeeStr);
    console.log('  Total:', totalPayment, '→', grandTotalStr);
    console.log('  Deposit:', depositAmount, '→', depositStr);

    if (days <= 0) {
      alert('❌ Çıkış tarihi, giriş tarihinden sonra olmalı!');
      setBookingLoading(false);
      return;
    }

    // Bakiye kontrolü
    const balance = await stellar.getBalance(publicKey);
    const currentBalance = parseFloat(balance.xlm);

    if (currentBalance < totalPayment) {
      alert(`❌ Yetersiz bakiye!\n\nGerekli: ${grandTotalStr} XLM\nMevcut: ${currentBalance} XLM`);
      setBookingLoading(false);
      return;
    }

    // Memo
    const shortCheckIn = checkIn.replace(/-/g, '').slice(2);
    const shortCheckOut = checkOut.replace(/-/g, '').slice(2);
    const shortMemo = `BK${selectedProperty.id}:${shortCheckIn}-${shortCheckOut}`;

    // ✅ ÖDEME GÖNDER - STRING OLARAK!
    console.log('🚀 Ödeme gönderiliyor...');
    console.log('📤 From:', publicKey);
    console.log('📥 To:', selectedProperty.owner);
    console.log('💰 Amount:', grandTotalStr, '(type:', typeof grandTotalStr, ')');
    console.log('📝 Memo:', shortMemo);

    const result = await stellar.sendPayment({
      from: publicKey,
      to: selectedProperty.owner,
      amount: grandTotalStr, // ✅ STRING!
      memo: shortMemo,
    });

    console.log('✅ İşlem tamamlandı:', result);

    if (result.success) {
      // Rezervasyon kaydet
      const bookingData = {
        id: result.hash,
        txHash: result.hash,
        propertyId: selectedProperty.id,
        propertyTitle: selectedProperty.title,
        propertyImage: selectedProperty.image,
        location: selectedProperty.location,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        totalAmount: baseAmount,
        serviceFee: feeAmount,
        grandTotal: totalPayment,
        deposit: depositAmount,
        status: 'upcoming',
        createdAt: new Date().toISOString(),
        owner: selectedProperty.owner,
        amenities: selectedProperty.amenities,
      };

      const existingBookings = localStorage.getItem('airstellar-bookings');
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];
      bookings.unshift(bookingData);
      localStorage.setItem('airstellar-bookings', JSON.stringify(bookings));

      alert(`🎉 Rezervasyon başarılı!\n\nMülk: ${selectedProperty.title}\nTarih: ${checkIn} - ${checkOut}\nGün: ${days} gece\n\nKonaklama: ${totalAmountStr} XLM\nHizmet: ${serviceFeeStr} XLM\nTOPLAM: ${grandTotalStr} XLM\n\nİşlem Hash: ${result.hash.substring(0, 12)}...\n\nİyi tatiller!`);
      
      setShowBookingModal(false);
      setCheckIn('');
      setCheckOut('');
      setGuests('1');
    }
  } catch (error: any) {
    console.error('❌ Hata:', error);
    alert('❌ Rezervasyon başarısız: ' + error.message);
  } finally {
    setBookingLoading(false);
  }
};

  // Advanced filtering and sorting
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || property.propertyType === filterType;
      const matchesPrice = property.pricePerNight >= priceRange[0] && property.pricePerNight <= priceRange[1];
      
      return matchesSearch && matchesType && matchesPrice;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerNight - b.pricePerNight;
        case 'price-high':
          return b.pricePerNight - a.pricePerNight;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [properties, searchTerm, filterType, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 animate-pulse"
          >
            <div className="h-48 bg-white/10" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-white/10 rounded w-3/4" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search & Filter Bar - PREMIUM */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Konum, mülk adı veya açıklama ara..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all backdrop-blur-lg"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all appearance-none cursor-pointer min-w-[180px] backdrop-blur-lg"
            >
              <option value="all">Tüm Tipler</option>
              <option value="apartment">Daire</option>
              <option value="house">Ev</option>
              <option value="villa">Villa</option>
              <option value="studio">Stüdyo</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <FiTrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="pl-12 pr-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all appearance-none cursor-pointer min-w-[180px] backdrop-blur-lg"
            >
              <option value="popular">En Popüler</option>
              <option value="rating">En Yüksek Puan</option>
              <option value="price-low">Fiyat (Düşük-Yüksek)</option>
              <option value="price-high">Fiyat (Yüksek-Düşük)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
                  : 'text-gray-400 hover:text-white'
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
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">Fiyat Aralığı</label>
            <span className="text-sm text-pink-400 font-semibold">
              {priceRange[0]} - {priceRange[1]} XLM/gece
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
          />
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{filteredAndSortedProperties.length} mülk bulundu</span>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            {showFilters ? 'Filtreleri Gizle' : 'Daha Fazla Filtre'}
          </button>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className={viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
        : 'space-y-6'
      }>
        {filteredAndSortedProperties.map((property) => (
          <div
            key={property.id}
            className={`bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/20 group ${
              viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
            }`}
          >
            {/* Property Image */}
            <div className={`relative bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-6xl border-b border-white/10 ${
              viewMode === 'list' ? 'md:w-64 h-64' : 'h-48'
            }`}>
              {property.image}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {property.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-lg text-white text-xs font-semibold rounded-lg">
                    <FiCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
                {property.instantBook && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-lg text-white text-xs font-semibold rounded-lg">
                    <FiZap className="w-3 h-3" />
                    Anında Rezervasyon
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(property.id);
                  }}
                  className={`p-2 rounded-lg backdrop-blur-lg transition-all ${
                    favorites.includes(property.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    shareProperty(property);
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white rounded-lg transition-all"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProperty(property);
                  }}
                  className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white rounded-lg transition-all"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Property Info */}
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors mb-1">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">
                    {property.rating}
                  </span>
                  <span className="text-xs text-gray-400">({property.reviews})</span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {property.description}
              </p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity}
                    className="px-2 py-1 bg-white/5 text-gray-400 rounded text-xs border border-white/10"
                  >
                    {amenity === 'wifi' && '📶 WiFi'}
                    {amenity === 'parking' && '🚗 Park'}
                    {amenity === 'kitchen' && '🍳 Mutfak'}
                    {amenity === 'ac' && '❄️ Klima'}
                    {amenity === 'tv' && '📺 TV'}
                    {amenity === 'washer' && '🧺 Çamaşır'}
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs font-semibold border border-pink-500/30">
                    +{property.amenities.length - 4} daha
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <FiUsers className="w-4 h-4" />
                  <span>Max {property.maxGuests} konuk</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {property.pricePerNight}
                    <span className="text-sm text-gray-400 font-normal"> XLM</span>
                  </div>
                  <div className="text-xs text-gray-400">gecelik</div>
                </div>
              </div>

              {/* Book Button */}
              <button 
                onClick={() => handleBooking(property)}
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Rezervasyon Yap
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProperties.length === 0 && (
        <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">Mülk bulunamadı</h3>
          <p className="text-gray-400 mb-6">
            Arama kriterlerinizi değiştirmeyi veya filtreleri sıfırlamayı deneyin
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setPriceRange([0, 1000]);
            }}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transition-all"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}

      {/* Booking Modal - PREMIUM */}
      {showBookingModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-lg w-full border border-white/10 shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Rezervasyon Yap</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{selectedProperty.image}</div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {selectedProperty.title}
                  </h4>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <FiMapPin className="w-4 h-4" />
                    {selectedProperty.location}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-lg">
                  <FiStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{selectedProperty.rating}</span>
                  <span className="text-xs text-gray-400">({selectedProperty.reviews} değerlendirme)</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  Giriş Tarihi
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  Çıkış Tarihi
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  Konuk Sayısı
                </label>
                <input
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  min="1"
                  max={selectedProperty.maxGuests}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maksimum {selectedProperty.maxGuests} konuk
                </p>
              </div>
            </div>

           // Modal içindeki hesaplama kısmı (render tarafında)

{checkIn && checkOut && (
  <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl p-4 mb-6">
    {(() => {
      const days = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      const subtotal = selectedProperty.pricePerNight * days;
      const serviceFee = subtotal * 0.02;
      const total = subtotal + serviceFee;
      const deposit = selectedProperty.pricePerNight * 0.3;

      return (
        <>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">
              {days} gece × {selectedProperty.pricePerNight} XLM
            </span>
            <span className="text-white font-semibold">
              {subtotal.toFixed(2)} XLM
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Hizmet bedeli (%2)</span>
            <span className="text-white font-semibold">
              {serviceFee.toFixed(2)} XLM
            </span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-pink-500/30 mb-2">
            <span className="text-gray-400">Depozito (%30)</span>
            <span className="text-pink-400 font-semibold">
              {deposit.toFixed(2)} XLM
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-pink-500/30">
            <span className="text-white font-bold text-lg">Toplam Ödeme</span>
            <span className="text-pink-400 font-bold text-2xl">
              {total.toFixed(2)} XLM
            </span>
          </div>
        </>
      );
    })()}
  </div>
)}

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                disabled={bookingLoading}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all font-semibold"
              >
                İptal
              </button>
              <button
                onClick={confirmBooking}
                disabled={!checkIn || !checkOut || bookingLoading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Onayla ve Öde
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal with QR Code */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Mülk Detayları</h3>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Property Details */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedProperty.image}</div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-white mb-1">{selectedProperty.title}</h4>
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiMapPin className="w-4 h-4" />
                    {selectedProperty.location}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed">{selectedProperty.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Fiyat</div>
                  <div className="text-2xl font-bold text-pink-400">{selectedProperty.pricePerNight} XLM/gece</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="text-gray-400 text-sm mb-1">Maksimum Konuk</div>
                  <div className="text-2xl font-bold text-white">{selectedProperty.maxGuests} kişi</div>
                </div>
              </div>

              {/* All Amenities */}
              <div>
                <h5 className="text-white font-semibold mb-3">Tüm Özellikler</h5>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProperty.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2 text-gray-300">
                      <FiCheck className="w-4 h-4 text-green-400" />
                      <span className="capitalize">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              {qrCode && (
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
                  <h5 className="text-white font-semibold mb-3">Hızlı Ödeme QR Kodu</h5>
                  <img src={qrCode} alt="QR Code" className="mx-auto mb-3 rounded-lg" />
                  <p className="text-sm text-gray-400">
                    Stellar wallet ile tarayın ve hızlıca ödeme yapın
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowPropertyModal(false);
                  handleBooking(selectedProperty);
                }}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Rezervasyon Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}