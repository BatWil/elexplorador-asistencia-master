"use client"; // Asegura que este componente solo se ejecute en el cliente

import { useState, useEffect } from "react";
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

const fetchData = async () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false); // Para evitar SSR

  useEffect(() => {
    setIsClient(true); // Asegura que el componente se monte en el cliente
  }, []);

  const [userType, setUserType] = useState<"admin" | "parental">("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const myPromise = fetchData();

    if (userType === "admin") {
      if (username === "Administracion" && password === "Power007") {
        toast
          .promise(myPromise, {
            loading: "Analizando...",
            success: "Inicio de sesión exitoso",
            error: "Error: No se pudo iniciar sesión",
          })
          .then(() => {
            router.push("/asistencia");
            router.refresh();
          });
      } else {
        toast.error("Usuario o contraseña incorrectos. Inténtelo de nuevo.");
      }
    } else {
      toast("Inicio de sesión como usuario parental - Requiere validación");
      router.push("/parental-home");
      router.refresh();
    }
  };

  if (!isClient) return null; // Evita que el SSR renderice contenido erróneo

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <button className="mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Back
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
              <Select
                value={userType}
                onValueChange={(value: "admin" | "parental") =>
                  setUserType(value)
                }
              >
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
