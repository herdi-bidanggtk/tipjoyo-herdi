
import React, { useState, useEffect } from 'react';
import { api } from '../api/gas';
import type { RegisteredMerchant } from '../types';
import { UserPlusIcon, UsersIcon } from './Icons';

const AdminView: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
    }

    return <AdminDashboard />;
};

const AdminLogin: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Hardcoded credentials as requested
        if (email === 'herdi.gtk@gmail.com' && password === 'Herdi@100979') {
            onLoginSuccess();
        } else {
            setError('Email atau password salah.');
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-purple-500 mb-2">Login Admin</h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">Hanya untuk administrator terdaftar.</p>
            <form onSubmit={handleLogin} className="w-full space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                    <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-3"/>
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm p-3"/>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                    Masuk
                </button>
            </form>
        </div>
    );
};

const AdminDashboard: React.FC = () => {
    const [merchants, setMerchants] = useState<RegisteredMerchant[]>([]);
    const [newMerchant, setNewMerchant] = useState<Omit<RegisteredMerchant, 'id'>>({
        name: '', nik: '', phone: '', photoUrl: '', ktpUrl: '', address: '', district: '', subdistrict: ''
    });
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMerchants = async () => {
            const data = await api.doGet('getMerchants');
            setMerchants(data);
            setIsLoading(false);
        };
        fetchMerchants();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMerchant(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            if (name === 'photoFile') setPhotoFile(files[0]);
            if (name === 'ktpFile') setKtpFile(files[0]);
        }
    };

    const handleAddMerchant = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Simulate file upload and get URL
        const photoUrl = photoFile ? URL.createObjectURL(photoFile) : '';
        const ktpUrl = ktpFile ? URL.createObjectURL(ktpFile) : '';
        
        const merchantData = { ...newMerchant, photoUrl, ktpUrl };

        const response = await api.doPost('addMerchant', merchantData);
        if (response.success) {
            setMerchants(prev => [...prev, response.data]);
            // Reset form
            setNewMerchant({ name: '', nik: '', phone: '', photoUrl: '', ktpUrl: '', address: '', district: '', subdistrict: '' });
            setPhotoFile(null);
            setKtpFile(null);
            // Also reset file input visually
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach(input => (input as HTMLInputElement).value = '');
        } else {
            setError(response.message || 'Gagal menambahkan pedagang.');
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <header className="p-4 bg-white dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
                <h1 className="text-xl font-bold text-purple-500 text-center">Panel Admin</h1>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">Manajemen Pedagang Mitra</p>
            </header>
            <main className="flex-grow p-4 overflow-y-auto space-y-6">
                <section>
                    <form onSubmit={handleAddMerchant} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md space-y-3">
                        <div className="flex items-center space-x-2 text-lg font-bold">
                            <UserPlusIcon className="w-6 h-6 text-purple-500"/>
                            <h2>Daftarkan Pedagang Baru</h2>
                        </div>
                        <input type="text" name="name" placeholder="Nama Lengkap" value={newMerchant.name} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        <input type="text" name="nik" placeholder="NIK" value={newMerchant.nik} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        <input type="tel" name="phone" placeholder="No. Handphone" value={newMerchant.phone} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        <input type="text" name="address" placeholder="Alamat" value={newMerchant.address} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        <input type="text" name="district" placeholder="Kecamatan" value={newMerchant.district} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        <input type="text" name="subdistrict" placeholder="Kelurahan" value={newMerchant.subdistrict} onChange={handleInputChange} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2.5" />
                        
                        <div className="text-sm">
                            <label htmlFor="photoFile" className="font-medium">Foto Pedagang</label>
                            <input type="file" id="photoFile" name="photoFile" onChange={handleFileChange} className="w-full text-xs" />
                        </div>
                         <div className="text-sm">
                            <label htmlFor="ktpFile" className="font-medium">Foto KTP</label>
                            <input type="file" id="ktpFile" name="ktpFile" onChange={handleFileChange} className="w-full text-xs" />
                        </div>

                         {error && <p className="text-sm text-red-500">{error}</p>}
                        <button type="submit" className="w-full bg-purple-500 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                            Tambah Pedagang
                        </button>
                    </form>
                </section>
                <section>
                    <div className="flex items-center space-x-2 text-lg font-bold mb-3">
                        <UsersIcon className="w-6 h-6 text-purple-500"/>
                        <h2>Pedagang Terdaftar</h2>
                    </div>
                    <div className="space-y-2">
                        {isLoading ? <p>Memuat data...</p> : merchants.map(merchant => (
                            <div key={merchant.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm flex items-center space-x-4">
                                {merchant.photoUrl ? <img src={merchant.photoUrl} alt={merchant.name} className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700"></div> }
                                <div>
                                    <p className="font-semibold">{merchant.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">NIK: {merchant.nik}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">HP: {merchant.phone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminView;
