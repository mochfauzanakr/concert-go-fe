import { OrderDetailView } from "@/components/demo/user/order-detail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <OrderDetailView orderId={id} />; }
