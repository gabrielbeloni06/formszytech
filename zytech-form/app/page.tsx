"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  Moon, Sun, CheckCircle, ArrowRight, 
  Bot, ShieldCheck, Zap, Cpu, Upload, Store, 
  Globe, Layout, Lock, Code, MessageSquare, Briefcase, Settings
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ZytechForm() {

  const [step, setStep] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, setValue, resetField, formState: { errors } } = useForm();
  
  const segmento = watch("segmento");
  const categoria = watch("categoria_servico"); 
  const produto = watch("produto_plano");

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    setValue("produto_plano", null); 
  }, [categoria, setValue]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let jsonPayload = {};

    if (data.categoria_servico === 'chatbot') {
      if (data.produto_plano === 'ZyStart') jsonPayload = { saudacao: data.bot_saudacao, opcoes: data.bot_opcoes };
      if (data.produto_plano === 'ZyControl') jsonPayload = { saudacao: data.bot_saudacao, logica: data.bot_logica };
      if (data.produto_plano === 'ZyBotAI') jsonPayload = { funcs: data.bot_checklist, base: data.bot_base };
      if (data.produto_plano === 'ZyCore') jsonPayload = { persona: data.bot_persona, escopo: data.bot_custom };
      jsonPayload = { ...jsonPayload, link_catalogo: data.link_catalogo };
    }

    if (data.categoria_servico === 'website') {
      const baseSite = { tem_identidade_visual: data.site_identidade, referencias: data.site_referencias };
      
      if (data.produto_plano === 'WebStart') jsonPayload = { ...baseSite, paginas_extras: data.site_paginas };
      if (data.produto_plano === 'WebControl') jsonPayload = { ...baseSite, tipo_login: data.site_login, dashboard: data.site_dashboard };
      if (data.produto_plano === 'WebCore') jsonPayload = { ...baseSite, escopo_avancado: data.site_custom };
    }

    try {
      const { error } = await supabase.from('leads_zytech').insert({
        nome_empresa: data.nome_empresa,
        whatsapp: data.whatsapp,
        segmento: data.segmento,
        ramo_atividade: data.ramo_atividade,
        categoria_servico: data.categoria_servico,
        produto_plano: data.produto_plano,
        dados_tecnicos: jsonPayload
      });

      if (error) throw error;
      alert("🚀 Sucesso! A Zytech recebeu seu projeto.");
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center font-bold text-black shadow-lg shadow-green-500/20">Z</div>
          <span className="font-bold text-2xl tracking-tight">Zytech</span>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-yellow-400">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:py-12">
        
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4 md:gap-16">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all 
                ${step >= s ? 'bg-green-500 border-green-500 text-black' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
                {s}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in-up">

          {step === 1 && (
            <div className="max-w-lg mx-auto space-y-6">
              <h1 className="text-4xl font-bold text-center mb-2">Quem é você?</h1>
              <div className="space-y-4">
                <input {...register("nome_empresa", { required: true })} className="input-zytech" placeholder="Nome da Empresa" />
                <input {...register("whatsapp", { required: true })} className="input-zytech" placeholder="WhatsApp (00) 00000-0000" />
                <select {...register("segmento", { required: true })} className="input-zytech">
                  <option value="">Selecione o Segmento...</option>
                  <option value="delivery">Delivery</option>
                  <option value="comercio">Comércio / Serviços</option>
                </select>
                {segmento === 'comercio' && (
                  <input {...register("ramo_atividade")} className="input-zytech border-green-500/50" placeholder="Qual seu ramo de atividade?" />
                )}
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn-primary w-full mt-4">Próximo <ArrowRight /></button>
            </div>
          )}

          {step === 2 && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-10">O que vamos construir?</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <label className={`card-select ${categoria === 'chatbot' ? 'ring-2 ring-green-500 bg-zinc-900' : ''}`}>
                  <input type="radio" value="chatbot" {...register("categoria_servico")} className="hidden" />
                  <MessageSquare size={40} className="text-green-500 mb-4" />
                  <h3 className="text-xl font-bold">Chatbots Inteligentes</h3>
                  <p className="text-zinc-400 mt-2">Atendimento automático via WhatsApp com ou sem IA.</p>
                </label>

                <label className={`card-select ${categoria === 'website' ? 'ring-2 ring-blue-500 bg-zinc-900' : ''}`}>
                  <input type="radio" value="website" {...register("categoria_servico")} className="hidden" />
                  <Globe size={40} className="text-blue-500 mb-4" />
                  <h3 className="text-xl font-bold">Websites & Sistemas</h3>
                  <p className="text-zinc-400 mt-2">Landing Pages, Dashboards e Sistemas Web.</p>
                </label>

                <div className="card-select opacity-50 cursor-not-allowed border-dashed">
                  <Settings size={40} className="text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold">Automações</h3>
                  <p className="text-zinc-500 mt-2">Em breve</p>
                </div>

                 <div className="card-select opacity-50 cursor-not-allowed border-dashed">
                  <Briefcase size={40} className="text-zinc-600 mb-4" />
                  <h3 className="text-xl font-bold">Consultoria</h3>
                  <p className="text-zinc-500 mt-2">Em breve</p>
                </div>
              </div>

              <div className="flex gap-4 mt-10 justify-center">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">Voltar</button>
                <button type="button" onClick={() => setStep(3)} disabled={!categoria} className="btn-primary">Continuar</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold text-center mb-10">Escolha o Plano {categoria === 'chatbot' ? 'do Bot' : 'do Site'}</h1>

              {categoria === 'chatbot' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <PlanCard 
                    id="ZyStart" icon={<Zap />} title="ZyStart" desc="Menu numérico simples" color="green" register={register} selected={produto} 
                    features={['Menu Básico', 'Respostas Rápidas']} 
                  />
                  <PlanCard 
                    id="ZyControl" icon={<ShieldCheck />} title="ZyControl" desc="Fluxos lógicos e gestão" color="blue" register={register} selected={produto} 
                    features={['Painel Gestão', 'Árvore de Decisão']} 
                  />
                  <PlanCard 
                    id="ZyBotAI" icon={<Bot />} title="ZyBotAI" desc="Inteligência Artificial" color="purple" register={register} selected={produto} 
                    features={['Treinamento PDF', 'Linguagem Natural']} 
                  />
                  <PlanCard 
                    id="ZyCore" icon={<Cpu />} title="ZyCore" desc="API e Integrações" color="orange" register={register} selected={produto} 
                    features={['Sistema Próprio', 'API Custom']} 
                  />
                </div>
              )}

              {categoria === 'website' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  <PlanCard 
                    id="WebStart" icon={<Layout />} title="Site Start" desc="Presença Digital Rápida" color="cyan" register={register} selected={produto} 
                    features={['Landing Page', 'Até 5 páginas detalhe', 'Formulário Contato']} 
                  />

                  <PlanCard 
                    id="WebControl" icon={<Lock />} title="Site Control" desc="Sistema com Área de Membros" color="indigo" register={register} selected={produto} 
                    features={['Login/Auth', 'Dashboard Cliente', 'Gestão de Conteúdo']} 
                  />

                  <PlanCard 
                    id="WebCore" icon={<Code />} title="Site Core" desc="SaaS e Sistemas Complexos" color="rose" register={register} selected={produto} 
                    features={['SaaS Completo', 'Banco de Dados Complexo', 'Escalabilidade Total']} 
                  />
                </div>
              )}

              <div className="flex gap-4 mt-10 justify-center">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary">Voltar</button>
                <button type="button" onClick={() => setStep(4)} disabled={!produto} className="btn-primary">Configurar</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="max-w-xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-center mb-6">Configurando <span className="text-green-500">{produto}</span></h1>

              {categoria === 'chatbot' && (
                <>
                  <div className="input-group">
                    <label>Link do Catálogo/Cardápio</label>
                    <input {...register("link_catalogo")} className="input-zytech" placeholder="URL do Drive ou PDF" />
                  </div>

                  {(produto === 'ZyStart' || produto === 'ZyControl') && (
                    <div className="input-group">
                      <label>Saudação Inicial</label>
                      <input {...register("bot_saudacao")} className="input-zytech" placeholder="Ex: Olá, bem-vindo!" />
                    </div>
                  )}

                  {produto === 'ZyStart' && (
                    <div className="input-group">
                      <label>Qtd. Opções Menu</label>
                      <input type="number" {...register("bot_opcoes")} className="input-zytech" />
                    </div>
                  )}

                  {produto === 'ZyControl' && (
                    <div className="input-group">
                      <label>Lógica do Fluxo</label>
                      <textarea {...register("bot_logica")} className="input-zytech h-24" placeholder="Descreva o caminho do cliente..." />
                    </div>
                  )}

                  {produto === 'ZyBotAI' && (
                    <div className="input-group">
                      <label>Base de Conhecimento</label>
                      <textarea {...register("bot_base")} className="input-zytech h-24" placeholder="Textos para a IA aprender..." />
                    </div>
                  )}

                  {produto === 'ZyCore' && (
                    <div className="input-group">
                      <label>Escopo Custom</label>
                      <textarea {...register("bot_custom")} className="input-zytech h-24" />
                    </div>
                  )}
                </>
              )}

              {categoria === 'website' && (
                <>
                  <div className="input-group">
                    <label>Já possui Identidade Visual (Logo/Cores)?</label>
                    <select {...register("site_identidade")} className="input-zytech">
                      <option value="sim">Sim, já tenho</option>
                      <option value="nao">Não, preciso criar</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Sites de Referência (O que você acha bonito?)</label>
                    <input {...register("site_referencias")} className="input-zytech" placeholder="Cole links de inspiração..." />
                  </div>

                  {produto === 'WebStart' && (
                    <div className="input-group">
                      <label>Quais seriam as 5 páginas de detalhe?</label>
                      <textarea {...register("site_paginas")} className="input-zytech h-24" placeholder="Ex: Sobre, Serviços, Contato..." />
                    </div>
                  )}

                  {produto === 'WebControl' && (
                    <>
                      <div className="input-group">
                        <label>Quem fará login no sistema?</label>
                        <input {...register("site_login")} className="input-zytech" placeholder="Ex: Clientes para ver pedidos, Admins..." />
                      </div>
                      <div className="input-group">
                        <label>O que deve ter no Dashboard?</label>
                        <textarea {...register("site_dashboard")} className="input-zytech h-24" placeholder="Ex: Gráficos de vendas, status de pedido..." />
                      </div>
                    </>
                  )}

                  {produto === 'WebCore' && (
                    <div className="input-group">
                      <label>Descreva o sistema completo</label>
                      <textarea {...register("site_custom")} className="input-zytech h-32" placeholder="Descreva todas as regras de negócio e integrações necessárias..." />
                    </div>
                  )}
                </>
              )}

              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setStep(3)} className="btn-secondary">Voltar</button>
                <button type="submit" disabled={isLoading} className="btn-primary">
                  {isLoading ? 'Enviando...' : 'Finalizar 🚀'}
                </button>
              </div>
            </div>
          )}

        </form>
      </main>

      <style jsx global>{`
        .input-zytech { @apply w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-green-500 outline-none transition-all; }
        .btn-primary { @apply w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all; }
        .btn-secondary { @apply w-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors; }
        .card-select { @apply relative cursor-pointer border border-zinc-700 p-6 rounded-2xl hover:border-green-500 transition-all flex flex-col items-center text-center bg-zinc-900/50 hover:bg-zinc-800; }
        .input-group { @apply space-y-1; }
        .input-group label { @apply text-sm font-medium ml-1 text-zinc-400; }
      `}</style>
    </div>
  );
}
function PlanCard({ id, icon, title, desc, color, register, selected, features }: any) {
  const isSelected = selected === id;
  const colorMap: any = {
    green:  'border-green-500  bg-green-500/10  text-green-500',
    blue:   'border-blue-500   bg-blue-500/10   text-blue-500',
    purple: 'border-purple-500 bg-purple-500/10 text-purple-500',
    orange: 'border-orange-500 bg-orange-500/10 text-orange-500',
    cyan:   'border-cyan-500   bg-cyan-500/10   text-cyan-500',
    indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-500',
    rose:   'border-rose-500   bg-rose-500/10   text-rose-500',
  };
  
  const activeClass = colorMap[color];

  return (
    <label className={`relative group cursor-pointer border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 
      ${isSelected ? `${activeClass} ring-1` : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-500'}`}>
      <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
      
      <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center ${isSelected ? 'bg-transparent' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'} ${isSelected ? activeClass.split(' ')[2] : ''}`}>
        {icon}
      </div>
      
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 h-10 leading-relaxed">{desc}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex gap-2 text-xs text-zinc-500 dark:text-zinc-300">
            <CheckCircle size={14} className={isSelected ? activeClass.split(' ')[2] : 'text-zinc-500'} /> {f}
          </li>
        ))}
      </ul>

      <div className={`w-full py-2 rounded-lg text-center text-xs font-bold transition-colors 
        ${isSelected ? activeClass.split(' ')[2].replace('text', 'bg') + ' text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
        {isSelected ? 'Selecionado' : 'Escolher'}
      </div>
    </label>
  );
}