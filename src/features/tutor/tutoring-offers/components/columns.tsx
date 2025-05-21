'use client';

import { ColumnDef } from '@tanstack/react-table';
import { DataTableRowActions } from './data-table-row-actions';
import { TutoringOffer } from '../data/schema';

export const columns: ColumnDef<TutoringOffer>[] = [
  {
    accessorKey: 'subjectName',
    header: 'Asignatura'
  },
  {
    accessorKey: 'modality',
    header: 'Modalidad',
    cell: ({ row }) => (row.getValue('modality') === 'ONLINE' ? 'En línea' : 'Presencial')
  },
  {
    accessorKey: 'sessionType',
    header: 'Tipo de Sesión',
    cell: ({ row }) => {
      const sessionType = row.getValue('sessionType');
      return sessionType === 'INDIVIDUAL' ? 'Individual' : 'Grupal';
    }
  },
  {
    accessorKey: 'semester',
    header: 'Semestre'
  },
  {
    accessorKey: 'location',
    header: 'Ubicación'
  },
  {
    accessorKey: 'meetingLink',
    header: 'Enlace de Reunión'
  },
  {
    accessorKey: 'isActive',
    header: 'Estado',
    cell: ({ row }) => (row.getValue('isActive') ? 'Activo' : 'Inactivo')
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleDateString()
  },
  {
    accessorKey: 'updatedAt',
    header: 'Modificado',
    cell: ({ row }) => new Date(row.getValue('updatedAt')).toLocaleDateString()
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />
  }
];
