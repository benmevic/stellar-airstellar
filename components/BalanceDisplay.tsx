'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiRefreshCw, FiTrendingUp, FiDollarSign, FiBarChart2, FiEye, FiEyeOff, FiArrowUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface BalanceDisplayProps {
  publicKey: string;
}

export default function BalanceDisplay({ publicKey }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<{ xlm: string; assets: any[] }>({ xlm: '0', assets: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChart, setShowChart] = useState(false);
  const [showAssets, setShowAssets] = useState(true);
  const [balanceHistory, setBalanceHistory] = useState<Array<{ date: string; balance: number }>>([]);

  useEffect(() => {
    if (publicKey) {
      loadBalance();
      loadBalanceHistory();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(loadBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

  const loadBalance = async () => {
    try {
      setLoading(true);
      setError('');
      const balanceData = await stellar.getBalance(publicKey);
      setBalance(balanceData);
    } catch (err: any) {
      setError(err.message || 'Bakiye yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadBalanceHistory = () => {
    // Mock balance history data
    const currentBalance = parseFloat(balance.xlm) || 1300;
    const history = [
      { date: '1 Oca', balance: currentBalance * 0.65 },
      { date: '8 Oca', balance: currentBalance * 0.71 },
      { date: '15 Oca', balance: currentBalance * 0.85 },
      { date: '22 Oca', balance: currentBalance * 0.75 },
      { date: '29 Oca', balance: currentBalance * 0.96 },
      { date: 'Bugün', balance: currentBalance },
    ];
    setBalanceHistory(history);
  };

  const formatBalance = (bal: string): string => {
    const num = parseFloat(bal);
    return num.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    });
  };

  const estimateUSD = (xlm: string): string => {
    return (parseFloat(xlm) * 0.12).toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl blur-lg opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-xl">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Bakiyem</h3>
            <p className="text-sm text-gray-400">Stellar Lumens</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowChart(!showChart)}
            className={`p-2 rounded-lg transition-all ${
              showChart 
                ? 'bg-pink-500/20 border border-pink-500/50' 
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
            title="Grafik Göster/Gizle"
          >
            <FiBarChart2 className={`w-5 h-5 ${showChart ? 'text-pink-400' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={loadBalance}
            disabled={loading}
            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50"
            title="Yenile"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-400 ${loading ? 'animate-spin' : 'hover:text-white'}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-red-400 text-sm flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          {error}
        </div>
      )}

      {/* Main Balance Display */}
      <div className="mb-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 p-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm text-gray-400 mb-2">Kullanılabilir Bakiye</p>
          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-5xl font-bold text-white">
              {formatBalance(balance.xlm)}
            </div>
            <div className="text-2xl text-white/80">XLM</div>
          </div>
          
          {/* USD Estimate */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>≈ ${estimateUSD(balance.xlm)} USD</span>
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <FiArrowUp className="w-4 h-4" />
              <span>+12.5% bu ay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Chart */}
      {showChart && (
        <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10 animate-slideDown">
          <h4 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-pink-400" />
            Bakiye Geçmişi
          </h4>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={balanceHistory}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                stroke="#9ca3af" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9ca3af" 
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `${value.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  borderRadius: '12px',
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: any) => [`${value.toFixed(2)} XLM`, 'Bakiye']}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#ec4899" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Other Assets */}
      {balance.assets.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Diğer Varlıklar
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                {balance.assets.length}
              </span>
            </h4>
            <button
              onClick={() => setShowAssets(!showAssets)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {showAssets ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          
          {showAssets && (
            <div className="space-y-2 animate-slideDown">
              {balance.assets.map((asset, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {asset.code.substring(0, 2)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{asset.code}</div>
                      <div className="text-gray-400 text-xs font-mono">
                        {stellar.formatAddress(asset.issuer, 6, 6)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold text-lg">
                      {formatBalance(asset.balance)}
                    </div>
                    <div className="text-xs text-gray-400">
                      ≈ ${(parseFloat(asset.balance) * 0.15).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span>Testnet • Stellar Blockchain</span>
          </div>
          <span className="text-gray-500">Son güncelleme: Az önce</span>
        </div>
      </div>

      {/* Reserve Warning */}
      {parseFloat(balance.xlm) < 2 && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-2">
          <span className="text-xl">💡</span>
          <p className="text-yellow-200 text-xs">
            <strong>Tip:</strong> Hesabınızda en az 1 XLM bulundurun (network reserve için).
          </p>
        </div>
      )}
    </div>
  );
}