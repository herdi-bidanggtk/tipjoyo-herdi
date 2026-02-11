
import type { Commodity, PreOrder, Merchant, RegisteredMerchant } from './types';

export const COMMODITIES: Commodity[] = [
  { id: 'chili', name: 'Cabai', price: 5500, stock: 20, unit: 'ons' },
  { id: 'onion', name: 'Bawang', price: 4000, stock: 30, unit: 'ons' },
  { id: 'chicken', name: 'Ayam', price: 35000, stock: 15, unit: 'kg' },
  { id: 'tempeh', name: 'Tempe', price: 5000, stock: 50, unit: 'papan' },
  { id: 'spinach', name: 'Bayam', price: 2500, stock: 40, unit: 'ikat' },
  { id: 'tofu', name: 'Tahu', price: 4000, stock: 60, unit: 'bungkus' },
];

export const PRE_ORDERS: PreOrder[] = [
  {
    id: 'po1',
    customerName: 'Ibu Retno',
    items: [
      { commodityName: 'Ayam', quantity: '1 kg' },
      { commodityName: 'Bawang', quantity: '1/4 kg' },
    ],
    status: 'pending',
    customerWhatsapp: '081234567890',
    customerLocation: { lat: -6.2088, lng: 106.8456 }
  },
  {
    id: 'po2',
    customerName: 'Bapak Budi',
    items: [{ commodityName: 'Tempe', quantity: '5 papan' }],
    status: 'pending',
    customerWhatsapp: '081234567891',
    customerLocation: { lat: -6.21, lng: 106.84 }
  },
  {
    id: 'po3',
    customerName: 'Mbak Siti',
    items: [
        { commodityName: 'Bayam', quantity: '3 ikat'},
        { commodityName: 'Cabai', quantity: '1 ons'},
    ],
    status: 'confirmed',
    customerWhatsapp: '081234567892',
    customerLocation: { lat: -6.205, lng: 106.85 }
  }
];

export const MERCHANTS: Merchant[] = [
    { id: 'm1', name: 'Pak Joyo', location: { lat: -6.2088, lng: 106.8456 }, eta: 5 },
    { id: 'm2', name: 'Bu Tini', location: { lat: -6.21, lng: 106.84 }, eta: 12 },
    { id: 'm3', name: 'Mas Agus', location: { lat: -6.205, lng: 106.85 }, eta: 18 },
];

export const REGISTERED_MERCHANTS: RegisteredMerchant[] = [
    { 
        id: 'm1', 
        name: 'Pak Joyo', 
        nik: '3301010101900001', 
        phone: '081234567890', 
        photoUrl: '', 
        ktpUrl: '', 
        address: 'Jl. Merdeka No. 10',
        district: 'Gambir',
        subdistrict: 'Cideng'
    },
    { 
        id: 'm2', 
        name: 'Bu Tini', 
        nik: '3301010101910002', 
        phone: '081234567891',
        photoUrl: '', 
        ktpUrl: '', 
        address: 'Jl. Pahlawan No. 25',
        district: 'Senen',
        subdistrict: 'Kwitang'
    },
];
