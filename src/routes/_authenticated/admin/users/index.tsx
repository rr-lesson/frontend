import { getAllUsersOptions } from "@/api/@tanstack/react-query.gen";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { formatDate } from "date-fns";

export const Route = createFileRoute("/_authenticated/admin/users/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Manajemen Pengguna");
  },
});

function RouteComponent() {
  const { data: dataUsers } = useQuery({
    ...getAllUsersOptions(),
  });

  return (
    <>
      <div className="py-4 space-y-4">
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="px-4">ID</TableHead>
                <TableHead className="px-4">Nama</TableHead>
                <TableHead className="px-4">Email</TableHead>
                <TableHead className="px-4">Peran</TableHead>
                <TableHead className="px-4">Tanggal Dibuat</TableHead>
                <TableHead className="px-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataUsers &&
                dataUsers.items.map((item, index) => (
                  <TableRow key={"user-item-" + index}>
                    <TableCell className="px-4">{item.data.id}</TableCell>
                    <TableCell className="px-4">{item.data.name}</TableCell>
                    <TableCell className="px-4">{item.data.email}</TableCell>
                    <TableCell className="px-4">{item.data.role}</TableCell>
                    <TableCell className="px-4">
                      {formatDate(
                        new Date(item.data.created_at),
                        "d MMMM yyyy",
                      )}
                    </TableCell>
                    <TableCell className="px-4"></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
