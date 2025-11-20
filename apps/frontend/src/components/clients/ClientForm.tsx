
import React, { useState, useEffect } from "react";
import { Client, useStore } from "@/context/StoreContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { addClient, updateClient } = useStore();
  const { isAdmin } = useAuth();
  const isEditing = !!client;
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  
  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name,
        phone: client.phone || "",
        email: client.email || "",
        address: client.address || "",
      });
    }
  }, [client]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha os campos obrigatórios: Nome e Telefone.",
        variant: "destructive"
      });
      return;
    }

    if (!isAdmin()) {
      toast({
        title: "Permissão negada",
        description: "Apenas administradores podem cadastrar ou editar clientes.",
        variant: "destructive"
      });
      return;
    }
    
    if (isEditing && client) {
      updateClient({
        ...client,
        ...formData
      });
    } else {
      addClient(formData);
    }
    
    onClose();
  };
  
  if (!isAdmin()) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">Permissão negada</h3>
          <p className="text-sm text-gray-500 mt-2">
            Apenas administradores podem cadastrar ou editar clientes.
          </p>
          <Button className="mt-4" onClick={onClose}>Voltar</Button>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEditing ? "Editar Cliente" : "Novo Cliente"}</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome do Tutor *</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange} 
            placeholder="Nome completo do tutor" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone *</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone}
            onChange={handleChange} 
            placeholder="(00) 12345-6789"
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleChange} 
            placeholder="email@exemplo.com" 
          />
        </div>
        
        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address}
            onChange={handleChange} 
            placeholder="Endereço completo" 
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Atualizar" : "Cadastrar"}</Button>
        </div>
      </div>
    </Card>
  );
};

export default ClientForm;
