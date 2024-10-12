import { createFileRoute } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";
import { useStoreMutations } from "../../mutations/useStoresMutations";

export const Route = createFileRoute("/_private/stores/create")({
  component: CreateToko,
});

function CreateToko() {
  const { storeForm, submitCreateForm } = useStoreMutations();
  return (
    <div>
      <BackTitle backTo="/stores" title="Tambah Toko" />
      <form onSubmit={storeForm.handleSubmit(submitCreateForm)}>
        <div className="grid grid-cols-3 gap-5">
          <input
            {...storeForm.register("name")}
            required
            type="text"
            placeholder="Nama Toko"
            className="p-3 rounded-lg bg-gray-50"
          />
          <input
            {...storeForm.register("url")}
            required
            type="text"
            placeholder="URL Toko"
            className="p-3 rounded-lg bg-gray-50"
          />
          <input
            {...storeForm.register("whatsapp")}
            required
            type="text"
            placeholder="Nomor Whatsapp"
            className="p-3 rounded-lg bg-gray-50"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white transition rounded-lg bg-ungu hover:opacity-95"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
}
