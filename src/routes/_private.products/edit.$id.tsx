import { createFileRoute } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";

export const Route = createFileRoute("/_private/products/edit/$id")({
  component: EditProduct,
});

function EditProduct() {
  return (
    <div>
      <BackTitle backTo="/products" title="Edit Produk" />
    </div>
  );
}
