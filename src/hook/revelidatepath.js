"use server";
import { revalidatePath } from "next/cache";
const clearCachesByServerAction = async (path) => {
  try {
    if (path) {
      revalidatePath(path);
    } else {
      revalidatePath("/");
      revalidatePath("/[lang]");
    }
  } catch (error) {
    console.error("clearCachesByServerAction=> ", error);
  }
};
export default clearCachesByServerAction;
