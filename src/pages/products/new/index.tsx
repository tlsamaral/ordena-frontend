import { AddProduct } from '@/components/add-product'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { canSSRAuth } from '@/utils/canSSRAuth'
export default function AddProductPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Adicionar um produto</CardTitle>
          <CardDescription>
            Nesta seção voce irá adicionar um produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddProduct />
        </CardContent>
      </Card>
    </main>
  )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  return {
    props: {},
  }
})
