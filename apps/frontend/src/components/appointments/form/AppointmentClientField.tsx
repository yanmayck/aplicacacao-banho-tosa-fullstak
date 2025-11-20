import React from "react";
import { useStore } from "@/context/StoreContext";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormFieldProps } from "./types";

export const AppointmentClientField: React.FC<FormFieldProps & { isAdmin: boolean; }> = ({ formData, handleSelectChange, isAdmin }) => {
  const { clients, pets } = useStore();

  return (
    <>
      <div>
        <Label htmlFor="clientId">Cliente *</Label>
        <Select 
          value={formData.clientId || ""} 
          onValueChange={(value) => handleSelectChange("clientId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map(client => {
              const clientPets = pets.filter(pet => pet.clientId === client.id);
              const petNames = clientPets.map(p => p.name).join(', ');
              return (
                <SelectItem key={client.id} value={client.id}>
                  {client.name} ({petNames || 'Nenhum pet'})
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};