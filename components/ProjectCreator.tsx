'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FiCode, FiGithub, FiTag, FiFileText, FiUpload } from 'react-icons/fi';

interface ProjectCreatorProps {
  publicKey: string;
}

export default function ProjectCreator({ publicKey }: ProjectCreatorProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [license, setLicense] = useState('MIT');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Proje metadata'sını JSON olarak oluştur
      const metadata = {
        name: projectName,
        description,
        github: githubUrl,
        version,
        license,
        created: new Date().toISOString(),
        owner: publicKey,
        type: 'stellahub-project',
      };

      // Metadata'yı memo olarak kullan
      const memoText = JSON.stringify(metadata).substring(0, 28); // Stellar memo limiti

      // Kendine 0.0000001 XLM gönder (metadata kaydı için)
      const result = await stellar.sendPayment({
        from: publicKey,
        to: publicKey,
        amount: '0.0000001',
        memo: memoText,
      });

      if (result.success) {
        setSuccess(true);
        // Formu temizle
        setProjectName('');
        setDescription('');
        setGithubUrl('');
        setVersion('1.0.0');
        setLicense('MIT');
        
        // 3 saniye sonra success mesajını kaldır
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Proje oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-3 rounded-xl">
            <FiCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Yeni Proje Oluştur</h2>
            <p className="text-gray-400 text-sm">Projenizi blockchain'e kaydedin</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold">Proje başarıyla oluşturuldu!</p>
                <p className="text-sm text-green-300">
                  Blockchain'de kayıt altına alındı
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

        <form onSubmit={handleCreateProject} className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiTag className="w-4 h-4" />
              Proje Adı
            </label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="Örn: AwesomeApp"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiFileText className="w-4 h-4" />
              Açıklama
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all h-24 resize-none"
              placeholder="Projeniz hakkında kısa bir açıklama..."
              required
            />
          </div>

          {/* GitHub URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
              <FiGithub className="w-4 h-4" />
              GitHub URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="https://github.com/username/repo"
              required
            />
          </div>

          {/* Version & License */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Versiyon
              </label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="1.0.0"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Lisans
              </label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              >
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3">BSD 3-Clause</option>
                <option value="ISC">ISC</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Oluşturuluyor...
              </>
            ) : (
              <>
                <FiUpload className="w-5 h-5" />
                Projeyi Blockchain'e Kaydet
              </>
            )}
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-1">Nasıl Çalışır?</p>
              <p className="text-blue-200/80">
                Projeniz Stellar blockchain üzerinde bir işlem olarak kaydedilir. Proje
                bilgileri memo alanında saklanır ve değiştirilemez bir kayıt oluşturur.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}