import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { Ellipsis, Trash } from 'lucide-react';
import { useTutoringOffers } from '../context/tutoring-offers-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { deleteTutoringOffer } from '@/lib/api/tutor/tutoring-offers/delete-tutoring-offer';
import { useSession } from 'next-auth/react';
import { toggleTutoringOfferStatus } from '@/lib/api/tutor/tutoring-offers/toggle-status-tutoring-offer';
import { toast } from 'sonner';
import { DataTableRow } from '@/app/(protected)/tutor/tutoring-offers/page';

interface DataTableRowActionsProps {
  row: Row<DataTableRow>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const tutoringOffer = row.original;
  const [ dialogOpen, setDialogOpen ] = useState(false);
  const { setCurrentRow } = useTutoringOffers();
  const router = useRouter();
  const { data: session } = useSession();

  const handleDeleteConfirmation = async () => {
    try {
      // Call your API delete function here
      await deleteTutoringOffer(tutoringOffer.id, session?.accessToken);
      setCurrentRow(null);
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleToggleActive = async () => {
    try {
      const response =await toggleTutoringOfferStatus(tutoringOffer.id, session?.accessToken);

      if (response.id) {
        toast.success(`La oferta de tutoría ha sido ${response.isActive ? 'activada' : 'desactivada'}`);
        setCurrentRow(null);
        setDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Toggle active failed:', error);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              router.push(`/tutor/tutoring-offers/edit/${tutoringOffer.id}`);
            }}
          >
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleToggleActive();
            }}
          >
            {tutoringOffer.isActive ? 'Desactivar' : 'Activar'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setDialogOpen(true);
            }}
            className='hover:bg-red-100! hover:text-red-500! bg-red-50 text-red-500'
          >
            Eliminar
            <DropdownMenuShortcut>
              <Trash size={16} className="text-red-500" />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar oferta</DialogTitle>
            <DialogDescription>Est&aacute; seguro que desea eliminar la oferta de tutor&iacute;a? Esta acci&oacute;n es irreversible.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmation}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
