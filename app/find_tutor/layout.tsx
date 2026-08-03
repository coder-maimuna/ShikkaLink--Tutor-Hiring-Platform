import { ReactNode } from "react";
import Navbar from "./components/Navbar";

export default function FindTutorLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (

    <>

      <Navbar />

      {children}

    </>

  );
}