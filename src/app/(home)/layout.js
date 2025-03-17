import ChatList from "../conponents/chat-list";
import Provider from "../conponents/Provide";
import StoreProvider from "../redux/provider";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "WhatsApp Clone",
  description: "A WhatsApp UI clone built with Next.js and Framer Motion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#111b21]`}>
        <StoreProvider>
          <Provider>
            <div>{children}</div>
          </Provider>
        </StoreProvider>
      </body>
    </html>
  );
}
