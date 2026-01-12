"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  Moon, Sun, ArrowRight, ArrowLeft, Check,
  MessageSquare, Globe, Settings, Briefcase, 
  Zap, ShieldCheck, Bot, Cpu, 
  Layout, Lock, Code, Store, Truck
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ZytechForm() {
  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  
  const categoria = watch("categoria_servico");
  const segmento = watch("segmento");
  const produto = watch("produto_plano");

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let jsonPayload = {};

    if (data.categoria_servico === 'chatbot') {
      const common = { link_catalogo: data.link_catalogo };
      if (data.produto_plano === 'ZyStart') jsonPayload = { ...common, saudacao: data.bot_saudacao, opcoes: data.bot_opcoes };
      if (data.produto_plano === 'ZyControl') jsonPayload = { ...common, saudacao: data.bot_saudacao, logica: data.bot_logica };
      if (data.produto_plano === 'ZyBotAI') jsonPayload = { ...common, funcs: data.bot_checklist, base: data.bot_base };
      if (data.produto_plano === 'ZyCore') jsonPayload = { ...common, persona: data.bot_persona, escopo: data.bot_custom };
    }

    if (data.categoria_servico === 'website') {
      const common = { identidade_visual: data.site_identidade, referencias: data.site_referencias };
      if (data.produto_plano === 'WebStart') jsonPayload = { ...common, paginas: data.site_paginas };
      if (data.produto_plano === 'WebControl') jsonPayload = { ...common, login: data.site_login, dashboard: data.site_dashboard };
      if (data.produto_plano === 'WebCore') jsonPayload = { ...common, escopo_avancado: data.site_custom };
    }

    try {
      const { error } = await supabase.from('leads_zytech').insert({
        nome_empresa: data.nome_empresa,
        whatsapp: data.whatsapp,
        segmento: data.categoria_servico === 'chatbot' ? data.segmento : null,
        ramo_atividade: data.categoria_servico === 'chatbot' ? data.ramo_atividade : null,
        categoria_servico: data.categoria_servico,
        produto_plano: data.produto_plano,
        dados_tecnicos: jsonPayload
      });

      if (error) throw error;
      alert("✅ Recebido! Entraremos em contato.");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${isDarkMode ? 'bg-[#09090b] text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center font-bold text-black text-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">Z</div>
            <span className="font-bold text-xl tracking-tight">Zytech</span>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 md:gap-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all 
                  ${step === s ? 'border-emerald-500 bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' : 
                    step > s ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' : 
                    'border-zinc-800 bg-zinc-900 text-zinc-600'}`}>
                  {step > s ? <Check size={14} /> : s}
                </div>
                {s !== 4 && <div className={`w-6 md:w-16 h-[2px] rounded ${step > s ? 'bg-emerald-500/50' : 'bg-zinc-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">

          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">O que vamos construir?</h1>
                <p className="text-zinc-400">Selecione o serviço principal.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BigCard 
                  icon={<MessageSquare size={32} />} title="Chatbots" desc="Automação WhatsApp" 
                  value="chatbot" register={register} current={categoria} color="emerald"
                />
                <BigCard 
                  icon={<Globe size={32} />} title="Websites" desc="Sistemas & Landing Pages" 
                  value="website" register={register} current={categoria} color="blue"
                />
                <BigCard 
                  icon={<Settings size={32} />} title="Automação" desc="Em breve" 
                  value="automacao" register={register} current={categoria} disabled
                />
                <BigCard 
                  icon={<Briefcase size={32} />} title="Consultoria" desc="Em breve" 
                  value="consultoria" register={register} current={categoria} disabled
                />
              </div>

              <div className="flex justify-end mt-8">
                <button type="button" onClick={() => setStep(2)} disabled={!categoria} 
                  className="btn-primary">
                  Continuar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 max-w-lg mx-auto">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Sobre o Projeto</h1>
                <p className="text-zinc-400">Contexto para o orçamento.</p>
              </div>

              <div className="space-y-5">
                <InputGroup label="Nome da Empresa">
                  <input {...register("nome_empresa", { required: true })} className="input-field" placeholder="Ex: Zytech Solutions" />
                </InputGroup>

                <InputGroup label="WhatsApp de Contato">
                  <input {...register("whatsapp", { required: true })} className="input-field" placeholder="(00) 00000-0000" />
                </InputGroup>

                {categoria === 'chatbot' && (
                  <div className="p-5 bg-zinc-900/50 border border-emerald-500/20 rounded-xl space-y-4 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="text-emerald-500" size={18} />
                      <span className="font-bold text-emerald-400">Configuração do Bot</span>
                    </div>
                    
                    <InputGroup label="Qual o tipo de operação?">
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${segmento === 'delivery' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'}`}>
                          <input type="radio" value="delivery" {...register("segmento")} className="hidden" />
                          <div className="flex flex-col items-center gap-1">
                            <Truck size={20} /> <span className="text-sm font-bold">Delivery</span>
                          </div>
                        </label>
                        <label className={`cursor-pointer p-3 rounded-lg border text-center transition-all ${segmento === 'comercio' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800 border-zinc-700 hover:border-zinc-600'}`}>
                          <input type="radio" value="comercio" {...register("segmento")} className="hidden" />
                          <div className="flex flex-col items-center gap-1">
                            <Store size={20} /> <span className="text-sm font-bold">Comércio</span>
                          </div>
                        </label>
                      </div>
                    </InputGroup>

                    {segmento === 'comercio' && (
                      <InputGroup label="Qual o ramo? (Ex: Roupas, Petshop)">
                        <input {...register("ramo_atividade")} className="input-field border-emerald-500/30 focus:border-emerald-500" placeholder="Digite o ramo..." />
                      </InputGroup>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">Voltar</button>
                <button type="button" onClick={() => setStep(3)} 
                  disabled={!watch("nome_empresa") || !watch("whatsapp") || (categoria === 'chatbot' && !segmento)} 
                  className="btn-primary flex-1">
                  Ver Planos <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Planos para {categoria === 'chatbot' ? 'Chatbot' : 'Website'}</h1>
                <p className="text-zinc-400">Escolha a arquitetura ideal.</p>
              </div>

              {categoria === 'chatbot' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <PlanCard id="ZyStart" icon={<Zap />} title="ZyStart" desc="Menu simples e rápido" color="green" register={register} selected={produto} />
                  <PlanCard id="ZyControl" icon={<ShieldCheck />} title="ZyControl" desc="Fluxos lógicos e gestão" color="blue" register={register} selected={produto} />
                  <PlanCard id="ZyBotAI" icon={<Bot />} title="ZyBotAI" desc="Inteligência Artificial" color="purple" register={register} selected={produto} />
                  <PlanCard id="ZyCore" icon={<Cpu />} title="ZyCore" desc="API Customizada" color="orange" register={register} selected={produto} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PlanCard id="WebStart" icon={<Layout />} title="Site Start" desc="Landing Page + 5 Pags" color="cyan" register={register} selected={produto} />
                  <PlanCard id="WebControl" icon={<Lock />} title="Site Control" desc="Login e Dashboard" color="indigo" register={register} selected={produto} />
                  <PlanCard id="WebCore" icon={<Code />} title="Site Core" desc="SaaS Completo" color="rose" register={register} selected={produto} />
                </div>
              )}

              <div className="flex gap-3 pt-6 justify-center max-w-md mx-auto">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">Voltar</button>
                <button type="button" onClick={() => setStep(4)} disabled={!produto} className="btn-primary flex-1">
                  Configurar <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Detalhes do <span className="text-emerald-500">{produto}</span></h1>
              </div>

              <div className="space-y-5 bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
                
                {categoria === 'chatbot' && (
                  <>
                    <InputGroup label="Link do Catálogo/Cardápio">
                      <input {...register("link_catalogo")} className="input-field" placeholder="Cole o link aqui..." />
                    </InputGroup>

                    {(produto === 'ZyStart' || produto === 'ZyControl') && (
                      <InputGroup label="Frase de Saudação">
                        <input {...register("bot_saudacao")} className="input-field" placeholder="Ex: Olá, bem-vindo..." />
                      </InputGroup>
                    )}
                    {produto === 'ZyStart' && (
                       <InputGroup label="Qtd. Opções Menu"><input type="number" {...register("bot_opcoes")} className="input-field" /></InputGroup>
                    )}
                    {produto === 'ZyControl' && (
                       <InputGroup label="Lógica do Fluxo"><textarea {...register("bot_logica")} className="input-field h-24" placeholder="Descreva o fluxo..." /></InputGroup>
                    )}
                    {produto === 'ZyBotAI' && (
                       <InputGroup label="Base de Conhecimento"><textarea {...register("bot_base")} className="input-field h-32" placeholder="Textos para a IA..." /></InputGroup>
                    )}
                    {produto === 'ZyCore' && (
                       <InputGroup label="Escopo Customizado"><textarea {...register("bot_custom")} className="input-field h-32" /></InputGroup>
                    )}
                  </>
                )}

                {categoria === 'website' && (
                  <>
                    <InputGroup label="Identidade Visual">
                      <select {...register("site_identidade")} className="input-field">
                        <option value="sim">Tenho Logo e Cores</option>
                        <option value="nao">Preciso Criar</option>
                      </select>
                    </InputGroup>
                    <InputGroup label="Links de Referência">
                      <input {...register("site_referencias")} className="input-field" placeholder="Sites que você gosta..." />
                    </InputGroup>
                    
                    {produto === 'WebStart' && (
                      <InputGroup label="Quais páginas?"><textarea {...register("site_paginas")} className="input-field h-24" placeholder="Ex: Sobre, Contato..." /></InputGroup>
                    )}
                    {produto === 'WebControl' && (
                      <InputGroup label="Detalhes do Dashboard"><textarea {...register("site_dashboard")} className="input-field h-24" placeholder="O que deve aparecer no painel?" /></InputGroup>
                    )}
                    {produto === 'WebCore' && (
                      <InputGroup label="Descrição do Sistema"><textarea {...register("site_custom")} className="input-field h-32" placeholder="Descreva tudo..." /></InputGroup>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(3)} className="btn-secondary">Voltar</button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? 'Enviando...' : 'Finalizar Proposta 🚀'}
                </button>
              </div>
            </div>
          )}

        </form>
      </main>

      <style jsx global>{`
        .input-field {
          @apply w-full p-4 rounded-xl border border-zinc-700 bg-zinc-800 text-white placeholder-zinc-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all;
        }
        .btn-primary {
          @apply bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20;
        }
        .btn-secondary {
          @apply bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-6 rounded-xl transition-all border border-zinc-700;
        }
      `}</style>
    </div>
  );
}


function InputGroup({ label, children }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-300 ml-1">{label}</label>
      {children}
    </div>
  );
}

function BigCard({ icon, title, desc, value, register, current, color, disabled }: any) {
  const isSelected = current === value;
  const colors: any = { emerald: 'text-emerald-500 border-emerald-500 bg-emerald-500/10', blue: 'text-blue-500 border-blue-500 bg-blue-500/10' };
  const activeColor = colors[color] || 'text-zinc-500';

  return (
    <label className={`relative border-2 rounded-2xl p-6 flex flex-col items-center text-center transition-all cursor-pointer
      ${disabled ? 'opacity-40 cursor-not-allowed border-zinc-800 border-dashed bg-zinc-900/20' : 
        isSelected ? `${activeColor}` : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-600 hover:bg-zinc-800'}`}>
      <input type="radio" value={value} {...register("categoria_servico")} disabled={disabled} className="hidden" />
      <div className={`mb-3 ${isSelected ? 'scale-110' : 'text-zinc-500'} transition-transform duration-300`}>{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </label>
  );
}

function PlanCard({ id, icon, title, desc, color, register, selected }: any) {
  const isSelected = selected === id;
  const colorMap: any = {
    green:  'border-emerald-500 bg-emerald-500/10 text-emerald-400',
    blue:   'border-blue-500 bg-blue-500/10 text-blue-400',
    purple: 'border-purple-500 bg-purple-500/10 text-purple-400',
    orange: 'border-orange-500 bg-orange-500/10 text-orange-400',
    cyan:   'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
    rose:   'border-rose-500 bg-rose-500/10 text-rose-400',
  };
  const activeClass = colorMap[color];

  return (
    <label className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1
      ${isSelected ? activeClass : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'}`}>
      <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-full bg-zinc-950 ${isSelected ? '' : 'text-zinc-500'}`}>{icon}</div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-xs text-zinc-400 mt-1">{desc}</p>
        </div>
      </div>
      <div className={`mt-4 w-full py-2 rounded font-bold text-xs text-center ${isSelected ? 'bg-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
        {isSelected ? 'SELECIONADO' : 'ESCOLHER'}
      </div>
    </label>
  );
}