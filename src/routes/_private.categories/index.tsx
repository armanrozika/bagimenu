import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuCheckSquare, LuTrash } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { api } from "../../../convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import LoadingLine from "../../components/LoadingLine";
import NoData from "../../components/NoData";
import { useCategoryMutations } from "../../mutations/useCategoyMutations";
import toast from "react-hot-toast";
import { useMutation } from "convex/react";

export const Route = createFileRoute("/_private/categories/")({
  component: Categories,
});

function Categories() {
  const [activeInput, setActiveInput] = useState({
    id: "",
    name: "",
  });
  const { data, isLoading } = useQuery({
    ...convexQuery(api.categories.get, {}),
  });
  const deleteCategory = useMutation(api.categories.remove);
  const { form, formPatch, submitAdd, submitPatch } = useCategoryMutations();

  const renderCategory = () => {
    if (!data) return;
    if (data.length < 1) {
      return <NoData text="Belum Ada Kategori" />;
    }
    if (data === "no store") {
      return <NoData text="Silakan Buat Toko Terlebih Dahulu" />;
    }
    const renderForm = () => {
      return (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            formPatch.setValue("id", activeInput.id);
            formPatch.setValue("name", activeInput.name);
            const send = formPatch.handleSubmit(submitPatch);
            await send();
            setActiveInput({ id: "", name: "" });
          }}
          className={`absolute items-center`}
        >
          <input
            required
            type="text"
            className="border rounded-lg px-3 py-2 border-ungu"
            value={activeInput.name}
            onChange={(e) =>
              setActiveInput((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <button
            type="button"
            className="text-xs text-hitampudar hover:bg-gray-200 bg-gray-100 mx-3 px-5 rounded-full py-2 font-semibold transition"
            onClick={() => setActiveInput({ id: "", name: "" })}
          >
            Batal
          </button>
          <button
            type="submit"
            className="text-xs text-white hover:bg-indigo-500 bg-ungu px-5 rounded-full py-2 font-semibold transition"
          >
            Simpan
          </button>
        </form>
      );
    };

    return data.map((category) => {
      return (
        <div
          key={category._id}
          className={`border borger-gray-200 p-5 rounded-xl flex justify-between items-center mb-3 hover:border-ungu transition relative`}
        >
          {category._id === activeInput.id && renderForm()}
          <p className="px-3 py-2">{category.name}</p>
          <div className="flex items-center">
            <FiEdit
              className="text-indigo-500 hover:text-ungu cursor-pointer"
              onClick={() => {
                setActiveInput({ id: category._id, name: category.name });
              }}
            />
            <LuTrash
              className="ml-7 text-gray-500 cursor-pointer hover:text-rose-500"
              onClick={async () => {
                try {
                  await deleteCategory({ id: category._id });
                  toast.success(`${category.name} berhasil dihapus`);
                } catch (error) {
                  toast.success("Terjadi kesalahan");
                }
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
        <h1 className="font-semibold text-hitampudar">Kategori</h1>
      </div>
      {isLoading && <LoadingLine />}
      {renderCategory()}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const aio = form.handleSubmit(submitAdd);
          await aio();
          form.reset();
        }}
        className="flex justify-end items-center mt-5"
      >
        <input
          required
          type="text"
          placeholder="Nama Kategori"
          className="px-3 py-2 bg-gray-50 rounded-lg mr-5 w-1/3"
          {...form.register("name")}
        />
        <button
          type="submit"
          className="text-sm flex items-center border border-ungu px-5 py-1.5 text-ungu font-semibold rounded-full hover:bg-gray-100 transition"
        >
          <LuCheckSquare className="mr-2 font-semibold" />
          Tambah
        </button>
      </form>
    </>
  );
}
