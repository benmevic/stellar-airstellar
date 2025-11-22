'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiGithub, FiTag, FiCalendar, FiUser, FiExternalLink, FiSearch } from 'react-icons/fi';

interface Project {
  id: string;
  name: string;
  description: string;
  github: string;
  version: string;
  license: string;
  owner: string;
  created: string;
  txHash: string;
}

interface ProjectMarketplaceProps {
  publicKey: string;
}

export default function ProjectMarketplace({ publicKey }: ProjectMarketplaceProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProjects();
  }, [publicKey]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // İşlem geçmişinden projeleri yükle
      const transactions = await stellar.getRecentTransactions(publicKey, 50);
      
      // StellaHub proje işlemlerini filtrele
      const projectTxs = transactions.filter((tx) => {
        // Kendine gönderilen işlemler (proje kayıtları)
        return tx.from === tx.to && tx.from === publicKey;
      });

      // İşlemleri projelere dönüştür (demo için mock data)
      const mockProjects: Project[] = [
        {
          id: '1',
          name: 'DeFi Dashboard',
          description: 'Merkezi olmayan finans dashboard uygulaması',
          github: 'https://github.com/example/defi-dashboard',
          version: '2.1.0',
          license: 'MIT',
          owner: stellar.formatAddress(publicKey),
          created: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          txHash: 'abc123',
        },
        {
          id: '2',
          name: 'NFT Marketplace',
          description: 'Stellar blockchain üzerinde NFT pazarı',
          github: 'https://github.com/example/nft-market',
          version: '1.5.2',
          license: 'Apache-2.0',
          owner: stellar.formatAddress('GABC...XYZ'),
          created: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          txHash: 'def456',
        },
        {
          id: '3',
          name: 'Payment Gateway',
          description: 'Kripto para ödeme gateway çözümü',
          github: 'https://github.com/example/payment-gateway',
          version: '3.0.1',
          license: 'GPL-3.0',
          owner: stellar.formatAddress('GDEF...ABC'),
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          txHash: 'ghi789',
        },
      ];

      setProjects(mockProjects);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 animate-pulse"
          >
            <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
            <div className="h-4 bg-white/10 rounded w-full mb-2" />
            <div className="h-4 bg-white/10 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Proje ara..."
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 group"
          >
            {/* Project Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
                  <FiGithub className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <FiTag className="w-3 h-3" />
                    v{project.version}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Metadata */}
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex items-center gap-2 text-gray-400">
                <FiUser className="w-3 h-3" />
                <span>{project.owner}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <FiCalendar className="w-3 h-3" />
                <span>{new Date(project.created).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                  {project.license}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <FiGithub className="w-4 h-4" />
                GitHub
              </a>
              <a
                href={stellar.getExplorerLink(project.txHash, 'tx')}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <FiExternalLink className="w-4 h-4" />
                Explorer
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">Proje bulunamadı</h3>
          <p className="text-gray-400">
            {searchTerm
              ? 'Arama kriterlerinize uygun proje yok'
              : 'Henüz kayıtlı proje bulunmuyor'}
          </p>
        </div>
      )}
    </div>
  );
}