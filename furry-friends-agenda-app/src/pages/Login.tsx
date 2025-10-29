import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scissors } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // Auto-login para desenvolvimento
  useEffect(() => {
    const enableDevAutoLogin = import.meta.env.VITE_ENABLE_DEV_AUTO_LOGIN === 'true';
    if (enableDevAutoLogin) {
      setEmail("superadmin@furryfriends.com");
      setPassword("SuperAdmin123!");
    }
  }, []);
  
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
    <div className="h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
                <Scissors className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">PetShop Manager</CardTitle>
          <CardDescription>Faça login para acessar o sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="seu@email.com"
              type="email"
            />
          </div>
          
          <div className="space-y-2">
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

          <div className="text-center text-sm">
            Não tem uma conta?{" "}
            <Link to="/register" className="underline text-primary">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;