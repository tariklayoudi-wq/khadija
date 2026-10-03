import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Listing } from './catalog';
export type Product = Listing & {availability?: 'check'|'available'|'unavailable';stock?:number|null};
type ShopState = {cart:{id:string;quantity:number}[];products:Product[]|null;error:string|null;load:()=>Promise<void>;add:(id:string,quantity?:number)=>void;setQuantity:(id:string,quantity:number)=>void;clear:()=>void};
export const useShop=create<ShopState>()(persist((set,get)=>({cart:[],products:null,error:null,
 load:async()=>{try{const r=await fetch('/api/catalog');if(!r.ok)throw new Error('Catalog unavailable');const d=await r.json();set({products:d.products,error:null});}catch{set({error:'offline'});}},
 add:(id,quantity=1)=>set(s=>{const current=s.cart.find(i=>i.id===id);return {cart:current?s.cart.map(i=>i.id===id?{...i,quantity:Math.min(20,i.quantity+quantity)}:i):[...s.cart,{id,quantity:Math.min(20,quantity)}]};}),
 setQuantity:(id,quantity)=>set(s=>({cart:quantity<=0?s.cart.filter(i=>i.id!==id):s.cart.map(i=>i.id===id?{...i,quantity:Math.min(20,quantity)}:i)})),clear:()=>set({cart:[]})
}),{name:'khadija-cart-v2',partialize:s=>({cart:s.cart}),skipHydration:true}));
