
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const success = await register(name, email, password);

    if (success) {
      toast({
        title: "Sucesso",
        description: "Cadastro realizado com sucesso! Você será redirecionado para o login.",
      });
      navigate("/login");
    } else {
      toast({
        title: "Erro de cadastro",
        description: "Não foi possível realizar o cadastro. Verifique os dados ou tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <Scissors className="h-12 w-12 text-petshop-purple" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
          <p className="text-gray-500">Insira seus dados para se cadastrar</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>
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
            <Button onClick={handleRegister} className="w-full">
              Cadastrar
            </Button>
          </div>
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
