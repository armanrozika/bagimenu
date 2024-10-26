import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../convex/_generated/api";
import NoData from "../../components/NoData";
import LoadingLine from "../../components/LoadingLine";
import { convexQuery } from "@convex-dev/react-query";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useTagMutations } from "../../mutations/useTagMutations";
import { IoCloseCircleOutline } from "react-icons/io5";
import { useMutation } from "convex/react";

export const Route = createFileRoute("/_private/tags/")({
  component: Tags,
});

function Tags() {
  const { data: tags, isLoading } = useQuery({
    ...convexQuery(api.tags.get, {}),
  });
  const { form, submitData } = useTagMutations();
  const deleteTag = useMutation(api.tags.deleteTag);

  const renderTags = () => {
    if (!tags) return;
    if (tags === "no_default_store") {
      return <NoData text="Silakan Buat Toko Terlebih Dahulu" />;
    }
    if (tags.length < 1) {
      return <NoData text="Belum Ada Tags" />;
    }
    return tags.map((tag) => {
      return (
        <div
          key={tag._id}
          className="mr-5 text-indigo-600 bg-blue-50 border border-indigo-600 rounded-md px-3 py-1 inline-block items-center mb-3"
        >
          <div className="flex items-center">
            <p className="text-sm">{tag.name}</p>
            <IoCloseCircleOutline
              className="ml-2 text-xl text-hitampudar cursor-pointer"
              onClick={async () => {
                await deleteTag({ tag_id: tag._id });
              }}
            />
          </div>
        </div>
      );
    });
  };
  return (
    <>
      <div className="pb-3 mb-3 border-b border-gray-100">
        <h1 className="font-semibold text-hitampudar">Tags</h1>
      </div>
      {isLoading && <LoadingLine />}
      <div className="">{renderTags()}</div>
      {tags !== "no_default_store" && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit(submitData)();
            form.reset();
          }}
          className="flex justify-end items-center mt-5"
        >
          <input
            required
            type="text"
            placeholder="Nama Tags"
            className="px-3 py-2 bg-gray-50 rounded-lg mr-5 w-1/3"
            {...form.register("name")}
          />
          <button
            type="submit"
            className="text-sm flex items-center border border-ungu px-5 py-1.5 text-ungu font-semibold rounded-full hover:bg-gray-100 transition"
          >
            <IoMdCheckmarkCircleOutline className="mr-2 font-bold text-lg" />
            Tambah
          </button>
        </form>
      )}
    </>
  );
}
