import { LogoutDialog } from "@/components/home/settings";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { jotaiStore, navbarTitleAtom, userProfileAtom } from "@/stores";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
      <div className="py-4 space-y-4 max-w-xl">
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

        <div>
          <Link to="/me/questions">
            <Card className="py-4 shadow-none">
              <CardContent className="px-4 flex justify-between">
                <p>Pertanyaan saya</p>
                <ChevronRightIcon className="size-5" />
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-sm text-primary">Aplikasi</p>
          <div className="space-y-1">
            <Card
              className={cn("py-4 shadow-none")}
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
              }}
            >
              <CardContent className="px-4 flex items-center justify-between">
                <p className="text-base">Gunakan tema gelap</p>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-0.5">
          <Link to="/me/profile" className="block">
            <Card className="py-4 shadow-none rounded-b-sm">
              <CardContent className="px-4 flex justify-between">
                <p>Ubah profil</p>
                <ChevronRightIcon className="size-5" />
              </CardContent>
            </Card>
          </Link>
          <Card
            className="py-4 shadow-none rounded-t-sm"
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
