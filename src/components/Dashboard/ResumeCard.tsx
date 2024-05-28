import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

// type of ResumeProps
interface ResumeProps {
    title: string;
    contentTitle: string|number;
    contentDescription: string|number;
    icon?: React.ReactNode;
}

export function ResumeCard({ title, contentTitle, contentDescription, icon }: ResumeProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{contentTitle}</div>
                <p className="text-xs text-muted-foreground">
                    {contentDescription}
                </p>
            </CardContent>
        </Card>
    )

}