'use client';

import { useState, useEffect, useMemo } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiSearch, FiFilter, FiArrowUpRight, FiArrowDownLeft, FiExternalLink, FiCalendar, FiRefreshCw, FiDownload } from 'react-icons/fi';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
}

interface TransactionHistoryProps {
  publicKey: string;
}

export default function TransactionHistory({ publicKey }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetFilter, setAssetFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [publicKey]);

  const loadTransactions = async () => {
    try {
      setRefreshing(true);
      const txs = await stellar.getRecentTransactions(publicKey, 20);
      setTransactions(txs);
    } catch (error) {
      console.error('İşlemler yüklenemedi:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = 
        tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesAsset = assetFilter === 'all' || tx.asset === assetFilter;
      
      const isSent = tx.from === publicKey;
      const matchesType = 
        typeFilter === 'all' || 
        (typeFilter === 'sent' && isSent) ||
        (typeFilter === 'received' && !isSent);
      
      return matchesSearch && matchesAsset && matchesType;
    });
  }, [transactions, searchTerm, assetFilter, typeFilter, publicKey]);

  const uniqueAssets = Array.from(new Set(transactions.map(tx => tx.asset).filter(Boolean)));

  const stats = useMemo(() => ({
    total: transactions.length,
    sent: transactions.filter(tx => tx.from === publicKey).length,
    received: transactions.filter(tx => tx.to === publicKey).length,
    volume: transactions.reduce((sum, tx) => sum + (parseFloat(tx.amount || '0')), 0),
  }), [transactions, publicKey]);

  const exportCSV = () => {
    const csv = [
      ['Date', 'Type', 'Amount', 'Asset', 'From', 'To', 'Hash'].join(','),
      ...filteredTransactions.map(tx => [
        format(new Date(tx.createdAt), 'yyyy-MM-dd HH:mm:ss'),
        tx.from === publicKey ? 'Sent' : 'Received',
        tx.amount || '0',
        tx.asset || 'XLM',
        tx.from || '',
        tx.to || '',
        tx.hash,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airstellar-transactions-${Date.now()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 p-3 rounded-xl">
            <FiCalendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">İşlem Geçmişi</h3>
            <p className="text-sm text-gray-400">{stats.total} işlem kaydı</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={exportCSV}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            title="CSV olarak indir"
          >
            <FiDownload className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={loadTransactions}
            disabled={refreshing}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all disabled:opacity-50"
            title="Yenile"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl p-3">
          <div className="text-blue-400 text-xs mb-1">Toplam</div>
          <div className="text-white font-bold text-xl">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-xl p-3">
          <div className="text-red-400 text-xs mb-1">Gönderilen</div>
          <div className="text-white font-bold text-xl">{stats.sent}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-xl p-3">
          <div className="text-green-400 text-xs mb-1">Alınan</div>
          <div className="text-white font-bold text-xl">{stats.received}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-xl p-3">
          <div className="text-purple-400 text-xs mb-1">Hacim</div>
          <div className="text-white font-bold text-lg">{stats.volume.toFixed(0)}</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İşlem hash veya adres ara..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
          </div>

          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Tüm Varlıklar</option>
            {uniqueAssets.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'sent', label: 'Gönderilen' },
            { value: 'received', label: 'Alınan' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setTypeFilter(filter.value as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                typeFilter === filter.value
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg font-semibold mb-1">İşlem bulunamadı</p>
            <p className="text-sm">Arama kriterlerinizi değiştirmeyi deneyin</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isSent = tx.from === publicKey;
            
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-xl ${
                    isSent
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}>
                    {isSent ? (
                      <FiArrowUpRight className="w-5 h-5" />
                    ) : (
                      <FiArrowDownLeft className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">
                        {isSent ? 'Gönderildi' : 'Alındı'}
                      </span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium">
                        {tx.asset || 'XLM'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {format(new Date(tx.createdAt), 'dd MMM yyyy, HH:mm', { locale: tr })}
                      </div>
                      <span className="text-gray-600">•</span>
                      <code className="font-mono">{stellar.formatAddress(tx.hash, 8, 8)}</code>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      isSent ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {isSent ? '-' : '+'}{parseFloat(tx.amount || '0').toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">
                      ≈ ${(parseFloat(tx.amount || '0') * 0.12).toFixed(2)}
                    </div>
                  </div>

                  <a
                    href={stellar.getExplorerLink(tx.hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {filteredTransactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 text-center text-sm text-gray-400">
          {filteredTransactions.length} işlem gösteriliyor
        </div>
      )}
    </div>
  );
}