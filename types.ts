
export interface Commodity {
  id: string;
  name: string;
  price: number;
  stock: number; // in units or kg
  unit: string;
}

export interface PreOrder {
  id: string;
  customerName: string;
  items: { commodityName: string; quantity: string }[];
  status: 'pending' | 'confirmed' | 'completed';
  customerWhatsapp: string;
  customerLocation: { lat: number; lng: number } | null;
}

export interface Merchant {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  eta: number; // in minutes
}

export interface CartItem extends Commodity {
    quantity: number;
}

export interface RegisteredMerchant {
    id: string;
    name: string;
    nik: string;
    phone: string;
    photoUrl: string;
    ktpUrl: string;
    address: string;
    district: string; // Kecamatan
    subdistrict: string; // Kelurahan
}
