"use client";

import React, { useState } from "react";
import {
  School,
  User,
  Shield,
  Bell,
  Key,
  Save,
  Upload,
  Globe,
  Mail,
  Check,
} from "lucide-react";

import { TopBar } from "@/components/layout/top-bar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useData } from "@/context/data-context";

export default function SettingsPage() {
  const { user, school, updateUser, updateSchool, showToast, classes, stats } = useData();

  const [schoolName, setSchoolName] = useState(school.name);
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);

  // Password dialog
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification preferences
  const [notifStudents, setNotifStudents] = useState(true);
  const [notifModules, setNotifModules] = useState(true);
  const [notifReports, setNotifReports] = useState(true);

  // Saving states
  const [savingSchool, setSavingSchool] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveSchool = () => {
    setSavingSchool(true);
    setTimeout(() => {
      updateSchool({ name: schoolName.trim() });
      setSavingSchool(false);
    }, 500);
  };

  const handleSaveProfile = () => {
    setSavingProfile(true);
    setTimeout(() => {
      updateUser({ name: userName.trim(), email: userEmail.trim() });
      setSavingProfile(false);
    }, 500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    showToast("Contraseña actualizada exitosamente");
    setPasswordOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen">
      <TopBar title="Configuración" subtitle="Administra tu cuenta y la de tu institución" />

      <div className="p-6 max-w-4xl">
        <Tabs defaultValue="school">
          <TabsList className="mb-6">
            <TabsTrigger value="school" className="gap-2"><School className="w-4 h-4" />Institución</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" />Perfil</TabsTrigger>
            <TabsTrigger value="license" className="gap-2"><Shield className="w-4 h-4" />Licencia</TabsTrigger>
          </TabsList>

          {/* School Tab */}
          <TabsContent value="school">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Institución</CardTitle>
                  <CardDescription>Datos generales de tu escuela en la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-dashed border-blue-200">
                      <School className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => showToast("Funcionalidad de logo próximamente", "info")}>
                        <Upload className="w-4 h-4" />Subir logo
                      </Button>
                      <p className="text-xs text-slate-400 mt-1.5">PNG, JPG hasta 2MB. Recomendado 200x200px.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nombre de la institución</label>
                      <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">ID de la escuela</label>
                      <Input value={school.schoolId} disabled className="bg-slate-50 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Máximo de estudiantes</label>
                      <Input value={school.maxStudents} disabled className="bg-slate-50 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Fecha de registro</label>
                      <Input value={school.createdAt || "—"} disabled className="bg-slate-50 text-slate-400" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2" onClick={handleSaveSchool} disabled={savingSchool || !schoolName.trim()}>
                      {savingSchool ? (<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />) : (<Save className="w-4 h-4" />)}
                      {savingSchool ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mi Perfil</CardTitle>
                  <CardDescription>Información personal de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{userName}</h3>
                      <p className="text-sm text-slate-500">{userEmail}</p>
                      <Badge variant="info" className="mt-1.5 capitalize">{user.role === "admin" ? "Administrador" : "Maestro"}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Nombre completo</label>
                      <Input value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                      <Input value={userEmail} onChange={(e) => setUserEmail(e.target.value)} type="email" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Rol</label>
                      <Input value={user.role === "admin" ? "Administrador" : "Maestro"} disabled className="bg-slate-50 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Contraseña</label>
                      <Button variant="outline" className="w-full gap-2" onClick={() => setPasswordOpen(true)}>
                        <Key className="w-4 h-4" />Cambiar contraseña
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="gap-2" onClick={handleSaveProfile} disabled={savingProfile || !userName.trim() || !userEmail.trim()}>
                      {savingProfile ? (<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />) : (<Save className="w-4 h-4" />)}
                      {savingProfile ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-slate-500" />Notificaciones</CardTitle>
                  <CardDescription>Configura cómo quieres recibir alertas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Nuevos estudiantes", desc: "Recibe una notificación cuando un estudiante se une a tu clase", icon: User, checked: notifStudents, onChange: () => { setNotifStudents(!notifStudents); showToast(notifStudents ? "Notificación desactivada" : "Notificación activada", "info"); } },
                      { title: "Módulos completados", desc: "Alerta cuando un estudiante completa un módulo", icon: Shield, checked: notifModules, onChange: () => { setNotifModules(!notifModules); showToast(notifModules ? "Notificación desactivada" : "Notificación activada", "info"); } },
                      { title: "Reportes semanales", desc: "Resumen semanal de actividad por correo electrónico", icon: Mail, checked: notifReports, onChange: () => { setNotifReports(!notifReports); showToast(notifReports ? "Notificación desactivada" : "Notificación activada", "info"); } },
                    ].map((notif) => (
                      <div key={notif.title} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50"><notif.icon className="w-5 h-5 text-blue-600" /></div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">{notif.title}</p>
                            <p className="text-xs text-slate-500">{notif.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={notif.checked} onChange={notif.onChange} className="sr-only peer" />
                          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* License Tab */}
          <TabsContent value="license">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-600" />Licencia Activa</CardTitle>
                <CardDescription>Estado y detalles de tu suscripción</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-sm font-medium text-blue-200">Plan actual</p>
                      <h3 className="text-2xl font-bold mt-1">CultivaTec Pro</h3>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">Activa</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-xs text-blue-200">Estudiantes</p><p className="text-lg font-bold">{stats.totalStudents} / {school.maxStudents}</p></div>
                    <div><p className="text-xs text-blue-200">Clases</p><p className="text-lg font-bold">{classes.length} / Ilimitadas</p></div>
                    <div><p className="text-xs text-blue-200">Válida hasta</p><p className="text-lg font-bold">Oct 2026</p></div>
                    <div><p className="text-xs text-blue-200">Días restantes</p><p className="text-lg font-bold">{stats.licenseDaysRemaining}</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="text-sm font-semibold text-slate-900">Incluido en tu plan</h4>
                    <ul className="space-y-1.5">
                      {["Hasta 200 estudiantes", "Clases ilimitadas", "Todos los módulos de robótica", "Reportes avanzados", "Soporte prioritario", "Exportación de datos"].map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">¿Necesitas más?</h4>
                    <p className="text-sm text-slate-500">Actualiza tu plan para desbloquear más estudiantes, integraciones avanzadas y soporte dedicado.</p>
                    <Button variant="outline" className="w-full gap-2" onClick={() => showToast("Solicitud enviada. Nuestro equipo te contactará pronto.", "info")}>
                      <Globe className="w-4 h-4" />Contactar Ventas
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>Ingresa tu contraseña actual y la nueva contraseña</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Contraseña actual</label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nueva contraseña</label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirmar contraseña</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>Cancelar</Button>
              <Button type="submit">Cambiar Contraseña</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
