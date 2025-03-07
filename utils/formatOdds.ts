export const getSpread = (
  homeSpread: number | null | undefined,
  type: "home" | "away",
) => {
  if (homeSpread === null || homeSpread === undefined) return "-";
  else if (type === "away") {
    let opposite = -1 * homeSpread;
    if (opposite > 0)
      return (
        "+" +
        homeSpread
          .toString()
          .slice(1)
          .replace(/\.?0+$/, "")
      );
    return opposite.toString().replace(/\.?0+$/, "");
  } else {
    if (homeSpread > 0)
      return "+" + homeSpread.toString().replace(/\.?0+$/, "");
    return homeSpread.toString().replace(/\.?0+$/, "");
  }
};

export const getMoneyline = (moneyline: number | null | undefined) => {
  if (moneyline === null || moneyline === undefined) return "-";
  if (moneyline > 0) return "+" + moneyline.toString().replace(/\.?0+$/, "");
  return moneyline.toString().replace(/\.?0+$/, "");
};
