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
        jsonPayload = { 
          ...baseBot, 
          saudacao_inicial: data.bot_saudacao, 
          qtd_opcoes_menu: data.bot_opcoes 
        };
      }
      else if (data.produto_plano === 'ZyControl') {
        jsonPayload = { 
          ...baseBot, 
          saudacao_inicial: data.bot_saudacao, 
          logica_fluxo: data.bot_logica 
        };
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
        jsonPayload = { 
          ...baseSite, 
          lista_paginas: data.site_paginas 
        };
      }
      else if (data.produto_plano === 'WebControl') {
        jsonPayload = { 
          ...baseSite, 
          quem_faz_login: data.site_login, 
          itens_dashboard: data.site_dashboard 
        };
      }
      else if (data.produto_plano === 'WebCore') {
        jsonPayload = { 
          ...baseSite, 
          escopo_sistema_completo: data.site_custom 
        };
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
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 py-12">
      
      <div className="w-full max-w-3xl bg-[#09090b] border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden relative">
        
        <div className="bg-zinc-900 h-1.5 w-full">
          <div 
            className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb] transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 md:p-10">
          
          <div className="mb-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-500 mb-4 tracking-widest uppercase">
              Etapa {step} de 4
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              {step === 1 && "Qual seu objetivo?"}
              {step === 2 && "Dados da Empresa"}
              {step === 3 && "Escolha a Tecnologia"}
              {step === 4 && "Detalhes Técnicos"}
            </h1>
            <p className="text-zinc-500">
              {step === 1 && "Selecione o tipo de serviço que você procura."}
              {step === 2 && "Precisamos entender quem é você."}
              {step === 3 && "Qual arquitetura atende sua necessidade?"}
              {step === 4 && "Preencha as especificações para o orçamento."}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <label className={`cursor-pointer group relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-2xl
                  ${categoria === 'chatbot' 
                    ? 'bg-blue-900/10 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.1)]' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'}`}>
                  <input type="radio" value="chatbot" {...register("categoria_servico")} className="hidden" />
                  <div className={`p-4 rounded-full transition-colors ${categoria === 'chatbot' ? 'bg-blue-600 text-white' : 'bg-black text-zinc-600 group-hover:text-zinc-400'}`}>
                    <MessageSquare size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className={`text-xl font-bold mb-1 ${categoria === 'chatbot' ? 'text-white' : 'text-zinc-300'}`}>Chatbots</h3>
                    <p className="text-zinc-500 text-sm">Automação WhatsApp</p>
                  </div>
                </label>

                <label className={`cursor-pointer group relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-2xl
                  ${categoria === 'website' 
                    ? 'bg-blue-900/10 border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.1)]' 
                    : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900 hover:border-zinc-700'}`}>
                  <input type="radio" value="website" {...register("categoria_servico")} className="hidden" />
                  <div className={`p-4 rounded-full transition-colors ${categoria === 'website' ? 'bg-blue-600 text-white' : 'bg-black text-zinc-600 group-hover:text-zinc-400'}`}>
                    <Globe size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className={`text-xl font-bold mb-1 ${categoria === 'website' ? 'text-white' : 'text-zinc-300'}`}>Websites</h3>
                    <p className="text-zinc-500 text-sm">Sistemas & LPs</p>
                  </div>
                </label>

              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 max-w-xl mx-auto">
                
                <div className="space-y-5">
                  <div className="group">
                    <label className="input-label">Nome da Empresa</label>
                    <input 
                      {...register("nome_empresa", { required: true })} 
                      className="input-box"
                      placeholder="Ex: Zytech Solutions" 
                    />
                  </div>

                  <div className="group">
                    <label className="input-label">WhatsApp de Contato</label>
                    <input 
                      {...register("whatsapp", { required: true })} 
                      className="input-box"
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
                      <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all 
                        ${segmento === 'delivery' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <input type="radio" value="delivery" {...register("segmento")} className="hidden" />
                        <Truck className="mx-auto mb-2" />
                        <span className="font-bold text-sm">Delivery</span>
                      </label>
                      
                      <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all 
                        ${segmento === 'comercio' ? 'bg-blue-900/20 border-blue-500 text-blue-400' : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                        <input type="radio" value="comercio" {...register("segmento")} className="hidden" />
                        <Store className="mx-auto mb-2" />
                        <span className="font-bold text-sm">Comércio</span>
                      </label>
                    </div>

                    {segmento === 'comercio' && (
                      <div className="mt-4 animate-in slide-in-from-top-2">
                        <label className="input-label">Qual o Ramo de Atividade?</label>
                        <input 
                          {...register("ramo_atividade")} 
                          className="input-box"
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
                    <PlanCard 
                      id="ZyStart" title="ZyStart" desc="Menu numérico simples e respostas rápidas." 
                      badge="BÁSICO" icon={<Zap />} register={register} selected={produto} 
                    />
                    <PlanCard 
                      id="ZyControl" title="ZyControl" desc="Fluxos lógicos e gestão de atendimento." 
                      badge="GESTÃO" icon={<ShieldCheck />} register={register} selected={produto} 
                    />
                    <PlanCard 
                      id="ZyBotAI" title="ZyBotAI" desc="Inteligência Artificial treinada." 
                      badge="POPULAR" icon={<Bot />} register={register} selected={produto} highlight 
                    />
                    <PlanCard 
                      id="ZyCore" title="ZyCore" desc="Integrações via API e Sistemas." 
                      badge="CUSTOM" icon={<Cpu />} register={register} selected={produto} 
                    />
                  </>
                )}

                {categoria === 'website' && (
                  <>
                    <PlanCard 
                      id="WebStart" title="WebStart" desc="Landing Page + 5 Páginas de detalhe." 
                      badge="INSTITUCIONAL" icon={<Layout />} register={register} selected={produto} 
                    />
                    <PlanCard 
                      id="WebControl" title="WebControl" desc="Área de Login, Membros e Dashboard." 
                      badge="SISTEMA" icon={<Lock />} register={register} selected={produto} highlight 
                    />
                    <PlanCard 
                      id="WebCore" title="WebCore" desc="SaaS completo e Banco de Dados complexo." 
                      badge="ENTERPRISE" icon={<Code />} register={register} selected={produto} 
                    />
                  </>
                )}

              </div>
            )}

            {step === 4 && (
              <div className="space-y-8">
                
                {categoria === 'chatbot' && (
                  <>
                    <div className="p-5 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-700">
                      <label className="input-label flex items-center gap-2">
                         Link do Cardápio / Catálogo <span className="text-zinc-600 text-[10px] font-normal">(Google Drive/PDF)</span>
                      </label>
                      <input {...register("link_catalogo")} className="input-box" placeholder="Cole o link aqui..." />
                    </div>

                    {produto === 'ZyStart' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="input-label">Saudação Inicial</label>
                          <input {...register("bot_saudacao")} className="input-box" placeholder="Ex: Olá, digite sua opção..." />
                        </div>
                        <div>
                          <label className="input-label">Qtd. Opções Menu</label>
                          <input type="number" {...register("bot_opcoes")} className="input-box" placeholder="Ex: 4" />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyControl' && (
                      <div className="space-y-4">
                         <div>
                          <label className="input-label">Saudação Inicial</label>
                          <input {...register("bot_saudacao")} className="input-box" placeholder="Ex: Bem-vindo à Zytech..." />
                        </div>
                        <div>
                          <label className="input-label">Lógica do Fluxo</label>
                          <textarea {...register("bot_logica")} className="input-box h-32" placeholder="Descreva: Se cliente digitar 1, acontece X. Se digitar 2, Y..." />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyBotAI' && (
                      <div className="space-y-6">
                        <div className="bg-black p-5 rounded-xl border border-zinc-800">
                           <span className="input-label mb-3 block text-blue-400">Funcionalidades da IA</span>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {['Agendamento', 'Tirar Pedidos/Vendas', 'Responder Dúvidas (FAQ)', 'Triagem de Suporte'].map((item) => (
                                <label key={item} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 transition-colors">
                                  <input type="checkbox" value={item} {...register("ai_features")} className="w-5 h-5 rounded bg-black border-zinc-600 text-blue-500 focus:ring-blue-500" />
                                  <span className="text-sm text-zinc-300">{item}</span>
                                </label>
                              ))}
                           </div>
                        </div>

                        <div>
                           <label className="input-label">Personalidade (Persona)</label>
                           <input {...register("bot_persona")} className="input-box" placeholder="Ex: Jovem e descolado, ou Formal e sério..." />
                        </div>

                        <div>
                           <label className="input-label">Base de Conhecimento (Resumo)</label>
                           <textarea {...register("bot_base")} className="input-box h-32" placeholder="Cole aqui os textos principais que a IA deve aprender..." />
                        </div>
                      </div>
                    )}

                    {produto === 'ZyCore' && (
                      <div className="space-y-4">
                         <div>
                           <label className="input-label">Integrações Necessárias</label>
                           <textarea {...register("core_integracoes")} className="input-box h-24" placeholder="Quais sistemas vamos conectar? (Bling, RD Station, API Própria...)" />
                        </div>
                        <div>
                           <label className="input-label">Regras de Negócio Complexas</label>
                           <textarea {...register("core_regras")} className="input-box h-32" placeholder="Descreva automações específicas, webhooks e validações..." />
                        </div>
                        <div>
                           <label className="input-label">Personalidade (Se houver IA)</label>
                           <input {...register("bot_persona")} className="input-box" />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {categoria === 'website' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="input-label">Identidade Visual</label>
                        <select {...register("site_identidade")} className="input-box">
                          <option value="sim">Sim, tenho Logo/Cores</option>
                          <option value="nao">Não, preciso criar</option>
                        </select>
                      </div>
                      <div>
                        <label className="input-label">Referências (Links)</label>
                        <input {...register("site_referencias")} className="input-box" placeholder="Sites que você gosta..." />
                      </div>
                    </div>

                    {produto === 'WebStart' && (
                      <div>
                        <label className="input-label">Quais serão as 5 páginas?</label>
                        <textarea {...register("site_paginas")} className="input-box h-32" placeholder="Ex: Home, Sobre Nós, Serviços, Galeria, Contato..." />
                      </div>
                    )}

                    {produto === 'WebControl' && (
                      <div className="space-y-4">
                        <div>
                           <label className="input-label">Quem fará Login?</label>
                           <input {...register("site_login")} className="input-box" placeholder="Ex: Clientes para ver pedidos, Funcionários para lançar dados..." />
                        </div>
                        <div>
                           <label className="input-label">O que deve ter no Dashboard?</label>
                           <textarea {...register("site_dashboard")} className="input-box h-32" placeholder="Ex: Gráfico de vendas mensal, Lista de últimos pedidos, Status..." />
                        </div>
                      </div>
                    )}

                    {produto === 'WebCore' && (
                      <div>
                         <label className="input-label">Escopo Completo do Sistema</label>
                         <textarea {...register("site_custom")} className="input-box h-48" placeholder="Descreva detalhadamente o SaaS, níveis de permissão, fluxo de dados e integrações..." />
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            <div className="pt-8 flex flex-col md:flex-row gap-4 border-t border-zinc-800 mt-8">
              
              {step > 1 && (
                <button 
                  type="button" 
                  onClick={() => setStep(step - 1)}
                  className="w-full md:w-1/3 py-4 rounded-xl border-2 border-zinc-800 text-zinc-400 font-bold hover:bg-zinc-900 hover:text-white hover:border-zinc-600 transition-all uppercase tracking-wide text-sm"
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
                className="w-full flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none text-sm uppercase tracking-wide"
              >
                {isLoading ? (
                  "Enviando..."
                ) : step === 4 ? (
                  <>Finalizar Proposta <Check size={20} /></>
                ) : (
                  <>Próximo Passo <ArrowRight size={20} /></>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          @apply w-full bg-black border-2 border-zinc-800 rounded-xl p-4 text-white text-base focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all placeholder:text-zinc-600 resize-none shadow-inner;
        }
        .input-label {
          @apply block text-xs font-bold text-zinc-400 mb-2 ml-1 uppercase tracking-wider;
        }
      `}</style>
    </div>
  );
}


function PlanCard({ id, title, desc, badge, icon, register, selected, highlight }: any) {
  const isSelected = selected === id;
  return (
    <label className={`cursor-pointer p-5 rounded-xl border-2 flex items-center justify-between transition-all duration-200 group
      ${isSelected 
        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/50 scale-[1.02]' 
        : 'bg-black border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:bg-zinc-900'}`}>
      
      <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
      
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors
          ${isSelected ? 'bg-blue-500 border-blue-400 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500 group-hover:text-white'}`}>
          {icon}
        </div>
        <div>
          <span className={`block font-bold text-lg ${isSelected ? 'text-white' : 'text-zinc-200'}`}>{title}</span>
          <span className={`text-xs block ${isSelected ? 'text-blue-100' : 'text-zinc-500'}`}>{desc}</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase tracking-widest
          ${isSelected ? 'bg-white/20 border-white/20 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
          {badge}
        </span>
        {isSelected && <Check size={16} className="text-white" />}
      </div>
    </label>
  );
}