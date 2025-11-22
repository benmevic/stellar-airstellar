'use client';

import { useState, useEffect } from 'react';
import { FiBookOpen, FiPlus, FiEdit2, FiTrash2, FiCopy, FiCheck, FiX } from 'react-icons/fi';

interface Contact {
  id: string;
  name: string;
  address: string;
  note?: string;
  avatar: string;
}

export default function AddressBook() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', note: '', avatar: '👤' });
  const [copied, setCopied] = useState('');

  const avatars = ['👤', '👨‍💼', '👩‍💼', '👨‍🚀', '👩‍🎨', '🏢', '💼', '🏠', '🏦'];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    const saved = localStorage.getItem('airstellar-contacts');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  };

  const saveContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem('airstellar-contacts', JSON.stringify(newContacts));
  };

  const addContact = () => {
    if (!formData.name || !formData.address) return;

    const newContact: Contact = {
      id: Date.now().toString(),
      ...formData,
    };

    saveContacts([...contacts, newContact]);
    setFormData({ name: '', address: '', note: '', avatar: '👤' });
    setShowAddModal(false);
  };

  const updateContact = () => {
    if (!editingContact) return;

    const updated = contacts.map(c =>
      c.id === editingContact.id ? { ...editingContact, ...formData } : c
    );

    saveContacts(updated);
    setEditingContact(null);
    setFormData({ name: '', address: '', note: '', avatar: '👤' });
  };

  const deleteContact = (id: string) => {
    if (!confirm('Bu kişiyi silmek istediğinizden emin misiniz?')) return;
    saveContacts(contacts.filter(c => c.id !== id));
  };

  const copyAddress = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopied(address);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl">
            <FiBookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Adres Defteri</h3>
            <p className="text-sm text-gray-400">Sık kullanılan adresler</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all font-medium"
        >
          <FiPlus className="w-5 h-5" />
          Ekle
        </button>
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <FiBookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Henüz kayıtlı adres yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{contact.name}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <code className="bg-white/5 px-2 py-1 rounded">
                      {contact.address.substring(0, 10)}...{contact.address.substring(contact.address.length - 6)}
                    </code>
                    <button
                      onClick={() => copyAddress(contact.address)}
                      className="p-1 hover:bg-white/10 rounded transition-all"
                    >
                      {copied === contact.address ? (
                        <FiCheck className="w-3 h-3 text-green-400" />
                      ) : (
                        <FiCopy className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {contact.note && (
                    <div className="text-xs text-gray-500 mt-1">{contact.note}</div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingContact(contact);
                    setFormData({
                      name: contact.name,
                      address: contact.address,
                      note: contact.note || '',
                      avatar: contact.avatar,
                    });
                  }}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-all"
                >
                  <FiEdit2 className="w-4 h-4 text-blue-400" />
                </button>
                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                >
                  <FiTrash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || editingContact) && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingContact ? 'Kişiyi Düzenle' : 'Yeni Kişi Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingContact(null);
                  setFormData({ name: '', address: '', note: '', avatar: '👤' });
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Avatar Selection */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Avatar</label>
                <div className="flex gap-2 flex-wrap">
                  {avatars.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => setFormData({ ...formData, avatar })}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl transition-all ${
                        formData.avatar === avatar
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 scale-110'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">İsim *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Stellar Adresi *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="GABC..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Not (Opsiyonel)</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                  placeholder="Ek bilgi..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingContact(null);
                  setFormData({ name: '', address: '', note: '', avatar: '👤' });
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium"
              >
                İptal
              </button>
              <button
                onClick={editingContact ? updateContact : addContact}
                disabled={!formData.name || !formData.address}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingContact ? 'Güncelle' : 'Ekle'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}