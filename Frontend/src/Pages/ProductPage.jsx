import { useParams } from 'react-router-dom'
import ProductDetail from '@/components/ProductDetail'

export default function ProductPage() {
  const { id } = useParams()
  
  return (
    <div className="min-h-screen bg-amber-50">
      <ProductDetail productId={Number(id)} />
    </div>
  )
}