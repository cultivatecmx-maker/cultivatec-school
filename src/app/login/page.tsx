"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: await signIn(email, password) then redirect
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-white rounded-full" />
          <div className="absolute bottom-40 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 border border-white rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm overflow-hidden p-1">
              <img src="/logo.png" alt="CultivaTec" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-bold text-white">CultivaTec</span>
              <span className="text-xs text-blue-200 block -mt-0.5 uppercase tracking-wider">
                Schools
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Transforma la educación
            <br />
            en robótica de tu escuela
          </h1>
          <p className="text-lg text-blue-100 max-w-md">
            Gestiona clases, monitorea el progreso de tus estudiantes y genera
            reportes con nuestra plataforma integral.
          </p>
          <div className="flex items-center gap-4 pt-4">
            {["147+ Escuelas", "12K+ Estudiantes", "98% Satisfacción"].map(
              (stat) => (
                <div
                  key={stat}
                  className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <span className="text-sm font-medium text-white">{stat}</span>
                </div>
              )
            )}
          </div>
        </div>

        <p className="relative z-10 text-sm text-blue-200">
          &copy; 2026 CultivaTec. Todos los derechos reservados.
        </p>
      </div>

      {/* Right panel - login */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-sm border border-blue-100 overflow-hidden p-1">
              <img src="/logo.png" alt="CultivaTec" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-slate-900">
              CultivaTec Schools
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Iniciar Sesión
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Accede al panel de control de tu institución
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="maestro@escuela.edu"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Contraseña
                    </label>
                    <a
                      href="#"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Ingresar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-400">
            ¿No tienes cuenta?{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Solicita una demo
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
