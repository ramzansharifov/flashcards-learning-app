import toast from "react-hot-toast";
export const notify = {
  ok: (m: string) => toast.success(m),
  err: (m: string) => toast.error(m || "Something went wrong"),
};
