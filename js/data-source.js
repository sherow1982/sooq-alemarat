// يتم جلب المنتجات حصراً من هذا الملف والالتزام به حرفياً
export async function fetchUaeProducts(){
  const res = await fetch('data/uae-products.json',{cache:'no-store'});
  if(!res.ok){throw new Error('failed to load products');}
  return await res.json();
}
