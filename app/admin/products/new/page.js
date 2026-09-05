import ProductForm from '@/components/admin/ProductForm';

export const metadata = { title: 'Add Product — Admin VYNTRO' };

export default function NewProductPage() {
  return <ProductForm isEdit={false} />;
}
