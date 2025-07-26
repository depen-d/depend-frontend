import { Card, CardContent } from "@/components";
import { AlertCircle } from "lucide-react";

export default function EmptyPlaceholder() {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="mb-2">Nenhum caso de uso encontrado</h3>
        <p className="text-muted-foreground mb-6">Crie um novo caso de uso</p>
      </CardContent>
    </Card>
  );
}
