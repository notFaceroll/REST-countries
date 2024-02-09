import { Route, Routes } from "react-router-dom";
import { Details } from "../view/details";
import { Layout } from "@/view/layout";
import { Home } from "@/view/home";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path=":id" element={<Details />} />
      </Route>
    </Routes>
  );
}
