import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Edit Product — Admin VYNTRO' };

export default function EditProductPage() {
  return <ProductForm isEdit={true} />;
}
