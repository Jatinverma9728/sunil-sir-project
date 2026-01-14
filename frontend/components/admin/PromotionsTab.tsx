"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import {
    Offer, Coupon, Banner, Announcement,
    OfferFormData, CouponFormData, BannerFormData, AnnouncementFormData,
    getAdminOffers, createAdminOffer, updateAdminOffer, deleteAdminOffer,
    getAdminCoupons, createAdminCoupon, updateAdminCoupon, deleteAdminCoupon, generateCouponCode,
    getAdminBanners, createAdminBanner, updateAdminBanner, deleteAdminBanner,
    getAdminAnnouncements, createAdminAnnouncement, updateAdminAnnouncement, deleteAdminAnnouncement,
} from "@/lib/api/promotions";

type SubTab = "offers" | "coupons" | "banners" | "announcements";

export default function PromotionsTab() {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>("offers");
    const [loading, setLoading] = useState(false);

    // Offers state
    const [offers, setOffers] = useState<Offer[]>([]);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

    // Coupons state
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [showCouponModal, setShowCouponModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

    // Banners state
    const [banners, setBanners] = useState<Banner[]>([]);
    const [showBannerModal, setShowBannerModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    // Announcements state
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    // Fetch data based on active tab
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            switch (activeSubTab) {
                case "offers":
                    const offersRes = await getAdminOffers();
                    console.log("Offers response:", offersRes);
                    // Backend returns: { success, data: Offer[], total, pages }
                    // So offersRes is the full response, and offersRes.data is the array
                    if (offersRes.success) {
                        setOffers((offersRes as any).data || []);
                    }
                    break;
                case "coupons":
                    const couponsRes = await getAdminCoupons();
                    console.log("Coupons response:", couponsRes);
                    if (couponsRes.success) {
                        setCoupons((couponsRes as any).data || []);
                    }
                    break;
                case "banners":
                    const bannersRes = await getAdminBanners();
                    console.log("Banners response:", bannersRes);
                    if (bannersRes.success) {
                        setBanners((bannersRes as any).data || []);
                    }
                    break;
                case "announcements":
                    const announcementsRes = await getAdminAnnouncements();
                    console.log("Announcements response:", announcementsRes);
                    if (announcementsRes.success) {
                        setAnnouncements((announcementsRes as any).data || []);
                    }
                    break;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [activeSubTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Status badge helper
    const getStatusBadge = (startDate: string, endDate?: string | null, isActive?: boolean) => {
        if (!isActive) return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Inactive</span>;

        const now = new Date();
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        if (now < start) return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">Scheduled</span>;
        if (end && now > end) return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Expired</span>;
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">Active</span>;
    };

    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    // Delete handlers
    const handleDeleteOffer = async (id: string) => {
        if (!confirm("Delete this offer?")) return;
        const res = await deleteAdminOffer(id);
        if (res.success) fetchData();
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!confirm("Delete this coupon?")) return;
        const res = await deleteAdminCoupon(id);
        if (res.success) fetchData();
    };

    const handleDeleteBanner = async (id: string) => {
        if (!confirm("Delete this banner?")) return;
        const res = await deleteAdminBanner(id);
        if (res.success) fetchData();
    };

    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm("Delete this announcement?")) return;
        const res = await deleteAdminAnnouncement(id);
        if (res.success) fetchData();
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            {/* Sub-tabs */}
            <div className="flex border-b overflow-x-auto">
                {[
                    { key: "offers", label: "🎁 Offers", count: offers.length },
                    { key: "coupons", label: "🏷️ Coupons", count: coupons.length },
                    { key: "banners", label: "🖼️ Banners", count: banners.length },
                    { key: "announcements", label: "📢 Announcements", count: announcements.length },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveSubTab(tab.key as SubTab)}
                        className={`px-6 py-4 font-medium transition-colors whitespace-nowrap ${activeSubTab === tab.key
                            ? "border-b-2 border-black text-black"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                        {tab.count > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded-full">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    </div>
                ) : (
                    <>
                        {/* OFFERS TAB */}
                        {activeSubTab === "offers" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Offers & Sales</h3>
                                    <button
                                        onClick={() => { setEditingOffer(null); setShowOfferModal(true); }}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                    >
                                        + New Offer
                                    </button>
                                </div>
                                {offers.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500">No offers yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {offers.map((offer) => (
                                            <div key={offer._id} className="border rounded-lg p-4 flex justify-between items-center">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold">{offer.name}</span>
                                                        {getStatusBadge(offer.startDate, offer.endDate, offer.isActive)}
                                                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">{offer.type.replace('_', ' ')}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500">
                                                        {offer.discountType === 'percentage' ? `${offer.discountValue}% off` : `₹${offer.discountValue} off`}
                                                        {offer.minPurchase > 0 && ` • Min: ₹${offer.minPurchase}`}
                                                        {offer.maxDiscount && ` • Max: ₹${offer.maxDiscount}`}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                                                        {offer.usageLimit && ` • ${offer.usedCount}/${offer.usageLimit} used`}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingOffer(offer); setShowOfferModal(true); }}
                                                        className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOffer(offer._id)}
                                                        className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* COUPONS TAB */}
                        {activeSubTab === "coupons" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Coupon Codes</h3>
                                    <button
                                        onClick={() => { setEditingCoupon(null); setShowCouponModal(true); }}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                    >
                                        + New Coupon
                                    </button>
                                </div>
                                {coupons.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500">No coupons yet</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {coupons.map((coupon) => (
                                            <div key={coupon._id} className="border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-mono font-bold text-lg bg-black text-white px-3 py-1 rounded">{coupon.code}</span>
                                                    {getStatusBadge(coupon.startDate, coupon.endDate, coupon.isActive)}
                                                </div>
                                                <p className="text-2xl font-bold text-green-600 mb-1">
                                                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                                </p>
                                                {coupon.description && <p className="text-sm text-gray-500 mb-2">{coupon.description}</p>}
                                                <div className="text-xs text-gray-400 space-y-0.5">
                                                    {coupon.minPurchase > 0 && <p>Min purchase: ₹{coupon.minPurchase}</p>}
                                                    {coupon.usageLimit && <p>Used: {coupon.usedCount}/{coupon.usageLimit}</p>}
                                                    <p>Valid: {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}</p>
                                                </div>
                                                <div className="flex gap-2 mt-3 pt-3 border-t">
                                                    <button
                                                        onClick={() => { setEditingCoupon(coupon); setShowCouponModal(true); }}
                                                        className="flex-1 px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCoupon(coupon._id)}
                                                        className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* BANNERS TAB */}
                        {activeSubTab === "banners" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Homepage Banners</h3>
                                    <button
                                        onClick={() => { setEditingBanner(null); setShowBannerModal(true); }}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                    >
                                        + New Banner
                                    </button>
                                </div>
                                {banners.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500">No banners yet</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {banners.map((banner) => (
                                            <div key={banner._id} className="border rounded-xl overflow-hidden">
                                                <div className="relative h-40 bg-gray-100">
                                                    {banner.image && (
                                                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        {getStatusBadge(banner.startDate, banner.endDate, banner.isActive)}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-semibold">{banner.title}</h4>
                                                    {banner.subtitle && <p className="text-sm text-gray-500">{banner.subtitle}</p>}
                                                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                                        <span>📍 {banner.position}</span>
                                                        <span>👁️ {banner.viewCount} views</span>
                                                        <span>🖱️ {banner.clickCount} clicks</span>
                                                    </div>
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => { setEditingBanner(banner); setShowBannerModal(true); }}
                                                            className="flex-1 px-3 py-1.5 text-sm border rounded hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBanner(banner._id)}
                                                            className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ANNOUNCEMENTS TAB */}
                        {activeSubTab === "announcements" && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold">Announcement Bars</h3>
                                    <button
                                        onClick={() => { setEditingAnnouncement(null); setShowAnnouncementModal(true); }}
                                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                                    >
                                        + New Announcement
                                    </button>
                                </div>
                                {announcements.length === 0 ? (
                                    <p className="text-center py-8 text-gray-500">No announcements yet</p>
                                ) : (
                                    <div className="space-y-3">
                                        {announcements.map((announcement) => (
                                            <div
                                                key={announcement._id}
                                                className="border rounded-lg overflow-hidden"
                                            >
                                                <div
                                                    className="p-4 flex items-center gap-3"
                                                    style={{ backgroundColor: announcement.backgroundColor, color: announcement.textColor }}
                                                >
                                                    {announcement.icon && <span className="text-xl">{announcement.icon}</span>}
                                                    <span className="font-medium flex-1">{announcement.message}</span>
                                                    {announcement.link && <span className="text-sm underline">{announcement.linkText}</span>}
                                                </div>
                                                <div className="p-3 bg-white flex justify-between items-center">
                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        {getStatusBadge(announcement.startDate, announcement.endDate, announcement.isActive)}
                                                        <span>📍 {announcement.position}</span>
                                                        <span>🏷️ {announcement.type}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => { setEditingAnnouncement(announcement); setShowAnnouncementModal(true); }}
                                                            className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAnnouncement(announcement._id)}
                                                            className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODALS */}
            <Modal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} title={editingOffer ? "Edit Offer" : "Create Offer"} size="lg">
                <OfferForm
                    offer={editingOffer}
                    onSubmit={async (data) => {
                        const res = editingOffer
                            ? await updateAdminOffer(editingOffer._id, data)
                            : await createAdminOffer(data);
                        if (res.success) { setShowOfferModal(false); fetchData(); }
                        else alert(res.message);
                    }}
                    onCancel={() => setShowOfferModal(false)}
                />
            </Modal>

            <Modal isOpen={showCouponModal} onClose={() => setShowCouponModal(false)} title={editingCoupon ? "Edit Coupon" : "Create Coupon"}>
                <CouponForm
                    coupon={editingCoupon}
                    onSubmit={async (data) => {
                        const res = editingCoupon
                            ? await updateAdminCoupon(editingCoupon._id, data)
                            : await createAdminCoupon(data);
                        if (res.success) { setShowCouponModal(false); fetchData(); }
                        else alert(res.message);
                    }}
                    onCancel={() => setShowCouponModal(false)}
                />
            </Modal>

            <Modal isOpen={showBannerModal} onClose={() => setShowBannerModal(false)} title={editingBanner ? "Edit Banner" : "Create Banner"} size="lg">
                <BannerForm
                    banner={editingBanner}
                    onSubmit={async (data) => {
                        const res = editingBanner
                            ? await updateAdminBanner(editingBanner._id, data)
                            : await createAdminBanner(data);
                        if (res.success) { setShowBannerModal(false); fetchData(); }
                        else alert(res.message);
                    }}
                    onCancel={() => setShowBannerModal(false)}
                />
            </Modal>

            <Modal isOpen={showAnnouncementModal} onClose={() => setShowAnnouncementModal(false)} title={editingAnnouncement ? "Edit Announcement" : "Create Announcement"}>
                <AnnouncementForm
                    announcement={editingAnnouncement}
                    onSubmit={async (data) => {
                        const res = editingAnnouncement
                            ? await updateAdminAnnouncement(editingAnnouncement._id, data)
                            : await createAdminAnnouncement(data);
                        if (res.success) { setShowAnnouncementModal(false); fetchData(); }
                        else alert(res.message);
                    }}
                    onCancel={() => setShowAnnouncementModal(false)}
                />
            </Modal>
        </div>
    );
}

// ============================================
// FORM COMPONENTS
// ============================================

function OfferForm({ offer, onSubmit, onCancel }: { offer: Offer | null; onSubmit: (data: OfferFormData) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState<OfferFormData>({
        name: offer?.name || "",
        description: offer?.description || "",
        type: offer?.type || "flash_sale",
        discountType: offer?.discountType || "percentage",
        discountValue: offer?.discountValue || 10,
        maxDiscount: offer?.maxDiscount || undefined,
        minPurchase: offer?.minPurchase || 0,
        applicableProducts: offer?.applicableProducts || [],
        applicableCategories: offer?.applicableCategories || [],
        excludedProducts: offer?.excludedProducts || [],
        startDate: offer?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: offer?.endDate?.split('T')[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: offer?.priority || 0,
        isActive: offer?.isActive ?? true,
        isStackable: offer?.isStackable ?? false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Offer Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" rows={2} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Offer Type *</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as OfferFormData['type'] })}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="flash_sale">⚡ Flash Sale</option>
                        <option value="category_sale">📁 Category Sale</option>
                        <option value="product_offer">🎁 Product Offer</option>
                        <option value="bundle_deal">📦 Bundle Deal</option>
                        <option value="min_purchase">💰 Min. Purchase</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Discount Type *</label>
                    <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Discount Value *</label>
                    <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                    <input type="number" value={formData.maxDiscount || ""} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Min Purchase (₹)</label>
                    <input type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <input type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isStackable} onChange={(e) => setFormData({ ...formData, isStackable: e.target.checked })} />
                    <span className="text-sm">Stackable with other offers</span>
                </label>
            </div>
            <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={submitting} className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {submitting ? "Saving..." : offer ? "Update Offer" : "Create Offer"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
        </form>
    );
}

function CouponForm({ coupon, onSubmit, onCancel }: { coupon: Coupon | null; onSubmit: (data: CouponFormData) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState<CouponFormData>({
        code: coupon?.code || "",
        description: coupon?.description || "",
        discountType: coupon?.discountType || "percentage",
        discountValue: coupon?.discountValue || 10,
        maxDiscount: coupon?.maxDiscount || undefined,
        minPurchase: coupon?.minPurchase || 0,
        applicableProducts: coupon?.applicableProducts || [],
        applicableCategories: coupon?.applicableCategories || [],
        startDate: coupon?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: coupon?.endDate?.split('T')[0] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        usageLimit: coupon?.usageLimit || undefined,
        perUserLimit: coupon?.perUserLimit || 1,
        isActive: coupon?.isActive ?? true,
        isFirstOrderOnly: coupon?.isFirstOrderOnly ?? false,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleGenerateCode = async () => {
        const res = await generateCouponCode(8);
        if (res.success && res.data) setFormData({ ...formData, code: res.data.code });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Coupon Code *</label>
                <div className="flex gap-2">
                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        className="flex-1 px-3 py-2 border rounded-lg font-mono" required placeholder="SAVE20" />
                    <button type="button" onClick={handleGenerateCode} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">🎲 Generate</button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" placeholder="Save 20% on your order" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Discount Type *</label>
                    <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Discount Value *</label>
                    <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Min Purchase (₹)</label>
                    <input type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                    <input type="number" value={formData.maxDiscount || ""} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border rounded-lg" min={0} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Usage Limit</label>
                    <input type="number" value={formData.usageLimit || ""} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-full px-3 py-2 border rounded-lg" min={1} placeholder="Unlimited" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Per User Limit</label>
                    <input type="number" value={formData.perUserLimit} onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" min={1} />
                </div>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isFirstOrderOnly} onChange={(e) => setFormData({ ...formData, isFirstOrderOnly: e.target.checked })} />
                    <span className="text-sm">First order only</span>
                </label>
            </div>
            <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={submitting} className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {submitting ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
        </form>
    );
}

function BannerForm({ banner, onSubmit, onCancel }: { banner: Banner | null; onSubmit: (data: BannerFormData) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState<BannerFormData>({
        title: banner?.title || "",
        subtitle: banner?.subtitle || "",
        image: banner?.image || "",
        mobileImage: banner?.mobileImage || "",
        link: banner?.link || "",
        buttonText: banner?.buttonText || "Shop Now",
        buttonLink: banner?.buttonLink || "",
        position: banner?.position || "hero",
        backgroundColor: banner?.backgroundColor || "#000000",
        textColor: banner?.textColor || "#ffffff",
        overlay: banner?.overlay ?? true,
        overlayOpacity: banner?.overlayOpacity ?? 0.3,
        startDate: banner?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: banner?.endDate?.split('T')[0] || "",
        priority: banner?.priority || 0,
        isActive: banner?.isActive ?? true,
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <input type="text" value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Image URL *</label>
                    <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" required placeholder="https://..." />
                    {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-24 object-cover rounded" />}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Position</label>
                    <select value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value as BannerFormData['position'] })}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="hero">Hero (Homepage)</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="popup">Popup</option>
                        <option value="footer">Footer</option>
                        <option value="category">Category Page</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Button Text</label>
                    <input type="text" value={formData.buttonText} onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Link URL</label>
                    <input type="url" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="/products" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <input type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                    <input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
            </div>
            <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                <span className="text-sm">Active</span>
            </label>
            <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={submitting} className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {submitting ? "Saving..." : banner ? "Update Banner" : "Create Banner"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
        </form>
    );
}

function AnnouncementForm({ announcement, onSubmit, onCancel }: { announcement: Announcement | null; onSubmit: (data: AnnouncementFormData) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState<AnnouncementFormData>({
        message: announcement?.message || "",
        type: announcement?.type || "sale",
        icon: announcement?.icon || "🔥",
        link: announcement?.link || "",
        linkText: announcement?.linkText || "Learn More",
        backgroundColor: announcement?.backgroundColor || "#000000",
        textColor: announcement?.textColor || "#ffffff",
        position: announcement?.position || "top",
        isCloseable: announcement?.isCloseable ?? true,
        isScrolling: announcement?.isScrolling ?? false,
        startDate: announcement?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
        endDate: announcement?.endDate?.split('T')[0] || "",
        priority: announcement?.priority || 0,
        isActive: announcement?.isActive ?? true,
        showOnPages: announcement?.showOnPages || [],
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await onSubmit(formData);
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Message *</label>
                <input type="text" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg" required placeholder="🔥 Flash Sale - 50% OFF Everything!" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as AnnouncementFormData['type'] })}
                        className="w-full px-3 py-2 border rounded-lg">
                        <option value="sale">🏷️ Sale</option>
                        <option value="promo">🎁 Promo</option>
                        <option value="shipping">📦 Shipping</option>
                        <option value="info">ℹ️ Info</option>
                        <option value="warning">⚠️ Warning</option>
                        <option value="new">✨ New</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                    <input type="text" value={formData.icon || ""} onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="🔥" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Background Color</label>
                    <input type="color" value={formData.backgroundColor} onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="w-full h-10 border rounded-lg cursor-pointer" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Text Color</label>
                    <input type="color" value={formData.textColor} onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-full h-10 border rounded-lg cursor-pointer" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Link URL</label>
                    <input type="text" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" placeholder="/products" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Link Text</label>
                    <input type="text" value={formData.linkText} onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">End Date (Optional)</label>
                    <input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg" />
                </div>
            </div>
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isCloseable} onChange={(e) => setFormData({ ...formData, isCloseable: e.target.checked })} />
                    <span className="text-sm">Closeable</span>
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={formData.isScrolling} onChange={(e) => setFormData({ ...formData, isScrolling: e.target.checked })} />
                    <span className="text-sm">Scrolling</span>
                </label>
            </div>
            {/* Preview */}
            <div className="p-3 rounded-lg text-center" style={{ backgroundColor: formData.backgroundColor, color: formData.textColor }}>
                {formData.icon} {formData.message} {formData.link && <span className="underline ml-2">{formData.linkText}</span>}
            </div>
            <div className="flex gap-3 pt-4 border-t">
                <button type="submit" disabled={submitting} className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
                    {submitting ? "Saving..." : announcement ? "Update" : "Create"}
                </button>
                <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
        </form>
    );
}
