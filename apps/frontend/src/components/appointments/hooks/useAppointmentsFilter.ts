
import { useState, useMemo } from "react";
import { useStore } from "@/context/StoreContext";
import { AppointmentStatus } from "@/context/StoreContext";
import { useDebounce } from "@/hooks/useDebounce";

export const useAppointmentsFilter = () => {
  const { appointments } = useStore();

  // Filters
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">("all");
  const [groomerFilter, setGroomerFilter] = useState("all");

  // Debounce the date filter to avoid excessive filtering
  const debouncedDateFilter = useDebounce(dateFilter, 300);

  // Apply filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Filter by date (using debounced value)
      if (debouncedDateFilter && appointment.date !== debouncedDateFilter) {
        return false;
      }

      // Filter by status
      if (statusFilter !== "all" && appointment.status !== statusFilter) {
        return false;
      }

      // Filter by groomer
      if (groomerFilter !== "all" && groomerFilter !== "unassigned") {
        if (appointment.groomerId !== groomerFilter) {
          return false;
        }
      } else if (groomerFilter === "unassigned") {
        if (appointment.groomerId) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, debouncedDateFilter, statusFilter, groomerFilter]);

  return {
    dateFilter,
    statusFilter,
    groomerFilter,
    setDateFilter,
    setStatusFilter,
    setGroomerFilter,
    filteredAppointments
  };
};
