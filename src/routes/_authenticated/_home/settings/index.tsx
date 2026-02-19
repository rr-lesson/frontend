import { LogoutDialog } from "@/components/home/settings";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  jotaiStore,
  navbarTitleAtom,
  newUpdateAvailableAtom,
  userProfileAtom,
} from "@/stores";
import { LiveUpdate } from "@capawesome/capacitor-live-update";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { ChevronRightIcon, RefreshCwIcon, UserIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/_home/settings/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Pengaturan");
  },
});

function RouteComponent() {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();
  const [profile] = useAtom(userProfileAtom);
  const [updateAvailable, setUpdateAvailable] = useAtom(newUpdateAvailableAtom);
  const [logoutDialog, setLogoutDialog] = useState({
    open: false,
  });

  const handleUpdate = () => {
    LiveUpdate.reload().then(() => {
      console.log("App updated successfully!");
      setUpdateAvailable(false);
    });
  };

  return (
    <>
      <div className="py-4 space-y-4">
        {/* profile */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 rounded-full size-16 flex items-center justify-center">
            <UserIcon className="size-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{profile?.name ?? "Tanpa nama"}</p>
            <p className="text-xs text-muted-foreground">
              {profile?.email ?? "Tanpa email"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-sm text-primary">Aplikasi</p>
          <div className="space-y-1">
            <Card
              className={cn(
                "py-4 shadow-none active:scale-95 transition-all",
                updateAvailable && "rounded-b-none",
              )}
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              <CardContent className="px-4 flex items-center justify-between">
                <p className="text-base">Gunakan tema gelap</p>
                <Switch
                  className="active:scale-95 transition-all"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </CardContent>
            </Card>

            {updateAvailable && (
              <Card
                className="py-4 shadow-none active:scale-95 transition-all rounded-t-none"
                onClick={handleUpdate}
              >
                <CardContent className="px-4 flex items-center gap-4">
                  <RefreshCwIcon className="size-5" />
                  <div>
                    <p className="text-base">Pembaruan</p>
                    <p className="text-sm text-muted-foreground">
                      Klik untuk memuat ulang pembaruan aplikasi!
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-sm text-primary">Akun</p>
          <Card
            className="py-4 shadow-none active:scale-95 transition-all"
            onClick={() => setLogoutDialog({ open: true })}
          >
            <CardContent className="px-4 flex items-center justify-between">
              <p className="text-base">Keluar</p>
              <ChevronRightIcon className="size-5" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* dialogs */}
      <LogoutDialog
        open={logoutDialog.open}
        onOpenChange={(open, status) => {
          setLogoutDialog({ open });
          if (status) {
            localStorage.removeItem("userProfile");
            navigate({ to: "/auth/login", replace: true });
          }
        }}
      />
    </>
  );
}
