'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiHome, FiMapPin, FiDollarSign, FiUsers, FiImage, FiCheckCircle } from 'react-icons/fi';

interface PropertyListingProps {
  publicKey: string;
}

export default function PropertyListing({ publicKey }: PropertyListingProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [maxGuests, setMaxGuests] = useState('2');
  const [propertyType, setPropertyType] = useState('apartment');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'parking', label: 'Park Yeri', icon: '🚗' },
    { id: 'kitchen', label: 'Mutfak', icon: '🍳' },
    { id: 'ac', label: 'Klima', icon: '❄️' },
    { id: 'tv', label: 'TV', icon: '📺' },
    { id: 'washer', label: 'Çamaşır Makinesi', icon: '🧺' },
  ];

  const toggleAmenity = (amenityId: string) => {
    setAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(a => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleListProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const propertyData = {
        title,
        description,
        location,
        pricePerNight: parseFloat(pricePerNight),
        maxGuests: parseInt(maxGuests),
        propertyType,
        amenities,
        owner: publicKey,
        created: new Date().toISOString(),
        type: 'airstellar-property',
        status: 'available',
      };

      const memoText = JSON.stringify(propertyData).substring(0, 28);

      const result = await stellar.sendPayment({
        from: publicKey,
        to: publicKey,
        amount: '0.0000001',
        memo: memoText,
      });

      if (result.success) {
        setSuccess(true);
        setTitle('');
        setDescription('');
        setLocation('');
        setPricePerNight('');
        setMaxGuests('2');
        setPropertyType('apartment');
        setAmenities([]);

        setTimeout(() => setSuccess(false), 5000);
      }
    } catch (err: any) {
      setError(err.message || 'Mülk listelenemedi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-3 rounded-xl shadow-lg">
            <FiHome className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Mülkünüzü Listeleyin</h2>
            <p className="text-gray-400 text-sm">Evinizi tokenize edin ve kiralamaya açın</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-green-400">
              <FiCheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold">Mülk başarıyla listelendi! 🎉</p>
                <p className="text-sm text-green-300">
                  Blockchain'de kayıt altına alındı. Artık kiralama için hazır!
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        <form onSubmit={handleListProperty} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiHome className="w-4 h-4" />
              Mülk Başlığı
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              placeholder="Örn: Deniz Manzaralı Lüks Daire"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiImage className="w-4 h-4" />
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all h-32 resize-none"
              placeholder="Mülkünüz hakkında detaylı açıklama..."
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiMapPin className="w-4 h-4" />
              Konum
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              placeholder="Örn: İstanbul, Beşiktaş"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FiDollarSign className="w-4 h-4" />
                Gecelik Fiyat (XLM)
              </label>
              <input
                type="number"
                step="0.01"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                placeholder="50"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FiUsers className="w-4 h-4" />
                Maksimum Konuk
              </label>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                min="1"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Mülk Tipi
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              >
                <option value="apartment">Daire</option>
                <option value="house">Ev</option>
                <option value="room">Oda</option>
                <option value="villa">Villa</option>
                <option value="studio">Stüdyo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Özellikler
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`p-3 rounded-xl border transition-all ${
                    amenities.includes(amenity.id)
                      ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="text-2xl mb-1">{amenity.icon}</div>
                  <div className="text-xs font-medium">{amenity.label}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Listeleniyor...
              </>
            ) : (
              <>
                <FiCheckCircle className="w-5 h-5" />
                Mülkü Blockchain'e Kaydet
              </>
            )}
          </button>
        </form>

        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Nasıl Çalışır?</p>
              <p className="text-blue-200/80">
                Mülkünüz Stellar blockchain üzerinde tokenize edilir. Her rezervasyon bir
                token transferi olarak gerçekleşir. Kira ve depozito ödemeleri otomatik
                olarak güvence altına alınır.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}