'use client';
import useUserBets from "@/hooks/useUserBets";



export default async function Page() {
    const {loading, activeBets, error} = useUserBets();
    console.log(activeBets)
    const betTypeToString: Record<string, string> = {
        SPREAD_HOME: "SPREAD BETTING",
        SPREAD_AWAY: "SPREAD BETTING",
        OVER: "TOTAL POINTS",
        UNDER: "TOTAL POINTS",
        MONEYLINE_HOME: "MONEYLINE",
        MONEYLINE_AWAY: "MONEYLINE",
      };


    const betDivs = activeBets.map(bet => (
        <div key={bet.id} className="flex flex-col gap-10">
            <div className="flex justify-between items-center">
                <span>{betTypeToString[bet.betType]}</span>
                <span>{bet.odds.replace(/\.?0+$/, "")}</span>
            </div>
            <div className="flex flex-col gap-1">
                <div>
                    
                </div>
            </div>
        </div>
    ))

    return <>{loading? 'loading' : error? 'error' :  betDivs}</>
}