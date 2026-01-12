"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, ArrowLeft, Check, 
  MessageSquare, Globe, 
  Zap, ShieldCheck, Bot, Cpu, 
  Layout, Lock, Code, 
  Store, Truck, HelpCircle
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ZytechForm() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  
  const categoria = watch("categoria_servico"); 
  const segmento = watch("segmento");          
  const produto = watch("produto_plano");       

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    let jsonPayload = {};

    if (data.categoria_servico === 'chatbot') {
      const baseBot = { 
        link_catalogo: data.link_catalogo 
      };

      if (data.produto_plano === 'ZyStart') {
        jsonPayload = { ...baseBot, saudacao_inicial: data.bot_saudacao, qtd_opcoes_menu: data.bot_opcoes };
      }
      else if (data.produto_plano === 'ZyControl') {
        jsonPayload = { ...baseBot, saudacao_inicial: data.bot_saudacao, logica_fluxo: data.bot_logica };
      }
      else if (data.produto_plano === 'ZyBotAI') {
        jsonPayload = { 
          ...baseBot, 
          checklist_funcionalidades: data.ai_features || [], 
          base_conhecimento: data.bot_base,
          personalidade_ia: data.bot_persona 
        };
      }
      else if (data.produto_plano === 'ZyCore') {
        jsonPayload = { 
          ...baseBot, 
          integracoes_sistemas: data.core_integracoes, 
          regras_complexas: data.core_regras,
          personalidade_ia: data.bot_persona 
        };
      }
    }

    if (data.categoria_servico === 'website') {
      const baseSite = { 
        tem_identidade_visual: data.site_identidade, 
        sites_referencia: data.site_referencias 
      };

      if (data.produto_plano === 'WebStart') {
        jsonPayload = { ...baseSite, lista_paginas: data.site_paginas };
      }
      else if (data.produto_plano === 'WebControl') {
        jsonPayload = { ...baseSite, quem_faz_login: data.site_login, itens_dashboard: data.site_dashboard };
      }
      else if (data.produto_plano === 'WebCore') {
        jsonPayload = { ...baseSite, escopo_sistema_completo: data.site_custom };
      }
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
      alert("✅ Recebido com Sucesso! A Zytech entrará em contato.");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 py-8">
      
      <div className="w-full max-w-3xl bg-black border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px]">
        
        <div className="bg-zinc-900 h-2 w-full">
          <div 
            className="h-full bg-blue-600 shadow-[0_0_20px_#2563eb] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-12 flex-1 flex flex-col">
          
          <div className="mb-8">
            <span className="inline-block py-1 px-3 rounded text-[10px] font-bold bg-zinc-900 text-zinc-400 border border-zinc-800 mb-4 uppercase tracking-widest">
              Passo {step} / 4
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
              {step === 1 && "Objetivo do Projeto"}
              {step === 2 && "Dados da Empresa"}
              {step === 3 && "Escolha a Tecnologia"}
              {step === 4 && "Detalhes Técnicos"}
            </h1>
            <p className="text-zinc-500 text-lg">
              {step === 1 && "Selecione o serviço principal."}
              {step === 2 && "Precisamos conhecer seu negócio."}
              {step === 3 && "Qual plano se encaixa melhor?"}
              {step === 4 && "Preencha para gerar o orçamento."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 flex-1 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {step === 1 && (
              <div className="grid grid-cols-1 gap-4">
                <OptionCard 
                  id="chatbot" 
                  title="Chatbots & Automação" 
                  desc="Atendimento automático no WhatsApp (Com ou sem IA)." 
                  icon={<MessageSquare size={28} />} 
                  register={register} 
                  current={categoria} 
                />
                <OptionCard 
                  id="website" 
                  title="Websites & Sistemas" 
                  desc="Landing Pages, Dashboards e Software Web." 
                  icon={<Globe size={28} />} 
                  register={register} 
                  current={categoria} 
                />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Nome da Empresa</label>
                    <input 
                      {...register("nome_empresa", { required: true })} 
                      className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Digite o nome..." 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase ml-1">WhatsApp / Contato</label>
                    <input 
                      {...register("whatsapp", { required: true })} 
                      className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                      placeholder="(00) 00000-0000" 
                    />
                  </div>
                </div>

                {categoria === 'chatbot' && (
                  <div className="pt-6 border-t border-zinc-800 animate-in fade-in">
                    <div className="flex items-center gap-2 mb-4">
                      <Store className="text-blue-500" size={18} />
                      <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">Configuração de Nicho</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <label className={`cursor-pointer p-4 rounded-xl border transition-all text-center
                        ${segmento === 'delivery' ? 'bg-blue-900/20 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <input type="radio" value="delivery" {...register("segmento")} className="hidden" />
                        <div className="flex justify-center mb-2"><Truck /></div>
                        <span className="font-bold text-sm">Delivery</span>
                      </label>
                      
                      <label className={`cursor-pointer p-4 rounded-xl border transition-all text-center
                        ${segmento === 'comercio' ? 'bg-blue-900/20 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <input type="radio" value="comercio" {...register("segmento")} className="hidden" />
                        <div className="flex justify-center mb-2"><Store /></div>
                        <span className="font-bold text-sm">Comércio</span>
                      </label>
                    </div>
                    {segmento === 'comercio' && (
                      <div className="mt-4 animate-in slide-in-from-top-2 space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Qual o Ramo de Atividade?</label>
                        <input 
                          {...register("ramo_atividade")} 
                          className="w-full bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="Ex: Petshop, Clínica, Advocacia..." 
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-1 gap-3">
                
                {categoria === 'chatbot' && (
                  <>
                    <PlanRow id="ZyStart" title="ZyStart" badge="BÁSICO" register={register} current={produto} />
                    <PlanRow id="ZyControl" title="ZyControl" badge="CONTROLE" register={register} current={produto} />
                    <PlanRow id="ZyBotAI" title="ZyBotAI" badge="IA + PDF" highlight register={register} current={produto} />
                    <PlanRow id="ZyCore" title="ZyCore" badge="CUSTOM" register={register} current={produto} />
                  </>
                )}

                {categoria === 'website' && (
                  <>
                    <PlanRow id="WebStart" title="WebStart" badge="LANDING" register={register} current={produto} />
                    <PlanRow id="WebControl" title="WebControl" badge="SISTEMA" highlight register={register} current={produto} />
                    <PlanRow id="WebCore" title="WebCore" badge="SAAS" register={register} current={produto} />
                  </>
                )}

              </div>
            )}
            {step === 4 && (
              <div className="space-y-8">
                
                {categoria === 'chatbot' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase ml-1 flex items-center gap-2">Link do Cardápio / PDF <span className="text-[10px] bg-zinc-800 px-1 rounded text-zinc-500">IMPORTANTE</span></label>
                      <input 
                        {...register("link_catalogo")} 
                        className="w-full bg-zinc-900 border border-zinc-700 border-dashed rounded-xl p-4 text-white focus:border-blue-500 outline-none"
                        placeholder="Cole o link do Google Drive/Site aqui..." 
                      />
                    </div>

                    {produto === 'ZyStart' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Saudação Inicial</label>
                          <input {...register("bot_saudacao")} className="input-box-modern" placeholder="Ex: Olá, digite sua opção..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Qtd. Opções</label>
                          <input type="number" {...register("bot_opcoes")} className="input-box-modern" placeholder="Ex: 4" />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyControl' && (
                      <div className="space-y-4">
                         <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Saudação Inicial</label>
                          <input {...register("bot_saudacao")} className="input-box-modern" placeholder="Ex: Bem-vindo à Zytech..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Explique a Lógica</label>
                          <textarea {...register("bot_logica")} className="input-box-modern h-32" placeholder="Ex: Se digitar 1 vai pro Comercial, se 2 Suporte..." />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyBotAI' && (
                      <div className="space-y-6">
                        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
                           <span className="text-xs font-bold text-blue-400 uppercase mb-3 block">O que a IA deve fazer?</span>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {['Agendamento', 'Vendas', 'Tirar Dúvidas', 'Suporte'].map((item) => (
                                <label key={item} className="flex items-center gap-3 p-3 bg-black rounded-lg cursor-pointer border border-zinc-800 hover:border-blue-500 transition-colors">
                                  <input type="checkbox" value={item} {...register("ai_features")} className="w-4 h-4 rounded bg-zinc-800 text-blue-500 focus:ring-blue-500" />
                                  <span className="text-sm text-zinc-300">{item}</span>
                                </label>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Personalidade do Bot</label>
                           <input {...register("bot_persona")} className="input-box-modern" placeholder="Ex: Formal, Jovem, Vendedor..." />
                        </div>

                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Base de Conhecimento (Texto)</label>
                           <textarea {...register("bot_base")} className="input-box-modern h-32" placeholder="Cole aqui o texto que a IA deve estudar..." />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyCore' && (
                      <div className="space-y-4">
                         <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Integrações (API/ERP)</label>
                           <textarea {...register("core_integracoes")} className="input-box-modern h-24" placeholder="Quais sistemas vamos conectar?" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Regras de Negócio</label>
                           <textarea {...register("core_regras")} className="input-box-modern h-32" placeholder="Descreva a complexidade..." />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {categoria === 'website' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Identidade Visual</label>
                        <select {...register("site_identidade")} className="input-box-modern">
                          <option value="sim">Tenho Logo/Cores</option>
                          <option value="nao">Preciso Criar</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Sites de Referência</label>
                        <input {...register("site_referencias")} className="input-box-modern" placeholder="Cole links..." />
                      </div>
                    </div>

                    {produto === 'WebStart' && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Quais as 5 Páginas?</label>
                        <textarea {...register("site_paginas")} className="input-box-modern h-32" placeholder="Ex: Home, Contato, Sobre..." />
                      </div>
                    )}

                    {produto === 'WebControl' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Quem faz Login?</label>
                           <input {...register("site_login")} className="input-box-modern" placeholder="Clientes, Admins..." />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Itens do Dashboard</label>
                           <textarea {...register("site_dashboard")} className="input-box-modern h-32" placeholder="Gráficos, Tabelas..." />
                        </div>
                      </div>
                    )}

                    {produto === 'WebCore' && (
                      <div className="space-y-2">
                         <label className="text-xs font-bold text-zinc-400 uppercase ml-1">Escopo do Sistema</label>
                         <textarea {...register("site_custom")} className="input-box-modern h-48" placeholder="Descreva tudo..." />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="pt-8 mt-auto flex gap-4 border-t border-zinc-900">
              
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="w-1/3 py-4 rounded-xl border border-zinc-700 text-zinc-400 font-bold hover:bg-zinc-900 hover:text-white transition-all uppercase text-sm"
                >
                  Voltar
                </button>
              )}

              <button 
                type="submit" 
                onClick={(e) => { 
                  if(step < 4) { 
                    e.preventDefault(); 
                    setStep(step + 1); 
                  } 
                }}
                disabled={
                  (step === 1 && !categoria) ||
                  (step === 2 && (!watch("nome_empresa") || !watch("whatsapp"))) ||
                  (step === 2 && categoria === 'chatbot' && !segmento) ||
                  (step === 3 && !produto)
                }
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wide"
              >
                {isLoading ? "Enviando..." : step === 4 ? "Finalizar Proposta" : "Próximo Passo"}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style jsx global>{`
        .input-box-modern {
          @apply w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none shadow-sm;
        }
      `}</style>
    </div>
  );
}


function OptionCard({ id, title, desc, icon, register, current }: any) {
  const isSelected = current === id;
  return (
    <label className={`cursor-pointer relative p-6 rounded-2xl border transition-all duration-200 flex items-center gap-5
      ${isSelected 
        ? 'bg-blue-900/10 border-blue-600 shadow-lg shadow-blue-900/20' 
        : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'}`}>
      <input type="radio" value={id} {...register("categoria_servico")} className="hidden" />
      <div className={`p-3 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-black text-zinc-500'}`}>
        {icon}
      </div>
      <div>
        <h3 className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{title}</h3>
        <p className="text-zinc-500 text-sm">{desc}</p>
      </div>
      {isSelected && <div className="absolute right-6 text-blue-500"><Check /></div>}
    </label>
  );
}

function PlanRow({ id, title, badge, register, current, highlight }: any) {
  const isSelected = current === id;
  return (
    <label className={`cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all
      ${isSelected 
        ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
        : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600 text-zinc-400'}`}>
      <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white' : 'border-zinc-600'}`}>
          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <span className={`font-bold ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{title}</span>
      </div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase
        ${isSelected ? 'bg-white/20 border-white/20 text-white' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}
        ${highlight && !isSelected ? 'text-blue-400 border-blue-900 bg-blue-900/10' : ''}`}>
        {badge}
      </span>
    </label>
  );
}