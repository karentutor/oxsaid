import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";

export default function MyBusiness() {
  return (
    <aside className="[grid-area:aside]">
      <Card className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <CardHeader>
            <CardTitle>My Business</CardTitle>
          </CardHeader>
          <CardContent>You have no business yet.</CardContent>
        </ScrollArea>
      </Card>
    </aside>
  );
}
