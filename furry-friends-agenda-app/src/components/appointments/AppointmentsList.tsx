
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAppointments } from "@/context/appointments/AppointmentContext";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import AppointmentForm from "./AppointmentForm";
import { AppointmentStatus } from "@/context/StoreContext";
import { PointsEditDialog } from "./PointsEditDialog";
import { AppointmentFilters } from "./filters/AppointmentFilters";
import { AppointmentsTable } from "./table/AppointmentsTable";
import { useAppointmentsFilter } from "./hooks/useAppointmentsFilter";
import { usePagination } from "@/hooks/usePagination";
import { Pagination } from "@/components/ui/pagination-component";
import { Appointment } from "@/context/models/types";

const AppointmentsList: React.FC = () => {
  const { 
    deleteAppointment, 
    updateAppointment, 
    updateAppointmentPoints,
    autoAssignGroomer,
    isLoading,
    error
  } = useAppointments();
  
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | undefined>(undefined);
  
  const [isPointsDialogOpen, setIsPointsDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  
  const { filteredAppointments, ...filterProps } = useAppointmentsFilter();

  // Pagination logic
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPrevPage,
    totalItems,
    itemsPerPage,
  } = usePagination({ data: filteredAppointments, itemsPerPage: 10 });

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };
  
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointment(id);
    }
  };
  
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(undefined);
  };
  
  const handleStatusChange = (appointmentId: string, status: AppointmentStatus) => {
    const appointment = filteredAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      updateAppointment({ ...appointment, status });
    }
  };
  
  const handleAutoAssign = (appointmentId: string) => {
    autoAssignGroomer(appointmentId);
  };

  const handleEditPoints = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setIsPointsDialogOpen(true);
  };
  
  const handleSavePoints = (points: number) => {
    if (selectedAppointmentId) {
      updateAppointmentPoints(selectedAppointmentId, points);
    }
  };

  if (isLoading) {
    return (
      <Layout activePage="appointments" setActivePage={() => {}}>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout activePage="appointments" setActivePage={() => {}}>
        <div className="text-red-500">Erro ao carregar agendamentos: {error.message}</div>
      </Layout>
    );
  }
  
  return (
    <Layout activePage="appointments" setActivePage={() => {}}>
      <div className="space-y-4">
        {showForm ? (
          <AppointmentForm appointment={editingAppointment || undefined} onClose={handleCloseForm} />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-end">
              <AppointmentFilters {...filterProps} />
              
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>
            
            <AppointmentsTable
              filteredAppointments={paginatedData}
              handleEditAppointment={handleEditAppointment}
              handleDeleteAppointment={handleDeleteAppointment}
              handleStatusChange={handleStatusChange}
              handleAutoAssign={handleAutoAssign}
              handleEditPoints={handleEditPoints}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
            
            <PointsEditDialog
              isOpen={isPointsDialogOpen}
              onClose={() => setIsPointsDialogOpen(false)}
              initialPoints={selectedAppointmentId ? 
                (filteredAppointments.find(a => a.id === selectedAppointmentId)?.points || 1) : 1}
              onSave={handleSavePoints}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default AppointmentsList;
