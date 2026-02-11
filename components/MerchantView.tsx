
import React, { useState, useEffect, useCallback } from 'react';
import ToggleSwitch from './ToggleSwitch';
import { GpsIcon, ChiliIcon, OnionIcon, ChickenIcon, TempehIcon, SpinachIcon, TofuIcon, TrashIcon } from './Icons';
import type { Commodity, PreOrder, RegisteredMerchant } from '../types';
import { api } from '../api/gas';

type MerchantPage = 'home' | 'stock' | 'preorders';

const MerchantView: React.FC = () => {
    const [loggedInMerchant, setLoggedInMerchant] = useState<RegisteredMerchant | null>(null);

    const handleLogin = (merchant: RegisteredMerchant) => {
        setLoggedInMerchant(merchant);
    };

    const handleLogout = () => {
        setLoggedInMerchant(null);
    }

    if (!loggedInMerchant) {
        return <LoginForm onLogin={handleLogin} />;
    }

    return <MerchantDashboard merchant={loggedInMerchant} onLogout={handleLogout} />;
};

const LoginForm: React.FC<{ onLogin: (merchant: RegisteredMerchant) => void }> = ({ onLogin }) => {
    const [nik, setNik] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const merchant = await api.doGet('verifyMerchant', { nik, phone });
        if (merchant) {
            onLogin(merchant);
        } else {
            setError('NIK atau No. HP salah. Silakan coba lagi.');
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
            <h1 className="text-2xl font-bold text-emerald-500 mb-2">Login Mitra</h1>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-8">Masukkan NIK dan No. HP Anda yang terdaftar.</p>
            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div>
                    <label htmlFor="nik" className="block text-sm font-medium text-slate-700 dark:text-slate-300">NIK</label>
                    <input type="text" id="nik" value={nik} onChange={e => setNik(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-3"/>
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">No. Handphone</label>
                    <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} required className="mt-1 block w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm p-3"/>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={isLoading} className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:bg-slate-400">
                    {isLoading ? 'Memverifikasi...' : 'Masuk'}
                </button>
            </form>
        </div>
    );
};


const MerchantDashboard: React.FC<{ merchant: RegisteredMerchant; onLogout: () => void }> = ({ merchant, onLogout }) => {
    const [page, setPage] = useState<MerchantPage>('home');
    
    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header merchantName={merchant.name} onLogout={onLogout} />
            <main className="flex-grow p-4 overflow-y-auto">
                {page === 'home' && <MerchantHome />}
                {page === 'stock' && <StockInput />}
                {page === 'preorders' && <PreOrdersList />}
            </main>
            <BottomNav page={page} setPage={setPage} />
        </div>
    );
};

const Header: React.FC<{ merchantName: string; onLogout: () => void; }> = ({ merchantName, onLogout }) => (
    <header className="p-4 bg-white dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-emerald-500">Halo, {merchantName.split(' ')[0]}!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Selamat datang di dasbor Anda.</p>
        </div>
        <button onClick={onLogout} className="text-xs font-semibold text-red-500 bg-red-100 dark:bg-red-900/50 px-3 py-1.5 rounded-md hover:bg-red-200">
            Keluar
        </button>
    </header>
);

const MerchantHome: React.FC = () => {
    const [isSelling, setIsSelling] = useState(false);
    const [gpsActive, setGpsActive] = useState(false);
    const [notification, setNotification] = useState(false);

    const handleToggle = (toggled: boolean) => {
        setIsSelling(toggled);
        if (toggled) {
            navigator.geolocation.getCurrentPosition(
                () => setGpsActive(true),
                () => setGpsActive(false)
            );
        } else {
            setGpsActive(false);
        }
    };

    useEffect(() => {
        const checkPendingOrders = async () => {
            const orders = await api.doGet('getPreOrders');
            const hasPendingOrders = orders.some((o: PreOrder) => o.status === 'pending');
            setNotification(hasPendingOrders);
        };
        checkPendingOrders();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 pt-10">
            <ToggleSwitch 
                label="Status Jualan"
                toggled={isSelling}
                onToggle={handleToggle}
                onLabel="Jualan"
                offLabel="Istirahat"
            />
            <div className={`flex items-center space-x-2 p-3 rounded-full transition-colors ${gpsActive ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'}`}>
                <GpsIcon className={`w-6 h-6 ${gpsActive ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`font-semibold ${gpsActive ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    GPS {gpsActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
            </div>
            {notification && (
                <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-700 dark:text-yellow-300 p-4 rounded-r-lg w-full">
                    <p className="font-bold">Notifikasi</p>
                    <p>Ada pesanan titipan baru yang masuk! Cek tab "Pesanan".</p>
                </div>
            )}
        </div>
    );
};

const CommodityIcon: React.FC<{id: string, className?:string}> = ({id, className}) => {
    switch (id) {
        case 'chili': return <ChiliIcon className={className}/>;
        case 'onion': return <OnionIcon className={className}/>;
        case 'chicken': return <ChickenIcon className={className}/>;
        case 'tempeh': return <TempehIcon className={className}/>;
        case 'spinach': return <SpinachIcon className={className}/>;
        case 'tofu': return <TofuIcon className={className}/>;
        default: return <div className="w-8 h-8 text-slate-400">?</div>;
    }
}

const StockInput: React.FC = () => {
    const [stock, setStock] = useState<Commodity[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', price: '0', stock: '0', unit: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStock = async () => {
            const data = await api.doGet('getStock');
            setStock(data);
            setIsLoading(false);
        };
        fetchStock();
    }, []);

    const updatePrice = useCallback((id: string, increment: boolean) => {
        setStock(currentStock =>
            currentStock.map(item =>
                item.id === id ? { ...item, price: Math.max(0, item.price + (increment ? 500 : -500)) } : item
            )
        );
    }, []);

    const removeItem = (id: string) => {
        setStock(currentStock => currentStock.filter(item => item.id !== id));
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const newCommodity: Commodity = {
            id: newItem.name.toLowerCase().replace(/\s/g, '-') + Date.now(),
            name: newItem.name,
            price: parseInt(newItem.price, 10),
            stock: parseInt(newItem.stock, 10),
            unit: newItem.unit,
        };
        setStock(current => [...current, newCommodity]);
        setNewItem({ name: '', price: '0', stock: '0', unit: '' });
        setIsAdding(false);
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Input Stok & Harga Hari Ini</h2>
            {isLoading ? <p>Memuat stok...</p> : (
            <div className="space-y-3">
                {stock.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg p-3 flex items-center space-x-4 shadow">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-emerald-500">
                           <CommodityIcon id={item.id} className="w-8 h-8"/>
                        </div>
                        <div className="flex-grow">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Stok: {item.stock} {item.unit}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => updatePrice(item.id, false)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-lg">-</button>
                            <span className="w-24 text-center font-mono font-semibold">Rp{item.price.toLocaleString('id-ID')}</span>
                            <button onClick={() => updatePrice(item.id, true)} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-lg">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
            )}

            {isAdding && (
                <form onSubmit={handleAddItem} className="mt-6 bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-3">
                    <h3 className="font-bold">Tambah Barang Baru</h3>
                    <input type="text" placeholder="Nama Barang" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2"/>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Harga" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2"/>
                        <input type="number" placeholder="Stok" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2"/>
                    </div>
                    <input type="text" placeholder="Satuan (kg, ikat, ons)" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} required className="w-full bg-slate-100 dark:bg-slate-700 rounded p-2"/>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => setIsAdding(false)} className="w-full bg-slate-200 dark:bg-slate-700 py-2 rounded-lg font-semibold">Batal</button>
                        <button type="submit" className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold">Tambah</button>
                    </div>
                </form>
            )}

            <button onClick={() => setIsAdding(true)} className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${isAdding ? 'hidden' : 'block bg-blue-500 text-white hover:bg-blue-600'}`}>
                + Tambah Barang Baru
            </button>
        </div>
    );
};

const PreOrdersList: React.FC = () => {
    const [orders, setOrders] = useState<PreOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const data = await api.doGet('getPreOrders');
            setOrders(data);
            setIsLoading(false);
        };
        fetchOrders();
    }, []);

    const confirmOrder = (order: PreOrder) => {
        // 1. Format the phone number to international format for WhatsApp
        let phoneNumber = order.customerWhatsapp.trim();
        if (phoneNumber.startsWith('0')) {
            phoneNumber = '62' + phoneNumber.substring(1);
        }
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

        // 2. Create the confirmation message
        const message = `Halo ${order.customerName}, pesanan titipan Anda telah dikonfirmasi oleh pedagang dan akan disiapkan. Terima kasih!`;
        const encodedMessage = encodeURIComponent(message);

        // 3. Create the WhatsApp URL
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        // 4. Open the URL in a new tab to send the notification
        window.open(whatsappUrl, '_blank');

        // 5. Update the order status in the local state and simulated backend
        api.doPost('updatePreOrderStatus', { id: order.id, status: 'confirmed' });
        setOrders(orders.map(o => o.id === order.id ? {...o, status: 'confirmed'} : o));
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Pesanan Titipan Masuk (H-1)</h2>
            {isLoading ? <p>Memuat pesanan...</p> : (
            <div className="space-y-3">
                {orders.length === 0 && <p className="text-center text-slate-500 dark:text-slate-400 py-8">Belum ada pesanan titipan.</p>}
                {orders.map(order => (
                    <div key={order.id} className={`rounded-lg p-4 shadow ${order.status === 'pending' ? 'bg-white dark:bg-slate-800' : 'bg-slate-100 dark:bg-slate-800/50'}`}>
                        <p className="font-bold">{order.customerName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">WA: {order.customerWhatsapp}</p>
                        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 my-2">
                            {order.items.map((item, index) => (
                                <li key={index}>{item.commodityName} - {item.quantity}</li>
                            ))}
                        </ul>
                        {order.status === 'pending' ? (
                            <button onClick={() => confirmOrder(order)} className="w-full text-sm bg-emerald-500 text-white py-1.5 rounded-md font-semibold hover:bg-emerald-600 transition-colors">
                                Konfirmasi & Kirim WA
                            </button>
                        ) : (
                             <p className="text-center text-sm font-semibold text-green-600 dark:text-green-400 py-1.5 bg-green-100 dark:bg-green-900/50 rounded-md">
                                Dikonfirmasi
                            </p>
                        )}
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};

const BottomNav: React.FC<{ page: MerchantPage, setPage: (page: MerchantPage) => void }> = ({ page, setPage }) => {
    const navItems = [
        { id: 'home', label: 'Beranda' },
        { id: 'stock', label: 'Input Stok' },
        { id: 'preorders', label: 'Pesanan' },
    ];
    return (
        <nav className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 p-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setPage(item.id as MerchantPage)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                        page === item.id
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <span className="text-xs font-semibold">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default MerchantView;
