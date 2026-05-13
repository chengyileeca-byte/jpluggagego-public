import { redirect } from "next/navigation";

export default function AdminEntriesIndexDisabled() {
  redirect("/admin");
}
