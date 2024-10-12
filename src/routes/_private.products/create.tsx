import { createFileRoute } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";

export const Route = createFileRoute("/_private/products/create")({
  component: CreateProduct,
});

function CreateProduct() {
  return (
    <div>
      <BackTitle backTo="/products" title="Tambah Produk" />
    </div>
  );
}
