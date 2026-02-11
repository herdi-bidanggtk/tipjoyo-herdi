
import React, { useState, useEffect } from 'react';
import type { Commodity, Merchant, CartItem } from '../types';
import { COMMODITIES, MERCHANTS } from '../constants';
import { WhatsAppIcon, ChiliIcon, OnionIcon, ChickenIcon, TempehIcon, SpinachIcon, TofuIcon } from './Icons';

type CustomerPage = 'radar' | 'ordering' | 'preorder';

const CustomerView: React.FC = () => {
    const [page, setPage] = useState<CustomerPage>('radar');
    
    return (
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header />
            <main className="flex-grow p-4 overflow-y-auto">
                {page === 'radar' && <RadarSayur onSelectMerchant={() => setPage('ordering')} />}
                {page === 'ordering' && <Ordering />}
                {page === 'preorder' && <PreOrderForm />}
            </main>
            <BottomNav page={page} setPage={setPage} />
        </div>
    );
};

const Header: React.FC = () => (
    <header className="p-4 bg-white dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold text-blue-500 text-center">TIPJOYO Warga</h1>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">Temukan pedagang sayur terdekat!</p>
    </header>
);

interface DisplayMerchant extends Merchant {
    distance: number | null;
}

const RadarSayur: React.FC<{onSelectMerchant: () => void}> = ({ onSelectMerchant }) => {
    const [selectedMerchant, setSelectedMerchant] = useState<DisplayMerchant | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [displayMerchants, setDisplayMerchants] = useState<DisplayMerchant[]>(MERCHANTS.map(m => ({ ...m, distance: null })));

    const calculateDistance = (
        loc1: { lat: number; lng: number },
        loc2: { lat: number; lng: number }
    ): number => {
        const R = 6371; // Radius of the earth in km
        const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
        const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const handleLocateUser = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentUserLocation = { lat: latitude, lng: longitude };
                setUserLocation(currentUserLocation);

                const merchantsWithDistance = MERCHANTS.map(merchant => {
                    const distance = calculateDistance(currentUserLocation, merchant.location);
                    return { ...merchant, distance };
                }).sort((a, b) => a.distance - b.distance);

                setDisplayMerchants(merchantsWithDistance);
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location", error);
                alert("Tidak bisa mendapatkan lokasi. Pastikan izin lokasi sudah diberikan pada browser Anda.");
                setIsLocating(false);
            }
        );
    };


    return (
        <div className="relative h-[calc(100%+2rem)] -m-4 bg-slate-800 overflow-hidden flex flex-col">
            <div className="relative flex-grow rounded-lg overflow-hidden border-4 border-slate-300 dark:border-slate-700">
                <img src="https://picsum.photos/seed/map/800/1200" alt="Map" className="w-full h-full object-cover opacity-50" />
                
                {userLocation && (
                     <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-ping"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-blue-400 rounded-full"></div>
                    </div>
                )}

                {displayMerchants.map((m, i) => (
                    <div key={m.id} 
                        onClick={() => setSelectedMerchant(m)}
                        className="absolute w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-lg cursor-pointer animate-pulse" 
                        style={{
                            top: `${10 + i * 15}%`,
                            left: `${15 + Math.sin(i * 2 + (userLocation ? userLocation.lat : 0)) * 25}%`,
                            animationDelay: `${i*0.2}s`
                        }}
                    >
                        {m.name.charAt(0)}
                    </div>
                ))}
            </div>

             <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                {!userLocation ? (
                    <button onClick={handleLocateUser} disabled={isLocating} className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-slate-400">
                        {isLocating ? 'Mencari Lokasi...' : '📍 Cari Pedagang Terdekat'}
                    </button>
                ) : (
                    <div className="text-center">
                        <p className="font-semibold">Menampilkan pedagang terdekat dari lokasi Anda.</p>
                        <button onClick={handleLocateUser} className="text-sm text-blue-500 hover:underline mt-1">Perbarui Lokasi</button>
                    </div>
                )}
            </div>

            {selectedMerchant && (
                <div className="absolute bottom-24 left-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl z-20 animate-fade-in-up">
                    <h3 className="font-bold text-lg">{selectedMerchant.name}</h3>
                    {selectedMerchant.distance !== null ? (
                         <>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Jarak: ~{selectedMerchant.distance.toFixed(1)} km</p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">Estimasi Tiba: {Math.max(1, Math.round(selectedMerchant.distance * 5))} menit</p>
                        </>
                    ) : (
                         <p className="text-sm text-slate-500 dark:text-slate-400">Tetapkan lokasi untuk melihat estimasi.</p>
                    )}
                   
                    <button onClick={() => { onSelectMerchant(); setSelectedMerchant(null); }} className="w-full mt-3 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-slate-400" disabled={selectedMerchant.distance === null}>
                        Lihat Dagangan
                    </button>
                    <button onClick={() => setSelectedMerchant(null)} className="absolute -top-2 -right-2 w-7 h-7 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-800 dark:text-white font-bold">&times;</button>
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

const Ordering: React.FC = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [promptDismissed, setPromptDismissed] = useState(false);
    
    const addToCart = (item: Commodity) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
            if (existingItem) {
                return prevCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem);
            }
            return [...prevCart, { ...item, quantity: 1 }];
        });
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const generateWhatsAppMessage = () => {
        const intro = "Halo Pak/Bu, saya mau pesan:\n";
        const items = cart.map(item => `- ${item.name} (${item.quantity} ${item.unit})`).join('\n');
        const totalMsg = `\n\nTotal: Rp ${total.toLocaleString('id-ID')}`;
        const outro = "\n\nMohon diantar ke depan rumah ya. Terima kasih!";
        return encodeURIComponent(intro + items + totalMsg + outro);
    };

    const handleDismissPrompt = () => {
        setPromptDismissed(true);
    };

    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Dagangan Pak Joyo Hari Ini</h2>
            <div className="grid grid-cols-2 gap-4">
                {COMMODITIES.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-3 flex flex-col">
                        <div className="w-full h-20 bg-slate-200 dark:bg-slate-700 rounded-md mb-2 flex items-center justify-center text-emerald-500">
                           <CommodityIcon id={item.id} className="w-10 h-10"/>
                        </div>
                        <h3 className="font-semibold text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Rp {item.price.toLocaleString('id-ID')} / {item.unit}</p>
                        <button onClick={() => addToCart(item)} className="mt-2 w-full text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 py-1.5 rounded-md font-semibold hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                            + Tambah
                        </button>
                    </div>
                ))}
            </div>
            
            {cart.length > 0 && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(384px-2rem)] z-30">
                    {/* Show the PROMPT if cart has items but the prompt hasn't been dismissed yet */}
                    {!promptDismissed ? (
                        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl animate-fade-in-up">
                            <div className="flex items-start justify-between mb-3">
                                <h4 className="font-bold text-lg text-emerald-500 pt-1">Barang ditambahkan!</h4>
                                <button onClick={handleDismissPrompt} className="text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none">&times;</button>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                                Lanjut belanja atau selesaikan pesanan via WhatsApp.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <button onClick={handleDismissPrompt} className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 py-3 rounded-lg font-semibold transition-colors">
                                    Lanjut Belanja
                                </button>
                                <a 
                                    href={`https://wa.me/6281234567890?text=${generateWhatsAppMessage()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-green-500 text-white py-3 px-4 rounded-lg shadow-lg flex items-center justify-center font-bold text-base hover:bg-green-600 transition-transform"
                                >
                                    <WhatsAppIcon className="w-5 h-5 mr-2" />
                                    Pesan di WhatsApp
                                </a>
                            </div>
                        </div>
                    ) : (
                        // Show the standard button if prompt has been dismissed
                        <a 
                            href={`https://wa.me/6281234567890?text=${generateWhatsAppMessage()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-green-500 text-white py-4 px-4 rounded-xl shadow-lg flex items-center justify-center font-bold text-lg hover:bg-green-600 transition-transform hover:scale-105"
                        >
                            <WhatsAppIcon className="w-6 h-6 mr-3" />
                            Pesan via WhatsApp (Rp {total.toLocaleString('id-ID')})
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};

const PreOrderForm: React.FC = () => {
    const [submitted, setSubmitted] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [isLocating, setIsLocating] = useState(true);
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location", error);
                setIsLocating(false);
            }
        );
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!location) {
            alert("Lokasi Anda belum terdeteksi. Mohon tunggu atau berikan izin lokasi.");
            return;
        }
        setSubmitted(true);
        // Here you would call the API to submit the form data, including location
        // e.g., api.doPost('submitPreOrder', { ...formData, location });
    };

    if (submitted) {
        return (
            <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold text-emerald-500">Pesanan Terkirim!</h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">Pedagang akan segera mengonfirmasi pesanan titipan Anda. Terima kasih!</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-lg font-semibold">
                    Titip Lagi
                </button>
            </div>
        );
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-bold mb-4">Form Titip Belonjo Besok</h2>
            <div>
                <label htmlFor="itemName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nama Barang</label>
                <input type="text" id="itemName" required className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"/>
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Jumlah (e.g., 1 kg, 5 ikat)</label>
                <input type="text" id="quantity" required className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"/>
            </div>
             <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 dark:text-slate-300">No. WhatsApp</label>
                <input type="tel" id="whatsapp" required placeholder="08123456789" className="mt-1 block w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-3"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Lokasi Anda</label>
                <div className="mt-1 w-full bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 rounded-md p-3 text-sm text-slate-500">
                    {isLocating ? 'Mendeteksi lokasi...' : (location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : 'Lokasi tidak tersedia')}
                </div>
            </div>
            <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:bg-slate-400" disabled={isLocating || !location}>
                Kirim Pesanan Titipan
            </button>
        </form>
    );
};

const BottomNav: React.FC<{ page: CustomerPage, setPage: (page: CustomerPage) => void }> = ({ page, setPage }) => {
    const navItems = [
        { id: 'radar', label: 'Radar' },
        { id: 'ordering', label: 'Pesan' },
        { id: 'preorder', label: 'Titip Besok' },
    ];
    return (
        <nav className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2 p-2">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setPage(item.id as CustomerPage)}
                    className={`p-2 rounded-lg text-center transition-colors ${
                        page === item.id
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    <span className="text-xs font-semibold">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default CustomerView;
