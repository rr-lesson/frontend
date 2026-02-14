import { useTheme } from "@/components/theme-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { createFileRoute } from "@tanstack/react-router";
import { UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home/settings/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Pengaturan");
  },
});

function RouteComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="py-4 space-y-4">
      {/* profile */}
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-full size-16 flex items-center justify-center">
          <UserIcon className="size-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">Rizal Dwi Anggoro</p>
          <p className="text-xs text-muted-foreground">gnoogler4@gmail.com</p>
        </div>
      </div>

      <Card className="py-4 shadow-none">
        <CardContent className="px-4 flex items-center justify-between">
          <p className="text-base">Gunakan tema gelap</p>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
