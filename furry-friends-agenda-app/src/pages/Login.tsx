import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  
  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    login(email, password).then(success => {
        if (!success) {
            toast({
              title: "Erro de autenticação",
              description: "Usuário ou senha incorretos.",
              variant: "destructive"
            });
          }
    });
  };
  
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Scissors className="h-12 w-12 text-petshop-purple" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PetShop Manager</h1>
          <p className="text-gray-500">Faça login para acessar o sistema</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Digite seu email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Digite sua senha"
            />
          </div>
          
          <div className="pt-2">
            <Button onClick={handleLogin} className="w-full">
              Entrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;