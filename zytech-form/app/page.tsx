"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowRight, Check, MessageSquare, Globe, 
  Zap, ShieldCheck, Bot, Cpu, 
  Layout, Lock, Code, Store, Truck, Server, Layers, Calendar, DollarSign, HelpCircle
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
      const common = { link_catalogo: data.link_catalogo };
      
      if (data.produto_plano === 'ZyStart') {
        jsonPayload = { ...common, saudacao: data.bot_saudacao, opcoes: data.bot_opcoes };
      }
      else if (data.produto_plano === 'ZyControl') {
        jsonPayload = { ...common, saudacao: data.bot_saudacao, logica: data.bot_logica };
      }
      else if (data.produto_plano === 'ZyBotAI') {
        jsonPayload = { 
          ...common, 
          funcionalidades: data.ai_features || [], 
          base_conhecimento: data.bot_base,
          personalidade: data.bot_persona 
        };
      }
      else if (data.produto_plano === 'ZyCore') {
        jsonPayload = { 
          ...common, 
          integracoes: data.core_integracoes, 
          regras_negocio: data.core_regras,
          personalidade: data.bot_persona 
        };
      }
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
      alert("✅ Recebido! A Zytech vai analisar seu projeto.");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black">
      
      <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-700 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              Z
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">Zytech</span>
          </div>
          <div className="text-xs font-bold text-zinc-500 tracking-widest uppercase">
            Hub do Cliente
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        
        <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 md:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>

          <div className="flex justify-between md:justify-center items-center gap-4 mb-12 relative z-10">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all duration-300
                  ${step === s ? 'border-green-500 bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110' : 
                    step > s ? 'border-green-500 bg-green-500/10 text-green-500' : 
                    'border-zinc-700 bg-zinc-950 text-zinc-600'}`}>
                  {step > s ? <Check size={18} strokeWidth={3} /> : s}
                </div>
                {s !== 4 && <div className={`hidden md:block w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-green-900' : 'bg-zinc-800'}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in zoom-in-95 duration-500">

            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-4xl font-black text-white mb-3">Escolha sua Solução</h1>
                  <p className="text-zinc-400">Qual tecnologia a Zytech vai desenvolver para você hoje?</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-2xl
                    ${categoria === 'chatbot' 
                      ? 'bg-zinc-950 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' 
                      : 'bg-black border-zinc-800 hover:border-zinc-600 hover:bg-zinc-950'}`}>
                    <input type="radio" value="chatbot" {...register("categoria_servico")} className="hidden" />
                    <div className={`p-4 rounded-full transition-colors ${categoria === 'chatbot' ? 'bg-green-500 text-black' : 'bg-zinc-900 text-zinc-500 group-hover:text-white'}`}>
                      <MessageSquare size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className={`text-2xl font-bold mb-2 ${categoria === 'chatbot' ? 'text-green-500' : 'text-white'}`}>Chatbots</h3>
                      <p className="text-zinc-500 text-sm">Automação inteligente para WhatsApp.</p>
                    </div>
                  </label>

                  <label className={`group relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 hover:shadow-2xl
                    ${categoria === 'website' 
                      ? 'bg-zinc-950 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]' 
                      : 'bg-black border-zinc-800 hover:border-zinc-600 hover:bg-zinc-950'}`}>
                    <input type="radio" value="website" {...register("categoria_servico")} className="hidden" />
                    <div className={`p-4 rounded-full transition-colors ${categoria === 'website' ? 'bg-blue-500 text-black' : 'bg-zinc-900 text-zinc-500 group-hover:text-white'}`}>
                      <Globe size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className={`text-2xl font-bold mb-2 ${categoria === 'website' ? 'text-blue-500' : 'text-white'}`}>Websites</h3>
                      <p className="text-zinc-500 text-sm">Sistemas Web, Dashboards e Landing Pages.</p>
                    </div>
                  </label>
                </div>

                <div className="pt-6">
                  <button type="button" onClick={() => setStep(2)} disabled={!categoria} 
                    className="btn-primary">
                    AVANÇAR
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 max-w-lg mx-auto">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">Sobre a Empresa</h1>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 ml-1">NOME DA EMPRESA</label>
                    <input {...register("nome_empresa", { required: true })} className="input-hardcore" placeholder="Digite o nome..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-zinc-300 ml-1">WHATSAPP / CONTATO</label>
                    <input {...register("whatsapp", { required: true })} className="input-hardcore" placeholder="(00) 00000-0000" />
                  </div>

                  {categoria === 'chatbot' && (
                    <div className="p-6 bg-black border border-green-900/50 rounded-2xl animate-in slide-in-from-top-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Store className="text-green-500" size={20} />
                        <span className="font-bold text-green-400 uppercase text-sm tracking-wider">Configuração de Nicho</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all 
                          ${segmento === 'delivery' ? 'bg-green-900/20 border-green-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                          <input type="radio" value="delivery" {...register("segmento")} className="hidden" />
                          <Truck className="mx-auto mb-2" />
                          <span className="font-bold text-sm">Delivery</span>
                        </label>
                        
                        <label className={`cursor-pointer p-4 rounded-xl border-2 text-center transition-all 
                          ${segmento === 'comercio' ? 'bg-green-900/20 border-green-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}>
                          <input type="radio" value="comercio" {...register("segmento")} className="hidden" />
                          <Store className="mx-auto mb-2" />
                          <span className="font-bold text-sm">Comércio</span>
                        </label>
                      </div>

                      {segmento === 'comercio' && (
                        <div className="mt-4">
                          <label className="text-xs font-bold text-zinc-500 ml-1 mb-1 block">QUAL O RAMO DE ATIVIDADE?</label>
                          <input {...register("ramo_atividade")} className="input-hardcore border-green-500/30 focus:border-green-500" placeholder="Ex: Loja de Roupas, Clínica, Petshop..." />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary w-1/3">VOLTAR</button>
                  <button type="button" onClick={() => setStep(3)} 
                    disabled={!watch("nome_empresa") || !watch("whatsapp") || (categoria === 'chatbot' && !segmento)} 
                    className="btn-primary w-2/3">
                    VER PLANOS
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-white mb-2">Selecione a Arquitetura</h1>
                  <p className="text-zinc-400">Clique no card para selecionar.</p>
                </div>

                {categoria === 'chatbot' ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <PlanCard id="ZyStart" icon={<Zap />} title="ZyStart" desc="Menu numérico simples." color="green" register={register} selected={produto} />
                    <PlanCard id="ZyControl" icon={<ShieldCheck />} title="ZyControl" desc="Fluxos lógicos e gestão." color="blue" register={register} selected={produto} />
                    <PlanCard id="ZyBotAI" icon={<Bot />} title="ZyBotAI" desc="IA treinada com PDFs." color="purple" register={register} selected={produto} />
                    <PlanCard id="ZyCore" icon={<Cpu />} title="ZyCore" desc="API Custom e Integrações." color="orange" register={register} selected={produto} />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <PlanCard id="WebStart" icon={<Layout />} title="WebStart" desc="Landing Page + 5 Pags." color="cyan" register={register} selected={produto} />
                    <PlanCard id="WebControl" icon={<Lock />} title="WebControl" desc="Login e Dashboard." color="indigo" register={register} selected={produto} />
                    <PlanCard id="WebCore" icon={<Code />} title="WebCore" desc="SaaS Completo." color="rose" register={register} selected={produto} />
                  </div>
                )}

                <div className="flex gap-4 pt-6 justify-center max-w-md mx-auto">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary w-1/3">VOLTAR</button>
                  <button type="button" onClick={() => setStep(4)} disabled={!produto} className="btn-primary w-2/3">
                    CONFIGURAR
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center border-b border-zinc-800 pb-6">
                  <h1 className="text-2xl font-bold text-white">Configuração Técnica: <span className="text-green-500">{produto}</span></h1>
                  <p className="text-zinc-500 text-sm mt-1">Preencha com atenção, isso define o orçamento.</p>
                </div>

                <div className="space-y-6">
                  
                  {categoria === 'chatbot' && (
                    <>
                      <div className="p-4 bg-zinc-950 border border-dashed border-zinc-700 rounded-xl">
                        <label className="text-sm font-bold text-zinc-300 mb-2 block">LINK DO CARDÁPIO / CATÁLOGO</label>
                        <input {...register("link_catalogo")} className="input-hardcore" placeholder="Cole o link do PDF ou Drive..." />
                      </div>

                      {(produto === 'ZyStart' || produto === 'ZyControl') && (
                        <div className="space-y-4">
                           <div>
                              <label className="label-hardcore">SAUDAÇÃO INICIAL</label>
                              <input {...register("bot_saudacao")} className="input-hardcore" placeholder="Ex: Olá, bem-vindo à Zytech..." />
                           </div>
                        </div>
                      )}
                      
                      {produto === 'ZyStart' && (
                        <div>
                          <label className="label-hardcore">QUANTIDADE DE OPÇÕES NO MENU</label>
                          <input type="number" {...register("bot_opcoes")} className="input-hardcore" placeholder="Ex: 4" />
                        </div>
                      )}

                      {produto === 'ZyControl' && (
                        <div>
                          <label className="label-hardcore">DESCREVA A LÓGICA DO FLUXO</label>
                          <textarea {...register("bot_logica")} className="input-hardcore h-32" placeholder="Ex: Se digitar 1, manda foto. Se digitar 2, verifica horário..." />
                        </div>
                      )}

                      {produto === 'ZyBotAI' && (
                        <div className="space-y-6 animate-in fade-in">
                          <div className="bg-black p-5 rounded-xl border border-zinc-800">
                             <span className="label-hardcore mb-4 block">O QUE A IA DEVE FAZER? (CHECKLIST)</span>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['Agendamento de Horário', 'Vendas / Tirar Pedido', 'Tirar Dúvidas (FAQ)', 'Suporte N1'].map((item) => (
                                  <label key={item} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-800 border border-zinc-800 hover:border-green-500/50 transition-colors">
                                    <input type="checkbox" value={item} {...register("ai_features")} className="w-5 h-5 rounded bg-black border-zinc-600 text-green-500 focus:ring-green-500" />
                                    <span className="text-sm text-zinc-300">{item}</span>
                                  </label>
                                ))}
                             </div>
                          </div>

                          <div>
                             <label className="label-hardcore">PERSONALIDADE DA IA</label>
                             <input {...register("bot_persona")} className="input-hardcore" placeholder="Ex: Formal, Vendedora agressiva, Amigável e jovem..." />
                          </div>

                          <div>
                             <label className="label-hardcore">BASE DE CONHECIMENTO (TEXTO OU LINKS)</label>
                             <textarea {...register("bot_base")} className="input-hardcore h-40" placeholder="Cole aqui os textos que a IA deve aprender ou links de documentos..." />
                          </div>
                        </div>
                      )}

                      {produto === 'ZyCore' && (
                        <div className="space-y-6 animate-in fade-in">
                           <div>
                             <label className="label-hardcore">INTEGRAÇÕES NECESSÁRIAS</label>
                             <textarea {...register("core_integracoes")} className="input-hardcore h-24" placeholder="Listar ERPs, CRMs ou APIs externas..." />
                          </div>
                          <div>
                             <label className="label-hardcore">WEBHOOKS E REGRAS DE NEGÓCIO</label>
                             <textarea {...register("core_regras")} className="input-hardcore h-32" placeholder="Descreva os gatilhos e automações complexas..." />
                          </div>
                          <div>
                             <label className="label-hardcore">PERSONALIDADE (SE HOUVER IA)</label>
                             <input {...register("bot_persona")} className="input-hardcore" placeholder="Defina o tom de voz..." />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {categoria === 'website' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-hardcore">TEM IDENTIDADE VISUAL?</label>
                          <select {...register("site_identidade")} className="input-hardcore">
                            <option value="sim">Sim, Logo e Cores prontas</option>
                            <option value="nao">Não, preciso criar</option>
                          </select>
                        </div>
                        <div>
                          <label className="label-hardcore">REFERÊNCIAS</label>
                          <input {...register("site_referencias")} className="input-hardcore" placeholder="Links de inspiração..." />
                        </div>
                      </div>
                      
                      {produto === 'WebStart' && (
                        <div><label className="label-hardcore">QUAIS SERÃO AS 5 PÁGINAS?</label><textarea {...register("site_paginas")} className="input-hardcore h-24" placeholder="Ex: Home, Sobre, Serviços, Contato..." /></div>
                      )}
                      {produto === 'WebControl' && (
                        <div className="space-y-4">
                          <div><label className="label-hardcore">QUEM FARÁ LOGIN?</label><input {...register("site_login")} className="input-hardcore" placeholder="Clientes, Funcionários..." /></div>
                          <div><label className="label-hardcore">O QUE TERÁ NO DASHBOARD?</label><textarea {...register("site_dashboard")} className="input-hardcore h-24" /></div>
                        </div>
                      )}
                      {produto === 'WebCore' && (
                        <div><label className="label-hardcore">ESCOPO DETALHADO DO SISTEMA</label><textarea {...register("site_custom")} className="input-hardcore h-40" placeholder="Descreva todas as funcionalidades, níveis de acesso e fluxo de dados..." /></div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="button" onClick={() => setStep(3)} className="btn-secondary w-1/3">VOLTAR</button>
                  <button type="submit" disabled={isLoading} className="btn-primary w-2/3">
                    {isLoading ? 'ENVIANDO...' : 'FINALIZAR PROPOSTA 🚀'}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>
      </main>
      <style jsx global>{`
        .input-hardcore {
          @apply w-full p-4 bg-black border border-zinc-700 rounded-xl text-white placeholder-zinc-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all font-medium;
        }
        .label-hardcore {
          @apply text-xs font-bold text-zinc-400 ml-1 mb-2 block tracking-wider;
        }
        .btn-primary {
          @apply bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-black py-4 px-6 rounded-xl shadow-lg shadow-green-900/40 transform transition hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed;
        }
        .btn-secondary {
          @apply bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 px-6 rounded-xl border border-zinc-700 transition-colors;
        }
      `}</style>
    </div>
  );
}


function PlanCard({ id, icon, title, desc, color, register, selected }: any) {
  const isSelected = selected === id;
  const colorMap: any = {
    green:  'border-green-500 bg-green-500/10 text-green-400',
    blue:   'border-blue-500 bg-blue-500/10 text-blue-400',
    purple: 'border-purple-500 bg-purple-500/10 text-purple-400',
    orange: 'border-orange-500 bg-orange-500/10 text-orange-400',
    cyan:   'border-cyan-500 bg-cyan-500/10 text-cyan-400',
    indigo: 'border-indigo-500 bg-indigo-500/10 text-indigo-400',
    rose:   'border-rose-500 bg-rose-500/10 text-rose-400',
  };
  const activeClass = colorMap[color];

  return (
    <label className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-2 group
      ${isSelected ? activeClass + ' shadow-xl' : 'border-zinc-800 bg-black hover:border-zinc-600'}`}>
      <input type="radio" value={id} {...register("produto_plano")} className="hidden" />
      
      <div className="flex flex-col items-center text-center gap-3">
        <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-black/50' : 'bg-zinc-900 text-zinc-600 group-hover:text-white'}`}>
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <p className="text-xs text-zinc-500 mt-2 font-medium leading-relaxed">{desc}</p>
        </div>
      </div>

      <div className={`mt-4 w-full py-2 rounded-lg font-black text-[10px] uppercase tracking-widest text-center transition-all
        ${isSelected ? 'bg-current text-black' : 'bg-zinc-900 text-zinc-600'}`}>
        {isSelected ? 'Selecionado' : 'Escolher'}
      </div>
    </label>
  );
}