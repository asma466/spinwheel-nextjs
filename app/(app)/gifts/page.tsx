// 'use client';
// import { useState, useMemo, useEffect } from 'react';
// import { Plus, Edit2, Trash2, Gift, Package, CheckCircle, XCircle } from 'lucide-react';
// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { ConfirmDialog } from '@/src/component/common/ConfirmDialog';
// import { EmptyState } from '@/src/component/common/EmptyState';
// import { StatusBadge } from '@/src/component/common/StatusBadge';
// import { GiftModal } from '@/src/component/gifts/Gift-Modal';

// import { Gift as GiftType } from '@/src/types/index';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { BirthdaySpinwheelLoader } from '@/src/component/common/Loader';
// import { useCreateGift, useDeleteGift, useGifts, useUpdateGift } from '@/src/hooks/useGift';

// // Spinwheel prizes
// const SPINWHEEL_PRIZES = [
//   {
//     id: '1',
//     name: 'Planter',
//     quantity: 5,
//     category: 'Home & Garden',
//     available: true,
//   },
//   {
//     id: '2',
//     name: 'Scented Candles',
//     quantity: 8,
//     category: 'Home & Living',
//     available: true,
//   },
//   {
//     id: '3',
//     name: 'Fidget Toys',
//     quantity: 10,
//     category: 'Toys & Games',
//     available: true,
//   },
//   {
//     id: '4',
//     name: 'Vase',
//     quantity: 6,
//     category: 'Home & Garden',
//     available: true,
//   },
//   {
//     id: '5',
//     name: 'Table Lamp',
//     quantity: 3,
//     category: 'Office & Lighting',
//     available: true,
//   },
//   {
//     id: '6',
//     name: 'Photo Frame',
//     quantity: 7,
//     category: 'Home & Living',
//     available: true,
//   },
// ];

// export default function Gifts() {
//   // const [gifts, setGifts] = useState<GiftType[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
//   const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   // const [deleteGift, setDeleteGift] = useState<GiftType | null>(null);
//   const { data: gifts, isLoading } = useGifts();
//   const createGift = useCreateGift();
//   const updateGift = useUpdateGift();
//   const deleteGift = useDeleteGift();
//   const categories = useMemo(() => {
//     return [...new Set(gifts.map(g => g.category))];
//   }, [gifts]);

//   const filteredGifts = useMemo(() => {
//     let filtered = gifts;

//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(gift =>
//         gift.name.toLowerCase().includes(query) ||
//         gift.quantity.toString().includes(query) ||
//         gift.category.toLowerCase().includes(query)
//       );
//     }

//     if (filterAvailability === 'available') {
//       filtered = filtered.filter(g => g.available);
//     } else if (filterAvailability === 'unavailable') {
//       filtered = filtered.filter(g => !g.available);
//     }

//     return filtered;
//   }, [gifts, searchQuery, filterAvailability]);

//   const handleCreateGift = () => {
//     setSelectedGift(null);
//     setIsModalOpen(true);
//   };

//   const handleEditGift = (gift: GiftType) => {
//     setSelectedGift(gift);
//     setIsModalOpen(true);
//   };

//   // const handleSaveGift = (giftData: Omit<GiftType, 'id'>) => 
//   //   if (selectedGift) {
//   //     setGifts(prev => prev.map(g =>
//   //       g.id === selectedGift.id ? { ...giftData, id: g.id } : g
//   //     ));
//   //   } else {
//   //     const newGift: GiftType = {
//   //       ...giftData,
//   //       id: Date.now().toString(),
//   //     };
//   //     setGifts(prev => [...prev, newGift]);
//   //   }
//   //   setIsModalOpen(false);
//   // };

// // const handleSaveGift = async (giftData: Omit<GiftType, 'id'>) => {
// //   try {
// //     let savedGift: GiftType;

// //     if (selectedGift) {
// //       // Update existing gift
// //       const res = await fetch(`/api/gifts/${selectedGift.id}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(giftData),
// //       });
// //       const json = await res.json();
// //       if (!json.success) throw new Error(json.error);
// //       savedGift = json.data;

// //       // REPLACE the old gift with updated gift
// //       setGifts(prev => prev.map(g => g.id === savedGift.id ? savedGift : g));
// //     } else {
// //       // Create new gift
// //       const res = await fetch(`/api/gifts`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(giftData),
// //       });
// //       const json = await res.json();
// //       if (!json.success) throw new Error(json.error);
// //       savedGift = json.data;

// //       // ADD the new gift
// //       setGifts(prev => [...prev, savedGift]);
// //     }

// //     setIsModalOpen(false);
// //   } catch (err) {
// //     console.error('Failed to save gift:', err);
// //   }
// // };
//   const handleToggleAvailability = (gift: GiftType) => {
//     setGifts(prev => prev.map(g =>
//       g.id === gift.id ? { ...g, available: !g.available } : g
//     ));
//   };



//   const handleSaveGift = async (giftData: any) => {
//     if (selectedGift) {
//       await updateGift.mutateAsync({ id: selectedGift.id, giftData });
//     } else {
//       await createGift.mutateAsync(giftData);
//     }
//     setIsModalOpen(false);
//   };

//   if (isLoading) return <BirthdaySpinwheelLoader />;

// //   useEffect(() => {
// //   const fetchGifts = async () => {
// //     try {
// //       const res = await fetch('/api/gifts');
// //       const json = await res.json();
// //       if (json.success) setGifts(json.data);
// //     } catch (err) {
// //       console.error('Failed to fetch gifts:', err);
// //     }
// //   };
// //   fetchGifts();
// // }, []);
//   // const handleDeleteConfirm = () => {
//   //   if (deleteGift) {
//   //     setGifts(prev => prev.filter(g => g.id !== deleteGift.id));
//   //     setDeleteGift(null);
//   //   }
//   // };

//   const availableCount = gifts.filter(g => g.quantity > 0 && g.available).length;

//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Gift Management"
//         subtitle={`${availableCount} of ${gifts.length} gifts available for birthday wheel`}
//         actions={
//           <Button onClick={handleCreateGift}  className="bg-[#CE1B22] text-white hover:bg-[#b0171d]">
//             <Plus className="w-4 h-4" />
//             Add Gift
//           </Button>
//         }
//       />

//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <SearchInput
//             value={searchQuery}
//             onChange={setSearchQuery}
//             placeholder="Search gifts by name, description, or category..."
//           />
//         </div>
//         <Select value={filterAvailability} onValueChange={(v) => setFilterAvailability(v as typeof filterAvailability)}>
//           <SelectTrigger className="w-full sm:w-48 bg-background">
//             <SelectValue placeholder="Filter availability" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover z-50">
//             <SelectItem value="all">All Gifts</SelectItem>
//             <SelectItem value="available">Available Only</SelectItem>
//             <SelectItem value="unavailable">Unavailable Only</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

// {isLoading ? (
//   <BirthdaySpinwheelLoader />
// ) : filteredGifts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredGifts.map((gift) => (
//             <div
//               key={gift.id}
//               className="bg-card rounded-xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-all duration-200"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-3 rounded-xl ${gift.available ? 'bg-success/10' : 'bg-muted'}`}>
//                     <Gift className={`w-5 h-5 ${gift.available ? 'text-success' : 'text-muted-foreground'}`} />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">{gift.name}</h3>
//                     <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
//                       {gift.category}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleEditGift(gift)}
//                     className="text-muted-foreground hover:text-foreground"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setDeleteGift(gift)}
//                     className="text-muted-foreground hover:text-destructive"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="mb-4 p-3 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Quantity Available:</span>
//                   <span className={`text-lg font-semibold ${gift.quantity === 0 ? 'text-destructive' : 'text-success'}`}>
//                     {gift.quantity}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <StatusBadge status={gift.quantity > 0 && gift.available ? 'success' : 'error'}>
//                   {gift.quantity > 0 && gift.available ? (
//                     <>
//                       <CheckCircle className="w-3 h-3 mr-1" />
//                       Available
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="w-3 h-3 mr-1" />
//                       Unavailable
//                     </>
//                   )}
//                 </StatusBadge>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleToggleAvailability(gift)}
//                   className="text-xs"
//                 >
//                   {gift.available ? 'Mark Unavailable' : 'Mark Available'}
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <EmptyState
//           icon={Package}
//           title="No gifts found"
//           description={searchQuery ? 'Try adjusting your search query' : 'Add gifts that employees can win on their birthday'}
//           action={!searchQuery ? { label: 'Add Gift', onClick: handleCreateGift } : undefined}
//         />
//       )
//     }

//       <GiftModal
//         open={isModalOpen}
//         onOpenChange={setIsModalOpen}
//         gift={selectedGift}
//         onSave={handleSaveGift}
//         categories={categories}
//       />

//       <ConfirmDialog
//         open={!!deleteGift}
//         onOpenChange={(open) => !open && setDeleteGift(null)}
//         title="Delete Gift"
//         description={`Are you sure you want to delete "${deleteGift?.name}"? This action cannot be undone.`}
//         confirmLabel="Delete"
//         variant="destructive"
//         onConfirm={handleDeleteConfirm}
//       />
//     </DashboardLayout>
//   );
// }



// 'use client';
// import { useState, useMemo } from 'react';
// import { Plus, Edit2, Trash2, Gift, Package, CheckCircle, XCircle } from 'lucide-react';
// import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
// import { PageHeader } from '@/src/component/common/PageHeader';
// import { SearchInput } from '@/src/component/common/SearchInput';
// import { ConfirmDialog } from '@/src/component/common/ConfirmDialog';
// import { EmptyState } from '@/src/component/common/EmptyState';
// import { StatusBadge } from '@/src/component/common/StatusBadge';
// import { GiftModal } from '@/src/component/gifts/Gift-Modal';
// import { BirthdaySpinwheelLoader } from '@/src/component/common/Loader';
// import { useGifts, useCreateGift, useUpdateGift, useDeleteGift } from '@/src/hooks/useGift';
// import { Gift as GiftType } from '@/src/types/index';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

// export default function Gifts() {

//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
//   const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [deleteGift, setDeleteGift] = useState<GiftType | null>(null);
//   const { data: gifts = [], isLoading } = useGifts()
//   // const { data: gifts = [], isLoading } = useGifts();
//   const createGift = useCreateGift();
//   const updateGift = useUpdateGift();
//   const removeGift = useDeleteGift();

//   const categories = useMemo(() => [...new Set(gifts.map(g => g.category))], [gifts]);


//   // const { data: giftsData, isLoading } = useGifts();

//   // const gifts: GiftType[] = giftsData || [];
//   const filteredGifts = useMemo(() => {
//     let filtered = gifts;
//     if (searchQuery) {
//       const q = searchQuery.toLowerCase();
//       filtered = filtered.filter(g => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q) || g.quantity.toString().includes(q));
//     }
//     if (filterAvailability === 'available') filtered = filtered.filter(g => g.available);
//     if (filterAvailability === 'unavailable') filtered = filtered.filter(g => !g.available);
//     return filtered;
//   }, [gifts, searchQuery, filterAvailability]);

//   const handleCreateGift = () => {
//     setSelectedGift(null);
//     setIsModalOpen(true);
//   };

//   const handleEditGift = (gift: GiftType) => {
//     setSelectedGift(gift);
//     setIsModalOpen(true);
//   };

//   const handleSaveGift = async (giftData: Omit<GiftType, 'id'>) => {
//     try {
//       if (selectedGift) {
//         await updateGift.mutateAsync({ id: selectedGift.id, giftData });
//       } else {
//         await createGift.mutateAsync(giftData);
//       }
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error('Failed to save gift:', err);
//     }
//   };

//   // const handleToggleAvailability = async (gift: GiftType) => {
//   //   try {
//   //     await updateGift.mutateAsync({ id: gift.id, giftData: { ...gift, available: !gift.available } });
//   //   } catch (err) {
//   //     console.error('Failed to toggle availability:', err);
//   //   }
//   // };

//   const handleToggleAvailability = async (gift: GiftType) => {
//     try {
//       const { id, ...rest } = gift

//       await updateGift.mutateAsync({
//         id,
//         giftData: { ...rest, available: !gift.available },
//       })
//     } catch (err) {
//       console.error('Failed to toggle availability:', err)
//     }
//   }

//   const handleDeleteConfirm = async () => {
//     if (!deleteGift) return;
//     try {
//       await removeGift.mutateAsync(deleteGift.id);
//       setDeleteGift(null);
//     } catch (err) {
//       console.error('Failed to delete gift:', err);
//     }
//   };

//   // const availableCount = gifts.filter(g => g.quantity > 0 && g.available).length;
//   const availableCount = useMemo(
//     () => gifts.filter(g => g.quantity > 0 && g.available).length,
//     [gifts]
//   )

//   // if (isLoading) return <BirthdaySpinwheelLoader />;

//   return (
//     <DashboardLayout>
//       <PageHeader
//         title="Gift Management"
//         subtitle={`${availableCount} of ${gifts.length} gifts available for birthday wheel`}
//         actions={
//           <Button onClick={handleCreateGift} className="bg-[#CE1B22] text-white hover:bg-[#b0171d]">
//             <Plus className="w-4 h-4" />
//             Add Gift
//           </Button>
//         }
//       />

//       <div className="flex flex-col sm:flex-row gap-4 mb-6">
//         <div className="flex-1">
//           <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search gifts by name, description, or category..." />
//         </div>
//         <Select value={filterAvailability} onValueChange={(v) => setFilterAvailability(v as typeof filterAvailability)}>
//           <SelectTrigger className="w-full sm:w-48 bg-background">
//             <SelectValue placeholder="Filter availability" />
//           </SelectTrigger>
//           <SelectContent className="bg-popover z-50">
//             <SelectItem value="all">All Gifts</SelectItem>
//             <SelectItem value="available">Available Only</SelectItem>
//             <SelectItem value="unavailable">Unavailable Only</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {isLoading ? (
//         <div className="flex justify-center items-center h-[300px]">
//           <BirthdaySpinwheelLoader />
//         </div>
//       ) : filteredGifts.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredGifts.map((gift) => (
//             <div key={gift.id} className="bg-card rounded-xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-all duration-200">
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className={`p-3 rounded-xl ${gift.available ? 'bg-success/10' : 'bg-muted'}`}>
//                     <Gift className={`w-5 h-5 ${gift.available ? 'text-success' : 'text-muted-foreground'}`} />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-foreground">{gift.name}</h3>
//                     <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{gift.category}</span>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <Button variant="ghost" size="sm" onClick={() => handleEditGift(gift)} className="text-muted-foreground hover:text-foreground">
//                     <Edit2 className="w-4 h-4" />
//                   </Button>
//                   <Button variant="ghost" size="sm" onClick={() => setDeleteGift(gift)} className="text-muted-foreground hover:text-destructive">
//                     <Trash2 className="w-4 h-4" />
//                   </Button>
//                 </div>
//               </div>

//               <div className="mb-4 p-3 bg-muted/50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Quantity Available:</span>
//                   <span className={`text-lg font-semibold ${gift.quantity === 0 ? 'text-destructive' : 'text-success'}`}>{gift.quantity}</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <StatusBadge status={gift.quantity > 0 && gift.available ? 'success' : 'error'}>
//                   {gift.quantity > 0 && gift.available ? (
//                     <>
//                       <CheckCircle className="w-3 h-3 mr-1" />
//                       Available
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="w-3 h-3 mr-1" />
//                       Unavailable
//                     </>
//                   )}
//                 </StatusBadge>
//                 <Button variant="outline" size="sm" onClick={() => handleToggleAvailability(gift)} className="text-xs">
//                   {gift.available ? 'Mark Unavailable' : 'Mark Available'}
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <EmptyState
//           icon={Package}
//           title="No gifts found"
//           description={searchQuery ? 'Try adjusting your search query' : 'Add gifts that employees can win on their birthday'}
//           action={!searchQuery ? { label: 'Add Gift', onClick: handleCreateGift } : undefined}
//         />
//       )}

//       <GiftModal open={isModalOpen} onOpenChange={setIsModalOpen} gift={selectedGift} onSave={handleSaveGift} />

//       <ConfirmDialog
//         open={!!deleteGift}
//         onOpenChange={(open) => !open && setDeleteGift(null)}
//         title="Delete Gift"
//         description={`Are you sure you want to delete "${deleteGift?.name}"? This action cannot be undone.`}
//         confirmLabel="Delete"
//         variant="destructive"
//         onConfirm={handleDeleteConfirm}
//       />
//     </DashboardLayout>
//   );
// }


'use client';

import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Gift, Package, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/src/component/Layout/DashboardLayout';
import { PageHeader } from '@/src/component/common/PageHeader';
import { SearchInput } from '@/src/component/common/SearchInput';
import { ConfirmDialog } from '@/src/component/common/ConfirmDialog';
import { EmptyState } from '@/src/component/common/EmptyState';
import { StatusBadge } from '@/src/component/common/StatusBadge';
import { GiftModal } from '@/src/component/gifts/Gift-Modal';

import { useGifts, useCreateGift, useUpdateGift, useDeleteGift } from '@/src/hooks/useGift';
import { Gift as GiftType } from '@/src/types/index';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader } from '@/src/component/common/Loader';

export default function Gifts() {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>('all');
  const [selectedGift, setSelectedGift] = useState<GiftType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteGift, setDeleteGift] = useState<GiftType | null>(null);

  const { data: gifts = [], isLoading } = useGifts();
  const createGift = useCreateGift();
  const updateGift = useUpdateGift();
  const removeGift = useDeleteGift();

  const filteredGifts = useMemo(() => {
    let filtered = gifts;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.quantity.toString().includes(q)
      );
    }

    if (filterAvailability === 'available')
      filtered = filtered.filter(g => g.available);

    if (filterAvailability === 'unavailable')
      filtered = filtered.filter(g => !g.available);

    return filtered;
  }, [gifts, searchQuery, filterAvailability]);

  const handleCreateGift = () => {
    setSelectedGift(null);
    setIsModalOpen(true);
  };

  const handleEditGift = (gift: GiftType) => {
    setSelectedGift(gift);
    setIsModalOpen(true);
  };

  const handleSaveGift = async (giftData: Omit<GiftType, 'id'>) => {
    try {
      if (selectedGift) {
        await updateGift.mutateAsync({
          id: selectedGift.id,
          giftData,
        });
      } else {
        await createGift.mutateAsync(giftData);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save gift:', err);
    }
  };

  const handleToggleAvailability = async (gift: GiftType) => {
    try {
      const { id, ...rest } = gift;

      await updateGift.mutateAsync({
        id,
        giftData: { ...rest, available: !gift.available },
      });
    } catch (err) {
      console.error('Failed to toggle availability:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteGift) return;

    try {
      await removeGift.mutateAsync(deleteGift.id);
      setDeleteGift(null);
    } catch (err) {
      console.error('Failed to delete gift:', err);
    }
  };

  const availableCount = useMemo(
    () => gifts.filter(g => g.quantity > 0 && g.available).length,
    [gifts]
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Gift Management"
        subtitle={`${availableCount} of ${gifts.length} gifts available for birthday wheel`}
        actions={
          <Button
            onClick={handleCreateGift}
            className="bg-[#CE1B22] text-white hover:bg-[#b0171d]"
          >
            <Plus className="w-4 h-4" />
            Add Gift
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search gifts by name or quantity..."
          />
        </div>

        <Select
          value={filterAvailability}
          onValueChange={(v) =>
            setFilterAvailability(v as typeof filterAvailability)
          }
        >
          <SelectTrigger className="w-full sm:w-48 bg-background">
            <SelectValue placeholder="Filter availability" />
          </SelectTrigger>

          <SelectContent className="bg-popover z-50">
            <SelectItem value="all">All Gifts</SelectItem>
            <SelectItem value="available">Available Only</SelectItem>
            <SelectItem value="unavailable">Unavailable Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-100">
          <Loader />
        </div>
      ) : filteredGifts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-card rounded-xl shadow-card border border-border/50 p-5 hover:shadow-card-hover transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      gift.available ? 'bg-[#CE1B22]/10' : 'bg-muted'
                    }`}
                  >
                    <Gift
                      className={`w-5 h-5 ${
                        gift.available
                          ? 'text-[#CE1B22]'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground">
                      {gift.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditGift(gift)}
                    className="text-[#CE1B22] hover:bg-red-100 hover:text-[#CE1B22]"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteGift(gift)}
                    className="text-[#CE1B22] hover:bg-red-100 hover:text-[#CE1B22]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Quantity Available:
                  </span>

                  <span
                    className={`text-lg font-semibold ${
                      gift.quantity === 0
                        ? 'text-destructive'
                        : 'text-[#CE1B22]'
                    }`}
                  >
                    {gift.quantity}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <StatusBadge
                  status={
                    gift.quantity > 0 && gift.available
                      ? 'success'
                      : 'error'
                  }
                >
                  {gift.quantity > 0 && gift.available ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Unavailable
                    </>
                  )}
                </StatusBadge>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleAvailability(gift)}
                  className="text-xs"
                >
                  {gift.available
                    ? 'Mark Unavailable'
                    : 'Mark Available'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No gifts found"
          description={
            searchQuery
              ? 'Try adjusting your search query'
              : 'Add gifts that employees can win on their birthday'
          }
          action={
            !searchQuery
              ? { label: 'Add Gift', onClick: handleCreateGift }
              : undefined
          }
        />
      )}

      <GiftModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        gift={selectedGift}
        onSave={handleSaveGift}
      />

      <ConfirmDialog
        open={!!deleteGift}
        onOpenChange={(open) => !open && setDeleteGift(null)}
        title="Delete Gift"
        description={`Are you sure you want to delete "${deleteGift?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}