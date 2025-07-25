
import React, { useState, useEffect } from "react";
import { Pet } from "@/context/models/types";
import { usePets } from "@/context/pets/PetContext";
import { useClients } from "@/context/clients/ClientContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

interface PetFormProps {
  pet?: Pet;
  onClose: () => void;
  clientId?: string;
}

const PetForm: React.FC<PetFormProps> = ({ pet, onClose, clientId }) => {
  const { clients } = useClients();
  const { addPet, updatePet } = usePets();
  const isEditing = !!pet;
  
  const [formData, setFormData] = useState<Omit<Pet, 'id'>>({
    clientId: clientId || "",
    name: "",
    species: "",
    breed: "",
    birthDate: "",
    observations: "",
    foodType: "",
    lastTickMedicine: { name: "", date: new Date().toISOString().split('T')[0] },
    rabiesVaccine: { isUpToDate: true, lastDate: new Date().toISOString().split('T')[0] },
    vaccineHistory: [],
  });
  
  const [currentVaccine, setCurrentVaccine] = useState({ name: "", date: new Date().toISOString().split('T')[0] });
  
  useEffect(() => {
    if (pet) {
      setFormData({
        clientId: pet.clientId,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || "",
        birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : "",
        observations: pet.observations || "",
        foodType: pet.foodType || "",
        lastTickMedicine: pet.lastTickMedicine || { name: "", date: "" },
        rabiesVaccine: pet.rabiesVaccine || { isUpToDate: false, lastDate: "" },
        vaccineHistory: pet.vaccineHistory || [],
      });
    }
  }, [pet]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTickMedicineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, lastTickMedicine: { ...prev.lastTickMedicine, [name]: value } as any }));
  };
  
  const handleRabiesDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, rabiesVaccine: { ...prev.rabiesVaccine, lastDate: value } as any }));
  };
  
  const handleRabiesStatusChange = (value: boolean) => {
    setFormData(prev => ({ ...prev, rabiesVaccine: { ...prev.rabiesVaccine, isUpToDate: value } as any }));
  };

  const handleVaccineInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentVaccine(prev => ({ ...prev, [name]: value }));
  };
  
  const addVaccineToHistory = () => {
    if (currentVaccine.name.trim() === "") {
      toast({ title: "Erro", description: "Por favor, insira o nome da vacina.", variant: "destructive" });
      return;
    }
    setFormData(prev => ({ ...prev, vaccineHistory: [...prev.vaccineHistory, { ...currentVaccine }] }));
    setCurrentVaccine({ name: "", date: new Date().toISOString().split('T')[0] });
  };
  
  const removeVaccineFromHistory = (index: number) => {
    setFormData(prev => ({ ...prev, vaccineHistory: prev.vaccineHistory.filter((_, i) => i !== index) }));
  };
  
  const handleSubmit = async () => {
    if (!formData.clientId || !formData.name || !formData.species) {
      toast({ title: "Erro", description: "Por favor, preencha os campos obrigatórios: Cliente, Nome do Pet e Espécie.", variant: "destructive" });
      return;
    }
    
    if (isEditing && pet) {
      await updatePet({ ...pet, ...formData });
    } else {
      await addPet(formData);
    }
    
    onClose();
  };
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Pet" : "Novo Pet"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <Select 
            value={formData.clientId}
            onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
            disabled={!!clientId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map(client => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nome do Pet *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Nome do pet" required />
          </div>
          <div>
            <Label htmlFor="species">Espécie *</Label>
            <Input id="species" name="species" value={formData.species} onChange={handleInputChange} placeholder="Cachorro, Gato..." required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="breed">Raça</Label>
            <Input id="breed" name="breed" value={formData.breed || ''} onChange={handleInputChange} placeholder="Ex: Golden Retriever" />
          </div>
          <div>
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input id="birthDate" name="birthDate" type="date" value={formData.birthDate || ''} onChange={handleInputChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="foodType">Tipo de Ração</Label>
          <Input id="foodType" name="foodType" value={formData.foodType || ''} onChange={handleInputChange} placeholder="Marca, tipo e frequência" />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Medicamento Anti-carrapato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tickMedicineName">Nome do Medicamento</Label>
              <Input id="tickMedicineName" name="name" value={formData.lastTickMedicine?.name || ''} onChange={handleTickMedicineChange} placeholder="Nome do medicamento" />
            </div>
            <div>
              <Label htmlFor="tickMedicineDate">Data de Aplicação</Label>
              <Input id="tickMedicineDate" name="date" type="date" value={formData.lastTickMedicine?.date || ''} onChange={handleTickMedicineChange} />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Vacina Contra Raiva</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <div>
              <Label htmlFor="rabiesDate">Data da Última Dose</Label>
              <Input id="rabiesDate" type="date" value={formData.rabiesVaccine?.lastDate || ''} onChange={handleRabiesDateChange} />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch id="rabiesStatus" checked={formData.rabiesVaccine?.isUpToDate || false} onCheckedChange={handleRabiesStatusChange} />
              <Label htmlFor="rabiesStatus">Vacina em dia</Label>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Histórico de Vacinas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <Label htmlFor="vaccineName">Nome da Vacina</Label>
              <Input id="vaccineName" name="name" value={currentVaccine.name} onChange={handleVaccineInputChange} placeholder="Nome da vacina" />
            </div>
            <div>
              <Label htmlFor="vaccineDate">Data de Aplicação</Label>
              <Input id="vaccineDate" name="date" type="date" value={currentVaccine.date} onChange={handleVaccineInputChange} />
            </div>
          </div>
          <Button type="button" size="sm" onClick={addVaccineToHistory}>Adicionar Vacina</Button>
          {formData.vaccineHistory.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium mb-2">Vacinas Registradas:</h4>
              <div className="bg-gray-50 rounded border p-2">
                <ul className="divide-y">
                  {formData.vaccineHistory.map((vaccine, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                      <div>
                        <span className="font-medium">{vaccine.name}</span>
                        <span className="text-sm text-gray-500 ml-2">{new Date(vaccine.date).toLocaleDateString()}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeVaccineFromHistory(index)}>Remover</Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default PetForm;
