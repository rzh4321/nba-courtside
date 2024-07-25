import { TopPerformers } from "@/components/TopPerformers";

export default async function Page({ params: { date} } : { params: { date: string}}) {
    console.log(date);

    return <TopPerformers />
}