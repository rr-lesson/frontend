import { logoutMutation } from "@/api/@tanstack/react-query.gen";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useMutation } from "@tanstack/react-query";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}
export const LogoutDialog = ({ open, onOpenChange }: LogoutDialogProps) => {
  const { mutate, isPending } = useMutation({
    ...logoutMutation(),
    onSuccess: () => {
      onOpenChange(false, true);
    },
  });

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Keluar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin akan keluar dari akun Anda? Semua sesi yang
              sedang aktif akan berakhir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
            <Button disabled={isPending} onClick={() => mutate({})}>
              {isPending && <Spinner />}
              Keluar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
