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
        <button type="submit">sen</button>

        {/* <div className="mx-auto mt-10 lg:w-1/3">
          <ImageViewer file={imgFile} />
          <p className="mb-4 text-xs text-center text-gray-500">Logo Toko</p>
          <label htmlFor="file-input" className="cursor-pointer sr-only">
            Choose
          </label>
          <input
            type="file"
            id="file-input"
            className="block w-full text-sm border border-gray-200 rounded-lg shadow-sm cursor-pointer focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 "
            onChange={(e) => {
              if (e.target.files) {
                setImgFile(e.target.files[0]);
              }
            }}
          />
        </div> */}
      </form>
    </div>
  );
}
