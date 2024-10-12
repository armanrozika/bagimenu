import { createFileRoute } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";
import { useStoreMutations } from "../../mutations/useStoresMutations";
import { MutationType } from "../../types/types";
import { Id } from "../../../convex/_generated/dataModel";
import { SpinnerWhite } from "../../assets";

export const Route = createFileRoute("/_private/stores/create")({
  component: CreateToko,
});

function CreateToko() {
  const { storeForm, submitCreateForm } = useStoreMutations(
    MutationType.Create,
    "_" as Id<"stores">
  );
  return (
    <div>
      <BackTitle backTo="/stores" title="Tambah Toko" />
      <form onSubmit={storeForm.handleSubmit(submitCreateForm)}>
        <div className="grid grid-cols-2 gap-7">
          <div className="flex items-center w-full mr-5 border border-gray-200 rounded-lg bg-indigo-50">
            <p className="px-4 text-hitampudar">https://bagimenu.com/</p>
            <input
              {...storeForm.register("url")}
              required
              type="text"
              placeholder="Url Toko"
              className="w-full p-3 rounded-r-lg "
            />
          </div>
          <div>
            <input
              {...storeForm.register("name")}
              required
              type="text"
              placeholder="Nama Toko"
              className="w-full p-3 border border-gray-200 rounded-lg"
            />
          </div>

          <div>
            <input
              {...storeForm.register("whatsapp")}
              required
              type="text"
              placeholder="Nomor Whatsapp"
              className="w-full p-3 border border-gray-200 rounded-lg "
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="px-5 w-[100px] py-2 text-sm font-semibold text-white transition rounded-lg bg-ungu hover:opacity-95"
          >
            {storeForm.formState.isSubmitting ? (
              <img src={SpinnerWhite} className="w-[20px] mx-auto" />
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
