'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiGithub, FiEdit, FiTrash2, FiSend, FiPlus } from 'react-icons/fi';

interface MyProject {
  id: string;
  name: string;
  description: string;
  github: string;
  version: string;
  license: string;
  created: string;
}

interface MyProjectsProps {
  publicKey: string;
}

export default function MyProjects({ publicKey }: MyProjectsProps) {
  const [projects, setProjects] = useState<MyProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<MyProject | null>(null);
  const [recipientAddress, setRecipientAddress] = useState('');

  useEffect(() => {
    loadMyProjects();
  }, [publicKey]);

  const loadMyProjects = async () => {
    try {
      setLoading(true);
      // Gerçek uygulamada kullanıcının projelerini blockchain'den çek
      // Şimdilik mock data kullanıyoruz
      const mockProjects: MyProject[] = [
        {
          id: '1',
          name: 'My Awesome App',
          description: 'Harika bir uygulama projesi',
          github: 'https://github.com/benmevic/awesome-app',
          version: '1.2.3',
          license: 'MIT',
          created: new Date().toISOString(),
        },
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Projeler yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = (project: MyProject) => {
    setSelectedProject(project);
    setShowTransferModal(true);
  };

  const confirmTransfer = async () => {
    if (!selectedProject || !recipientAddress) return;

    try {
      // Proje transferi (gerçek uygulamada asset transfer olacak)
      await stellar.sendPayment({
        from: publicKey,
        to: recipientAddress,
        amount: '0.0000001',
        memo: `TRANSFER:${selectedProject.name}`,
      });

      alert('Proje başarıyla transfer edildi!');
      setShowTransferModal(false);
      setRecipientAddress('');
      loadMyProjects();
    } catch (error: any) {
      alert('Transfer başarısız: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Projelerim</h2>
        <p className="text-gray-400">Sahip olduğunuz blockchain projeleri</p>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-20 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-white mb-2">Henüz proje yok</h3>
          <p className="text-gray-400 mb-6">
            İlk projenizi oluşturarak başlayın!
          </p>
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2">
            <FiPlus className="w-5 h-5" />
            Proje Oluştur
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-2 rounded-lg">
                      <FiGithub className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400">v{project.version}</p>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                      {project.license}
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full">
                      Aktif
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all">
                    <FiEdit className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleTransfer(project)}
                    className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-all"
                  >
                    <FiSend className="w-5 h-5 text-purple-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Proje Transfer</h3>
            <p className="text-gray-400 mb-6">
              <strong className="text-white">{selectedProject.name}</strong> projesini
              transfer etmek üzeresiniz.
            </p>
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Alıcı Adresi
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="GABC..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all"
              >
                İptal
              </button>
              <button
                onClick={confirmTransfer}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-xl transition-all"
              >
                Transfer Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}