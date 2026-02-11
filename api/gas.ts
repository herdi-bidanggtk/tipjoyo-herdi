
import { COMMODITIES, PRE_ORDERS, MERCHANTS, REGISTERED_MERCHANTS } from '../constants';
import type { RegisteredMerchant, Commodity, PreOrder } from '../types';

// This is a simulation of a backend living in memory
// In a real scenario, this would make fetch calls to a Google Apps Script Web App URL

let mockRegisteredMerchants: RegisteredMerchant[] = REGISTERED_MERCHANTS;
let mockCommodities: Commodity[] = COMMODITIES;
let mockPreOrders: PreOrder[] = PRE_ORDERS;

export const api = {
    doGet: async (action: string, params?: any): Promise<any> => {
        console.log(`API GET: ${action}`, params);
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        switch (action) {
            case 'getMerchants':
                return mockRegisteredMerchants;
            case 'verifyMerchant':
                if (!params || !params.nik || !params.phone) return null;
                return mockRegisteredMerchants.find(m => m.nik === params.nik && m.phone === params.phone) || null;
            case 'getStock':
                // For now, all merchants have the same stock
                return mockCommodities;
             case 'getPreOrders':
                return mockPreOrders;
            default:
                return null;
        }
    },

    doPost: async (action: string, payload: any): Promise<{success: boolean; data?: any; message?: string}> => {
        console.log(`API POST: ${action}`, payload);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        switch (action) {
            case 'addMerchant':
                const existing = mockRegisteredMerchants.find(m => m.nik === payload.nik || m.phone === payload.phone);
                if (existing) {
                    return { success: false, message: 'NIK atau No. HP sudah terdaftar.' };
                }
                const newMerchant: RegisteredMerchant = {
                    id: `m${Date.now()}`,
                    ...payload,
                };
                mockRegisteredMerchants = [...mockRegisteredMerchants, newMerchant];
                return { success: true, data: newMerchant };
            
            case 'updateStock':
                // Assuming payload is the entire new stock array
                mockCommodities = payload.stockData;
                return { success: true, data: mockCommodities };

            case 'updatePreOrderStatus':
                mockPreOrders = mockPreOrders.map(o => o.id === payload.id ? {...o, status: payload.status} : o);
                return { success: true, data: mockPreOrders.find(o => o.id === payload.id) };

            default:
                return { success: false, message: 'Action not found' };
        }
    }
};
