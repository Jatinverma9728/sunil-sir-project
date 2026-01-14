import { apiClient, ApiResponse } from './client';

// Helper function to wrap apiClient calls
const apiRequest = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.parse(options.body as string) : undefined;

    switch (method) {
        case 'POST':
            return apiClient.post<T>(endpoint, body, true);
        case 'PUT':
            return apiClient.put<T>(endpoint, body, true);
        case 'DELETE':
            return apiClient.delete<T>(endpoint, true);
        default:
            return apiClient.get<T>(endpoint, true);
    }
};

// ============================================
// TYPES
// ============================================

export interface Offer {
    _id: string;
    name: string;
    description?: string;
    type: 'flash_sale' | 'category_sale' | 'product_offer' | 'bundle_deal' | 'buy_x_get_y' | 'min_purchase';
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    minPurchase: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    excludedProducts?: string[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    priority: number;
    isActive: boolean;
    isStackable: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Coupon {
    _id: string;
    code: string;
    description?: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    maxDiscount?: number;
    minPurchase: number;
    applicableProducts?: string[];
    applicableCategories?: string[];
    startDate: string;
    endDate: string;
    usageLimit?: number;
    usedCount: number;
    perUserLimit: number;
    isActive: boolean;
    isFirstOrderOnly: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Banner {
    _id: string;
    title: string;
    subtitle?: string;
    image: string;
    mobileImage?: string;
    link?: string;
    buttonText: string;
    buttonLink?: string;
    position: 'hero' | 'sidebar' | 'popup' | 'footer' | 'category';
    backgroundColor: string;
    textColor: string;
    overlay: boolean;
    overlayOpacity: number;
    startDate: string;
    endDate?: string;
    priority: number;
    isActive: boolean;
    clickCount: number;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Announcement {
    _id: string;
    message: string;
    type: 'info' | 'sale' | 'promo' | 'warning' | 'shipping' | 'new';
    icon?: string;
    link?: string;
    linkText: string;
    backgroundColor: string;
    textColor: string;
    position: 'top' | 'bottom';
    isCloseable: boolean;
    isScrolling: boolean;
    startDate: string;
    endDate?: string;
    priority: number;
    isActive: boolean;
    showOnPages?: string[];
    createdAt: string;
    updatedAt: string;
}

export type OfferFormData = Omit<Offer, '_id' | 'usedCount' | 'createdAt' | 'updatedAt'>;
export type CouponFormData = Omit<Coupon, '_id' | 'usedCount' | 'createdAt' | 'updatedAt'>;
export type BannerFormData = Omit<Banner, '_id' | 'clickCount' | 'viewCount' | 'createdAt' | 'updatedAt'>;
export type AnnouncementFormData = Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>;

// ============================================
// ADMIN API - OFFERS
// ============================================

export const getAdminOffers = async (params?: {
    type?: string;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse<{ data: Offer[]; total: number; pages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/admin/offers?${queryParams.toString()}`);
};

export const createAdminOffer = async (data: OfferFormData): Promise<ApiResponse<Offer>> => {
    return apiRequest('/admin/offers', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateAdminOffer = async (id: string, data: Partial<OfferFormData>): Promise<ApiResponse<Offer>> => {
    return apiRequest(`/admin/offers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteAdminOffer = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/admin/offers/${id}`, { method: 'DELETE' });
};

// ============================================
// ADMIN API - COUPONS
// ============================================

export const getAdminCoupons = async (params?: {
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse<{ data: Coupon[]; total: number; pages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/admin/coupons?${queryParams.toString()}`);
};

export const createAdminCoupon = async (data: CouponFormData): Promise<ApiResponse<Coupon>> => {
    return apiRequest('/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateAdminCoupon = async (id: string, data: Partial<CouponFormData>): Promise<ApiResponse<Coupon>> => {
    return apiRequest(`/admin/coupons/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteAdminCoupon = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/admin/coupons/${id}`, { method: 'DELETE' });
};

export const generateCouponCode = async (length?: number): Promise<ApiResponse<{ code: string }>> => {
    return apiRequest('/admin/coupons/generate-code', {
        method: 'POST',
        body: JSON.stringify({ length }),
    });
};

// ============================================
// ADMIN API - BANNERS
// ============================================

export const getAdminBanners = async (params?: {
    position?: string;
    status?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse<{ data: Banner[]; total: number; pages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.position) queryParams.append('position', params.position);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/admin/banners?${queryParams.toString()}`);
};

export const createAdminBanner = async (data: BannerFormData): Promise<ApiResponse<Banner>> => {
    return apiRequest('/admin/banners', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateAdminBanner = async (id: string, data: Partial<BannerFormData>): Promise<ApiResponse<Banner>> => {
    return apiRequest(`/admin/banners/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteAdminBanner = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/admin/banners/${id}`, { method: 'DELETE' });
};

// ============================================
// ADMIN API - ANNOUNCEMENTS
// ============================================

export const getAdminAnnouncements = async (params?: {
    type?: string;
    status?: string;
    position?: string;
    page?: number;
    limit?: number;
}): Promise<ApiResponse<{ data: Announcement[]; total: number; pages: number }>> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.position) queryParams.append('position', params.position);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiRequest(`/admin/announcements?${queryParams.toString()}`);
};

export const createAdminAnnouncement = async (data: AnnouncementFormData): Promise<ApiResponse<Announcement>> => {
    return apiRequest('/admin/announcements', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateAdminAnnouncement = async (id: string, data: Partial<AnnouncementFormData>): Promise<ApiResponse<Announcement>> => {
    return apiRequest(`/admin/announcements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteAdminAnnouncement = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/admin/announcements/${id}`, { method: 'DELETE' });
};

// ============================================
// PUBLIC API
// ============================================

export const getActiveBanners = async (position: string = 'hero'): Promise<ApiResponse<Banner[]>> => {
    return apiRequest(`/banners?position=${position}`);
};

export const trackBannerClick = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/banners/${id}/click`, { method: 'POST' });
};

export const getActiveAnnouncements = async (position: string = 'top', page?: string): Promise<ApiResponse<Announcement[]>> => {
    const queryParams = new URLSearchParams({ position });
    if (page) queryParams.append('page', page);
    return apiRequest(`/announcements?${queryParams.toString()}`);
};

export const dismissAnnouncement = async (id: string): Promise<ApiResponse<void>> => {
    return apiRequest(`/announcements/${id}/dismiss`, { method: 'POST' });
};

export const getActiveOffers = async (): Promise<ApiResponse<Offer[]>> => {
    return apiRequest('/offers');
};

export const validateCoupon = async (code: string, cartTotal: number, cartItems?: unknown[]): Promise<ApiResponse<{
    code: string;
    discountType: string;
    discountValue: number;
    discount: number;
    message: string;
}>> => {
    return apiRequest('/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({ code, cartTotal, cartItems }),
    });
};

export const applyCoupon = async (code: string): Promise<ApiResponse<void>> => {
    return apiRequest('/coupons/apply', {
        method: 'POST',
        body: JSON.stringify({ code }),
    });
};
