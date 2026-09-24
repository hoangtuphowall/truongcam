import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Bike,
  Plus,
  Minus,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { CanteenItem } from '../types';
import { INITIAL_CANTEEN_MENU } from '../data/initialData';

interface CamCanteenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (itemText: string) => void;
}

export const CamCanteenModal: React.FC<CamCanteenModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const [activeTab, setActiveTab] = useState<'canteen' | 'ride'>('canteen');
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [destination, setDestination] = useState('Xã Cẩm Bình, Cẩm Xuyên');
  const [rideType, setRideType] = useState<'bike' | 'bus' | 'car'>('bike');
  const [orderDoneAlert, setOrderDoneAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['Tất cả', 'Ăn sáng', 'Đồ uống', 'Ăn vặt', 'Dụng cụ học tập'];

  const filteredItems = INITIAL_CANTEEN_MENU.filter(
    (item) => selectedCategory === 'Tất cả' || item.category === selectedCategory
  );

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) {
        next[id] -= 1;
      } else {
        delete next[id];
      }
      return next;
    });
  };

  const totalCartPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = INITIAL_CANTEEN_MENU.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalCartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const handleCheckoutCanteen = () => {
    if (totalCartCount === 0) return;
    setOrderDoneAlert(`Đã đặt thành công ${totalCartCount} món tại Căng-tin THPT Cẩm Bình! Nhận món vào giờ ra chơi nha 🥪🧋`);
    onOrderSuccess(`Căng-tin: ${totalCartCount} món đang chuẩn bị`);
    setCart({});
    setTimeout(() => {
      setOrderDoneAlert(null);
      onClose();
    }, 2500);
  };

  const handleBookRide = () => {
    setOrderDoneAlert(`Tài xế Cẩm Ride (Bác Hùng - Wave Alpha) đang tới cổng trường đón bạn về ${destination}! 🛵`);
    onOrderSuccess(`Cẩm Ride: Đang tới cổng trường`);
    setTimeout(() => {
      setOrderDoneAlert(null);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-2xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl h-[90vh] max-h-[720px] liquid-glass rounded-[36px] shadow-2xl border border-white/35 text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 px-5 border-b border-white/15 flex items-center justify-between liquid-glass-subtle shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[22%] bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-lg">
              {activeTab === 'canteen' ? <ShoppingBag className="w-5 h-5" /> : <Bike className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-bold text-white">
                  {activeTab === 'canteen' ? 'Căng-tin Cẩm Bình' : 'Cẩm Ride'}
                </h2>
              </div>
              <p className="text-[11px] text-white/60">
                {activeTab === 'canteen' ? 'Đặt trước đồ ăn giờ ra chơi không lo hết' : 'Xe ôm & xe buýt đưa đón học sinh an toàn'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Transparent Liquid Glass Tab switch: Căng-tin & Cẩm Ride */}
        <div className="p-2.5 px-5 border-b border-white/10 flex justify-center shrink-0">
          <div className="ios-toggle-menu w-full max-w-md">
            <button
              onClick={() => setActiveTab('canteen')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'canteen' ? 'ios-toggle-active' : ''}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Căng-tin Học Sinh</span>
            </button>
            <button
              onClick={() => setActiveTab('ride')}
              className={`ios-toggle-item flex-1 justify-center ${activeTab === 'ride' ? 'ios-toggle-active' : ''}`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Cẩm Ride (Xe Đưa Đón)</span>
            </button>
          </div>
        </div>

        {/* Order success notification */}
        {orderDoneAlert && (
          <div className="m-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in zoom-in-95 shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{orderDoneAlert}</span>
          </div>
        )}

        {/* Tab 1: Canteen Menu */}
        {activeTab === 'canteen' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Category pills: Transparent iOS Toggle Menu */}
            <div className="p-2.5 px-4 flex justify-center overflow-x-auto no-scrollbar shrink-0">
              <div className="ios-toggle-menu">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`ios-toggle-item ${selectedCategory === cat ? 'ios-toggle-active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu List */}
            <div className="flex-1 p-4 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 no-scrollbar">
              {filteredItems.map((item) => {
                const inCart = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="liquid-glass-subtle rounded-3xl p-3.5 border border-white/15 flex items-center justify-between gap-3 shadow-md hover:border-amber-400/40 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0 overflow-hidden border border-white/15">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.emoji
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          {item.popular && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 font-bold">
                              Hot
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">
                          {item.price.toLocaleString('vi-VN')} đ
                        </div>
                        <div className="text-[10px] text-white/40 mt-0.5">
                          ⭐ {item.rating} · Đã bán {item.sold}
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Stepper */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {inCart > 0 && (
                        <>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1">{inCart}</span>
                        </>
                      )}
                      <button
                        onClick={() => addToCart(item.id)}
                        className="w-7 h-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold flex items-center justify-center shadow"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Footer */}
            {totalCartCount > 0 && (
              <div className="p-3.5 px-5 liquid-glass-subtle border-t border-white/20 flex items-center justify-between gap-4 shrink-0 animate-in slide-in-from-bottom-4">
                <div>
                  <div className="text-[11px] text-white/60">
                    Giỏ hàng: <span className="font-bold text-white">{totalCartCount} món</span>
                  </div>
                  <div className="text-base font-black text-amber-300 font-mono">
                    {totalCartPrice.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                <button
                  onClick={handleCheckoutCanteen}
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:scale-105 active:scale-95 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Đặt Món Ngay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Tab 2: Cẩm Ride */
          <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 no-scrollbar">
            {/* Route Selector */}
            <div className="liquid-glass-subtle rounded-3xl p-4 border border-white/15 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
                <div className="flex-1">
                  <div className="text-[10px] text-white/50">Điểm đón</div>
                  <div className="text-xs font-bold text-white">Cổng trường THPT Cẩm Bình (Quốc Lộ 1A)</div>
                </div>
              </div>

              <div className="w-0.5 h-4 bg-white/20 ml-1.5" />

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-rose-400" />
                <div className="flex-1">
                  <div className="text-[10px] text-white/50">Điểm đến (Xã/Thị trấn)</div>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none mt-0.5"
                  >
                    <option value="Xã Cẩm Bình, Cẩm Xuyên">Xã Cẩm Bình, Cẩm Xuyên (Gần trường)</option>
                    <option value="Xã Cẩm Vịnh, Cẩm Xuyên">Xã Cẩm Vịnh, Cẩm Xuyên (3.5 km)</option>
                    <option value="Xã Cẩm Quang, Cẩm Xuyên">Xã Cẩm Quang, Cẩm Xuyên (4.2 km)</option>
                    <option value="Xã Cẩm Thành, Cẩm Xuyên">Xã Cẩm Thành, Cẩm Xuyên (5.0 km)</option>
                    <option value="Thị trấn Cẩm Xuyên">Thị trấn Cẩm Xuyên (6.5 km)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vehicle Options */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-bold text-white/70 px-1">Chọn phương tiện</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bike', name: 'CẩmBike', desc: 'Xe ôm học sinh', price: 12000, icon: '🛵' },
                  { id: 'bus', name: 'CẩmBus', desc: 'Xe buýt trường', price: 7000, icon: '🚌' },
                  { id: 'car', name: 'CẩmCar', desc: 'Xe 4 chỗ ghép', price: 35000, icon: '🚗' }
                ].map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setRideType(v.id as any)}
                    className={`p-3 rounded-2xl liquid-glass-subtle border cursor-pointer flex flex-col justify-between transition-all ${
                      rideType === v.id ? 'border-emerald-400/80 bg-emerald-500/20 shadow-md' : 'border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-2xl mb-1">{v.icon}</div>
                    <div>
                      <div className="text-xs font-bold text-white">{v.name}</div>
                      <div className="text-[10px] text-white/50">{v.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-emerald-300 mt-2">
                      {v.price.toLocaleString('vi-VN')} đ
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Book button */}
            <button
              onClick={handleBookRide}
              className="mt-auto py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bike className="w-4 h-4" />
              <span>Đặt Xe Đón Cổng Trường Cẩm Bình</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
