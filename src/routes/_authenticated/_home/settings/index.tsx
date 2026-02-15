import { LogoutDialog } from "@/components/home/settings/logout-dialog";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { jotaiStore, navbarTitleAtom, userProfileAtom } from "@/stores";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAtom } from "jotai";
import { ChevronRightIcon, UserIcon } from "lucide-react";
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
  const [logoutDialog, setLogoutDialog] = useState({
    open: false,
  });

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

        <Card
          className="py-4 shadow-none active:scale-95 transition-all"
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
