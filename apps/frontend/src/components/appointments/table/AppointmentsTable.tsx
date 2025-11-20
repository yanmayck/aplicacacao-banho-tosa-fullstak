
import React from "react";
import { Card } from "@/components/ui/card";
import { AppointmentStatus } from "@/context/StoreContext";
import { AppointmentRow } from "./AppointmentRow";
import { Appointment } from "@/context/models/types";

interface AppointmentsTableProps {
  filteredAppointments: Appointment[];
  handleEditAppointment: (appointment: Appointment) => void;
  handleDeleteAppointment: (id: string) => void;
  handleStatusChange: (appointmentId: string, status: AppointmentStatus) => void;
  handleAutoAssign: (appointmentId: string) => void;
  handleEditPoints: (appointmentId: string) => void;
}

export const AppointmentsTable: React.FC<AppointmentsTableProps> = React.memo(({
  filteredAppointments,
  handleEditAppointment,
  handleDeleteAppointment,
  handleStatusChange,
  handleAutoAssign,
  handleEditPoints
}) => {
  const areFiltersActive = () => {
    // Esta função pode ser mais elaborada dependendo de como os filtros são gerenciados
    return true; // Simplificado para o exemplo
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente / Pet
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data / Hora
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serviço
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tosador
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pontos
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  handleEditAppointment={handleEditAppointment}
                  handleDeleteAppointment={handleDeleteAppointment}
                  handleStatusChange={handleStatusChange}
                  handleAutoAssign={handleAutoAssign}
                  handleEditPoints={handleEditPoints}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                  {areFiltersActive()
                    ? "Nenhum agendamento encontrado com os filtros selecionados."
                    : "Nenhum agendamento cadastrado. Clique em 'Novo Agendamento' para adicionar."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});
