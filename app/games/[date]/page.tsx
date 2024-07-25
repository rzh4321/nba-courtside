import { TopPerformers } from "@/components/TopPerformers";

export default async function Page({ params: { date} } : { params: { date: string}}) {
    return <TopPerformers />
}