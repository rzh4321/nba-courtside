import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

/** App Fonts */
const fonts = {
  body: montserrat.style.fontFamily,
  heading: montserrat.style.fontFamily,
};

export default fonts;
