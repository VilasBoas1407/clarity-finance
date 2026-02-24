import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export function ImportCsvModal({
  open,
  onOpenChange,
  onImportCsv,
  importing = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportCsv: (file: File) => Promise<void>;
  importing?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar CSV</DialogTitle>
          <DialogDescription>
            Importe suas transações a partir de um arquivo CSV. O arquivo CSV
            deve conter as seguintes colunas: Data, Descrição,Categoria e Valor.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const fileInput = e.currentTarget.elements.namedItem(
              "csvFile",
            ) as HTMLInputElement;
            if (fileInput.files && fileInput.files[0]) {
              await onImportCsv(fileInput.files[0]);
            }
          }}
          className="grid gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="csvFile">Selecione o arquivo CSV</Label>
            <Input
              type="file"
              id="csvFile"
              name="csvFile"
              accept=".csv"
              disabled={importing}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={importing}>
              {importing ? "Importando..." : "Importar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
