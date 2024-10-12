import { createFileRoute } from "@tanstack/react-router";
import BackTitle from "../../components/BackTitle";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useStoreMutations } from "../../mutations/useStoresMutations";
import { MutationType } from "../../types/types";
import { SpinnerWhite } from "../../assets";

export const Route = createFileRoute("/_private/stores/edit/$id")({
  component: EditStores,
});

function EditStores() {
  const { id } = Route.useParams();
  const { storeForm, submitCreateForm } = useStoreMutations(
    MutationType.Patch,
    id as Id<"stores">
  );

  const storeData = useQuery(api.stores.getSingleStore, {
    id: id as Id<"stores">,
  });

  const renderEditForm = () => {
    if (!storeData) return;
    return (
      <form onSubmit={storeForm.handleSubmit(submitCreateForm)}>
        <div className="grid grid-cols-2 gap-7">
          <div className="flex items-center w-full mr-5 border border-gray-200 rounded-lg bg-indigo-50">
            <p className="px-4 text-hitampudar">https://bagimenu.com/</p>
            <input
              defaultValue={storeData.url}
              required
              type="text"
              placeholder="Url Toko"
              className="w-full p-3 rounded-r-lg "
              {...storeForm.register("url")}
            />
          </div>
          <div>
            <input
              defaultValue={storeData.name}
              required
              type="text"
              placeholder="Nama Toko"
              className="w-full p-3 border border-gray-200 rounded-lg"
              {...storeForm.register("name")}
            />
          </div>

          <div>
            <input
              required
              type="text"
              placeholder="Nomor Whatsapp"
              className="w-full p-3 border border-gray-200 rounded-lg "
              defaultValue={storeData.whatsapp}
              {...storeForm.register("whatsapp")}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="w-[100px] py-2 text-sm font-semibold text-white transition rounded-lg bg-ungu hover:opacity-95"
          >
            {storeForm.formState.isSubmitting ? (
              <img src={SpinnerWhite} className="w-[20px] mx-auto" />
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div>
      <BackTitle backTo="/stores" title="Edit Toko" />
      {renderEditForm()}
    </div>
  );
}
