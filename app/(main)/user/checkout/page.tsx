import { Suspense } from "react";
import { CheckoutView } from "@/components/demo/user/checkout";
import { Loading } from "@/components/demo/ui";
export default function Page() { return <Suspense fallback={<Loading />}><CheckoutView /></Suspense>; }
