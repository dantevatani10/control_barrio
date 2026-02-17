import Link from "next/link";
import { Shield, ArrowRight, CheckCircle2, Building2, Users, Lock, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Shield size={24} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">AccessControl SaaS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/demo"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Ver Demo Live
            </Link>
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-slate-900/20">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide mb-8">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                Nuevo Estándar 2026
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-8">
                Seguridad Inteligente para <span className="text-blue-600">Barrios Cerrados.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg">
                Plataforma integral para la gestión de visitas, control de proveedores y validación de seguros ART en tiempo real. Sin costos de instalación.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  href="/dashboard/demo"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1"
                >
                  Ver Demo Activa <ArrowRight size={20} />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                  Agendar Reunión
                </button>
              </div>

              <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Validación ART</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>QR Dinámicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span>Apps Nativas</span>
                </div>
              </div>
            </div>

            {/* Demo Showcase Card */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-full blur-3xl opacity-60"></div>
              <Link href="/dashboard/demo" className="relative group cursor-pointer w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                  {/* Fake Browser Header */}
                  <div className="bg-slate-900 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="ml-4 bg-slate-800 rounded-md px-3 py-1 text-xs text-gray-400 flex-1 text-center font-mono">
                      app.accesobarrio.com/dashboard
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Demo Activa</div>
                        <h3 className="text-lg font-bold text-slate-900">Barrio Santa Clara</h3>
                      </div>
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-200 transition-colors">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Shield className="text-blue-600" size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Vista Guardia</div>
                          <div className="text-xs text-slate-500">Escaner QR y Control</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-green-200 transition-colors">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Smartphone className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">App Vecino</div>
                          <div className="text-xs text-slate-500">Invitaciones WhatsApp</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-purple-200 transition-colors">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Building2 className="text-purple-600" size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">Panel Admin</div>
                          <div className="text-xs text-slate-500">Auditoría y Seguros</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center text-blue-600 font-bold text-sm group-hover:underline">
                      Probar Ahora →
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-slate-500" />
            <span className="font-semibold text-slate-300">AccessControl SaaS © 2026</span>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Términos y Condiciones</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
