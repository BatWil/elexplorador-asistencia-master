"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

// Simula una API que podría validar credenciales
const fetchData = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"admin" | "parental">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Validando credenciales...");

    try {
      await fetchData(); // Simulación de petición a backend

      if (userType === "admin") {
        if (username === "Administracion" && password === "Power007") {
          toast.success("Inicio de sesión exitoso");
          
          window.location.href = "/"
        } else {
          throw new Error("Usuario o contraseña incorrectos");
        }
      } else {
        toast.success("Inicio de sesión como usuario parental");
        router.push("/parental-home");
      }
    } catch (error) {
      toast.error((error as Error).message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <div className="mx-auto max-w-md space-y-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-zinc-800" />
            <h1 className="text-2xl font-semibold">¡Bienvenido de nuevo!</h1>
            <p className="text-sm text-zinc-400">
              Inicie sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userType">Iniciar sesión como</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value as "admin" | "parental")}>
                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Seleccione tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="parental">Control Parental</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">
                {userType === "admin" ? "Nombre de usuario" : "Nombre del niño"}
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder={
                  userType === "admin"
                    ? "Ingrese su usuario"
                    : "Ingrese el nombre del niño"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700"
                placeholder={
                  userType === "admin"
                    ? "Ingrese su contraseña"
                    : "Ingrese el código generado"
                }
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
            >
              Iniciar sesión
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
