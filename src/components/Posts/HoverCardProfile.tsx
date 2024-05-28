import { User } from "@/state/Posts/GetSlice";
import { ReactNode } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";



interface HoverCardProfileProps {
    user: User | undefined;
    children: ReactNode;
}

const HoverCardProfile: React.FC<HoverCardProfileProps> = ({ user, children }) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger className="h-fit">
                {children}
            </HoverCardTrigger>
            <HoverCardContent className="flex items-center gap-2">
                <Avatar className="w-11 h-11 my-2 flex items-center justify-center">
                    <AvatarImage loading="lazy" src={user?.avatar} className="object-cover" />
                    <AvatarFallback className="text-base">
                        {user?.firstName?.charAt(0).toUpperCase()}
                        {user?.lastName?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                    <b>{user?.firstName} {user?.lastName}</b>
                    <Badge className="w-fit" variant={"outline"}>{user?.role}</Badge>
                    <small className="text-muted-foreground">{user?.email}</small>
                    <small className="text-muted-foreground">{user?.phone}</small>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export default HoverCardProfile;