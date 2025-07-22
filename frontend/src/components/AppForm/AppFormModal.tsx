import { useForm } from "react-hook-form";
import type { AppEntry } from "../../types/index";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AppEntryInput) => void;
  initialData?: AppEntry | null;
};

export type AppEntryInput = {
  name: string;
  owner: string;
  description: string;
  url: string;
  port: number;
  status: string;
};

const AppFormModal = ({ isOpen, onClose, onSubmit, initialData }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppEntryInput>();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        owner: initialData.owner,
        description: initialData.description,
        url: initialData.url,
        port: initialData.port,
        status: initialData.status,
      });
    } else {
      reset();
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit App" : "Add New App"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            placeholder="App Name"
            {...register("name", { required: "Name is required" })}
            className="border w-full px-3 py-2 rounded"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}

          <input
            placeholder="Owner"
            {...register("owner", { required: "Owner is required" })}
            className="border w-full px-3 py-2 rounded"
          />
          {errors.owner && <p className="text-red-600 text-sm">{errors.owner.message}</p>}

          <textarea
            placeholder="Description"
            {...register("description")}
            className="border w-full px-3 py-2 rounded"
          />

          <input
            placeholder="URL"
            {...register("url", {
              required: "URL is required",
              pattern: {
                value: /^(http|https):\/\//,
                message: "Must start with http:// or https://",
              },
            })}
            className="border w-full px-3 py-2 rounded"
          />
          {errors.url && <p className="text-red-600 text-sm">{errors.url.message}</p>}

          <input
            placeholder="Port"
            type="number"
            {...register("port", {
              required: "Port is required",
              valueAsNumber: true,
              min: { value: 1, message: "Port must be positive" },
            })}
            className="border w-full px-3 py-2 rounded"
          />
          {errors.port && <p className="text-red-600 text-sm">{errors.port.message}</p>}

          <select
            {...register("status", { required: "Status is required" })}
            className="border w-full px-3 py-2 rounded"
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {errors.status && <p className="text-red-600 text-sm">{errors.status.message}</p>}

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppFormModal;
