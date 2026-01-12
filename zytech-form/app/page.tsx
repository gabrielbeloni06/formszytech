"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, ArrowLeft, Check, 
  MessageSquare, Globe, 
  Zap, ShieldCheck, Bot, Cpu, 
  Layout, Lock, Code, 
  Store, Truck, Link as LinkIcon, FileText, ChevronRight, Send
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ZytechForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const categoria = watch("categoria_servico");
  const segmento = watch("segmento");
  const produto = watch("produto_plano");

  useEffect(() => { setMounted(true) }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let jsonPayload = {};

    if (data.categoria_servico === 'chatbot') {
      const baseBot = { link_catalogo: data.link_catalogo };
      if (data.produto_plano === 'ZyStart') {
        jsonPayload = { ...baseBot, saudacao: data.bot_saudacao, qtd_opcoes: data.bot_opcoes };
      }
      else if (data.produto_plano === 'ZyControl') {
        jsonPayload = { ...baseBot, saudacao: data.bot_saudacao, logica: data.bot_logica };
      }
      else if (data.produto_plano === 'ZyBotAI') {
        jsonPayload = { ...baseBot, funcs: data.ai_features, base: data.bot_base, persona: data.bot_persona };
      }
      else if (data.produto_plano === 'ZyCore') {
        jsonPayload = { ...baseBot, integracoes: data.core_integracoes, regras: data.core_regras, persona: data.bot_persona };
      }
    }

    if (data.categoria_servico === 'website') {
      const baseSite = { identidade: data.site_identidade, referencias: data.site_referencias };
      if (data.produto_plano === 'WebStart') jsonPayload = { ...baseSite, paginas: data.site_paginas };
      else if (data.produto_plano === 'WebControl') jsonPayload = { ...baseSite, login: data.site_login, dashboard: data.site_dashboard };
      else if (data.produto_plano === 'WebCore') jsonPayload = { ...baseSite, escopo: data.site_custom };
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
      alert("✅ Recebido! A Zytech entrará em contato.");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;


  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[650px]">
        
        <div className="bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-800 p-8 md:w-64 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-10 text-indigo-400">
               <Cpu size={24} />
               <span className="font-bold text-xl tracking-tight text-white">Zytech<span className="text-indigo-500">.io</span></span>
            </div>
            
            <nav className="space-y-6">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className={`flex items-center gap-4 transition-all duration-300 ${s === step ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all
                    ${s === step ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 
                      s < step ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-400' : 'bg-transparent border-slate-700 text-slate-500'}`}>
                    {s < step ? <Check size={14} /> : s}
                  </div>
                  <span className={`text-sm font-medium ${s === step ? 'text-white' : 'text-slate-400'}`}>
                    {s === 1 && "Objetivo"}
                    {s === 2 && "Empresa"}
                    {s === 3 && "Plano"}
                    {s === 4 && "Detalhes"}
                  </span>
                </div>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:block text-xs text-slate-600">
            © 2024 Zytech Systems
          </div>
        </div>

        <div className="flex-1 flex flex-col relative">
            
            <div className="h-1 bg-slate-800 w-full md:hidden">
                <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
            </div>

            <div className="p-6 md:p-10 flex-1 flex flex-col overflow-y-auto max-h-[85vh] md:max-h-full scrollbar-hide">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 1 && "Vamos começar."}
                        {step === 2 && "Sobre o negócio."}
                        {step === 3 && "Escolha a tecnologia."}
                        {step === 4 && "Configuração Final."}
                    </h2>
                    <p className="text-slate-400">
                        {step === 1 && "Qual o foco principal do desenvolvimento?"}
                        {step === 2 && "Precisamos dos seus dados para contato."}
                        {step === 3 && "Selecione o nível de complexidade ideal."}
                        {step === 4 && "Preencha os detalhes técnicos para o orçamento."}
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col gap-6 animate-in fade-in duration-500">
                    
                    {step === 1 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ServiceCard 
                                id="chatbot" 
                                title="Automação & IA" 
                                desc="Chatbots inteligentes para WhatsApp e CRM."
                                icon={<Bot size={32} />}
                                register={register}
                                current={categoria}
                            />
                            <ServiceCard 
                                id="website" 
                                title="Web & Software" 
                                desc="Sites, Landing Pages e Sistemas SaaS."
                                icon={<Layout size={32} />}
                                register={register}
                                current={categoria}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-5">
                                <InputGroup label="Nome da Empresa" placeholder="Ex: Zytech Solutions" register={register} name="nome_empresa" required />
                                <InputGroup label="WhatsApp Principal" placeholder="(11) 99999-9999" register={register} name="whatsapp" required />
                            </div>

                            {categoria === 'chatbot' && (
                                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 space-y-4 animate-in slide-in-from-bottom-2">
                                    <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                                        <Store size={16} /> Nicho de Atuação
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <RadioBox value="delivery" label="Delivery" icon={<Truck />} register={register} name="segmento" current={segmento} />
                                        <RadioBox value="comercio" label="Comércio / Serviços" icon={<Store />} register={register} name="segmento" current={segmento} />
                                    </div>
                                    {segmento === 'comercio' && (
                                        <div className="pt-2 animate-in fade-in">
                                            <InputGroup label="Ramo Específico" placeholder="Ex: Clínica Odontológica" register={register} name="ramo_atividade" />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-3">
                            {categoria === 'chatbot' && (
                                <>
                                    <PlanCard id="ZyStart" title="ZyStart" price="Entrada" desc="Menu simples e respostas rápidas." register={register} current={produto} />
                                    <PlanCard id="ZyControl" title="ZyControl" price="Intermediário" desc="Lógica condicional e setores." register={register} current={produto} />
                                    <PlanCard id="ZyBotAI" title="ZyBotAI" price="Avançado" desc="Inteligência Artificial treinada com PDF." featured register={register} current={produto} />
                                    <PlanCard id="ZyCore" title="ZyCore" price="Enterprise" desc="Integrações complexas via API." register={register} current={produto} />
                                </>
                            )}
                            {categoria === 'website' && (
                                <>
                                    <PlanCard id="WebStart" title="WebStart" price="Landing Page" desc="Página única de alta conversão." register={register} current={produto} />
                                    <PlanCard id="WebControl" title="WebControl" price="Institucional" desc="Multi-páginas com painel admin." featured register={register} current={produto} />
                                    <PlanCard id="WebCore" title="WebCore" price="SaaS Custom" desc="Software web sob medida." register={register} current={produto} />
                                </>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                             {categoria === 'chatbot' && (
                                <div className="space-y-6">
                                    <div className="p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                                        <InputGroup label="Link do Material (PDF/Drive)" placeholder="Cole o link aqui..." register={register} name="link_catalogo" icon={<LinkIcon size={16}/>} />
                                    </div>

                                    {produto === 'ZyStart' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputGroup label="Saudação Inicial" placeholder="Olá, tudo bem?" register={register} name="bot_saudacao" />
                                            <InputGroup label="Qtd. Opções Menu" type="number" placeholder="Ex: 3" register={register} name="bot_opcoes" />
                                        </div>
                                    )}

                                    {produto === 'ZyControl' && (
                                         <div className="space-y-4">
                                            <InputGroup label="Saudação Inicial" placeholder="Bem-vindo à empresa..." register={register} name="bot_saudacao" />
                                            <TextAreaGroup label="Explique a Lógica do Fluxo" placeholder="Se cliente digitar 1, encaminhar para..." register={register} name="bot_logica" />
                                         </div>
                                    )}

                                    {produto === 'ZyBotAI' && (
                                        <div className="space-y-6">
                                            <div className="p-5 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                                                <label className="text-sm font-semibold text-indigo-300 mb-3 block">Funcionalidades da IA</label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {['Agendamento', 'Vendas', 'FAQ / Dúvidas', 'Suporte N1'].map((feat) => (
                                                        <label key={feat} className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors">
                                                            <input type="checkbox" value={feat} {...register("ai_features")} className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900" />
                                                            <span className="text-sm text-slate-300">{feat}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <InputGroup label="Persona do Bot" placeholder="Ex: Vendedor carismático..." register={register} name="bot_persona" />
                                            <TextAreaGroup label="Base de Conhecimento" placeholder="Cole aqui as informações vitais..." register={register} name="bot_base" height="h-32" />
                                        </div>
                                    )}

                                    {produto === 'ZyCore' && (
                                        <div className="space-y-4">
                                            <TextAreaGroup label="Quais sistemas iremos integrar?" placeholder="ERPs, CRMs, APIs externas..." register={register} name="core_integracoes" />
                                            <TextAreaGroup label="Regras de Negócio" placeholder="Detalhamento técnico..." register={register} name="core_regras" />
                                        </div>
                                    )}
                                </div>
                             )}

                            {categoria === 'website' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Identidade Visual</label>
                                            <select {...register("site_identidade")} className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                                                <option value="sim">Tenho Logo e Cores</option>
                                                <option value="nao">Preciso criar do Zero</option>
                                            </select>
                                        </div>
                                        <InputGroup label="Referências (Links)" placeholder="Sites que você gosta..." register={register} name="site_referencias" />
                                    </div>

                                    {produto === 'WebStart' && (
                                        <TextAreaGroup label="Estrutura das Páginas" placeholder="Quais seções o site terá?" register={register} name="site_paginas" />
                                    )}

                                    {produto === 'WebControl' && (
                                        <div className="space-y-4">
                                            <InputGroup label="Quem fará login?" placeholder="Clientes, Admin..." register={register} name="site_login" />
                                            <TextAreaGroup label="O que deve ter no Dashboard?" placeholder="Gráficos, tabelas..." register={register} name="site_dashboard" />
                                        </div>
                                    )}

                                    {produto === 'WebCore' && (
                                        <TextAreaGroup label="Escopo do Sistema (Documentação)" placeholder="Descreva o funcionamento completo..." register={register} name="site_custom" height="h-48" />
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>

            <div className="p-6 md:p-10 border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm flex gap-4 z-10">
                 {step > 1 && (
                    <button 
                        type="button"
                        onClick={() => setStep(step - 1)}
                        className="px-6 py-4 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all font-medium"
                    >
                        <ArrowLeft size={20} />
                    </button>
                 )}
                 
                 <button 
                    onClick={(e) => {
                        if (step < 4) {
                            e.preventDefault();
                            setStep(step + 1);
                        } else {
                            handleSubmit(onSubmit)(e);
                        }
                    }}
                    disabled={
                        isLoading ||
                        (step === 1 && !categoria) ||
                        (step === 2 && (!watch("nome_empresa") || !watch("whatsapp"))) ||
                        (step === 2 && categoria === 'chatbot' && !segmento) ||
                        (step === 3 && !produto)
                    }
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                 >
                    {isLoading ? "Processando..." : step === 4 ? "Enviar Projeto" : "Continuar"}
                    {!isLoading && (step === 4 ? <Send size={20} /> : <ArrowRight size={20} />)}
                 </button>
            </div>

        </div>
      </div>
    </div>
  );
}


function ServiceCard({ id, title, desc, icon, register, current }: any) {
    const isSelected = current === id;
    return (
        <label className={`cursor-pointer relative group flex flex-col p-6 rounded-2xl border-2 transition-all duration-300
            ${isSelected 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                : 'bg-slate-800/40 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}>
            <input type="radio" value={id} {...register("categoria_servico")} className="hidden" />
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors
                ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-700/50 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
                {icon}
            </div>
            <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            {isSelected && <div className="absolute top-4 right-4 text-indigo-500"><Check size={20} strokeWidth={3} /></div>}
        </label>
    );
}

function InputGroup({ label, register, name, required, placeholder, type = "text", icon }: any) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1 flex items-center gap-1">
                {icon} {label} {required && <span className="text-indigo-500">*</span>}
            </label>
            <input 
                {...register(name, { required })} 
                type={type}
                placeholder={placeholder}
                className="w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-3.5 text-slate-100 placeholder-slate-600 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all shadow-sm"
            />
        </div>
    )
}

function TextAreaGroup({ label, register, name, placeholder, height = "h-24" }: any) {
    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
            <textarea 
                {...register(name)} 
                placeholder={placeholder}
                className={`w-full bg-slate-800/50 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-600 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none shadow-sm ${height}`}
            />
        </div>
    )
}

function RadioBox({ value, label, icon, register, name, current }: any) {
    const isSelected = current === value;
    return (
        <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border transition-all
            ${isSelected ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-600'}`}>
            <input type="radio" value={value} {...register(name)} className="hidden" />
            <div className={`mb-2 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`}>{icon}</div>
            <span className="font-semibold text-sm">{label}</span>
        </label>
    )
}

function PlanCard({ id, title, price, desc, register, current, featured }: any) {
    const isSelected = current === id;
    return (
        <label className={`cursor-pointer flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group
            ${isSelected 
                ? 'bg-gradient-to-r from-indigo-900/40 to-slate-800 border-indigo-500' 
                : `bg-slate-800/30 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 ${featured ? 'border-indigo-500/30' : ''}`}`}>
            <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
            
            <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${isSelected ? 'border-indigo-500' : 'border-slate-600 group-hover:border-slate-500'}`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{title}</h4>
                        {featured && <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">POPULAR</span>}
                    </div>
                    <p className="text-xs text-slate-500">{desc}</p>
                </div>
            </div>

            <div className={`text-sm font-semibold text-right ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                {price}
            </div>
        </label>
    )
}