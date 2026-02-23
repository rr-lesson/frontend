import type { QuestionDto } from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import Mathematics from "@tiptap/extension-mathematics";
import { generateText } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { format } from "date-fns";
import { CalendarIcon, FilesIcon, MoveRightIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface ListItemQuestionProps {
  data: QuestionDto;
}
export const ListItemQuestion = ({
  data: { data, attachments, user, subject, class: _class },
}: ListItemQuestionProps) => {
  return (
    <>
      <Card className="shadow-none py-4 gap-4">
        <CardHeader className="flex items-center gap-3 px-4">
          <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
            <UserIcon className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{user.name ?? "Anonim"}</p>
            <p className="text-xs text-muted-foreground">
              {subject.name} • {_class.name}
            </p>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {generateText(JSON.parse(data.question), [StarterKit, Mathematics])}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-end px-4 h-full">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground text-xs gap-2">
              <CalendarIcon className="size-3" />
              <p>{format(data.created_at, "EEEE, d MMMM yyyy")}</p>
            </div>
            {attachments.length > 0 && (
              <div className="flex items-center text-muted-foreground text-xs gap-2">
                <FilesIcon className="size-3" />
                <p>{attachments.length} gambar disertakan</p>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                variant={"secondary"}
                asChild
                className="pointer-events-auto"
              >
                <Link
                  to="/questions/$questionId"
                  params={{ questionId: String(data.id) }}
                >
                  <MoveRightIcon />
                </Link>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
    </>
  );
};
