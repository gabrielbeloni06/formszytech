"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@supabase/supabase-js';
import { 
  Moon, Sun, CheckCircle, ArrowRight, ArrowLeft, 
  Bot, ShieldCheck, Zap, Cpu, Upload 
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
  
  const produtoEscolhido = watch("produto_escolhido");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    
    const dadosEspecificos = {
      saudacao: data.saudacao,
      opcoes_menu: data.opcoes_menu,
      logica_extra: data.logica_extra,
      checklist_ia: data.checklist_ia, 
      base_conhecimento: data.base_conhecimento,
      persona: data.persona,
      escopo_custom: data.escopo_custom
    };

    const jsonLimpo = JSON.parse(JSON.stringify(dadosEspecificos));

    try {
      const { error } = await supabase
        .from('leads_chatbot')
        .insert({
          nome_empresa: data.nome_empresa,
          whatsapp: data.whatsapp,
          segmento: data.segmento,
          produto_escolhido: data.produto_escolhido,
          link_catalogo: data.link_catalogo,
          dados_especificos: jsonLimpo
        });

      if (error) throw error;
      alert("Solicitação enviada com sucesso! A Zytech entrará em contato.");
    } catch (error) {
      console.error('Erro:', error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <header className="p-6 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-black">Z</div>
          <span className="font-bold text-xl tracking-tight">Zytech</span>
        </div>
        
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {isDarkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
        </button>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-3 h-3 rounded-full transition-all duration-500 ${step >= s ? 'bg-green-500 scale-125' : 'bg-zinc-600'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in-up">
          
          {step === 1 && (
            <div className="max-w-lg mx-auto space-y-6">
              <h1 className="text-4xl font-bold text-center mb-2">Vamos começar?</h1>
              <p className="text-center text-zinc-500 dark:text-zinc-400 mb-8">Conte um pouco sobre o seu negócio.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 ml-1">Nome da Empresa</label>
                  <input 
                    {...register("nome_empresa", { required: true })}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Ex: Doce Sabor Confeitaria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 ml-1">WhatsApp para Contato</label>
                  <input 
                    {...register("whatsapp", { required: true })}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 ml-1">Segmento</label>
                  <select 
                    {...register("segmento", { required: true })}
                    className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:ring-2 focus:ring-green-500 outline-none transition-all appearance-none"
                  >
                    <option value="">Selecione...</option>
                    <option value="delivery">Delivery / Restaurante</option>
                    <option value="comercio">Comércio / Serviços</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              <button type="button" onClick={() => setStep(2)} className="w-full mt-6 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2">
                Próximo Passo <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold mb-2">Escolha sua solução</h1>
                <p className="text-zinc-500 dark:text-zinc-400">Selecione o plano ideal para o seu momento.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <label className={`relative group cursor-pointer border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 
                  ${produtoEscolhido === 'ZyStart' 
                    ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10 ring-1 ring-green-500' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-500/50'}`}
                >
                  <input type="radio" value="ZyStart" {...register("produto_escolhido")} className="hidden" />
                  <div className="mb-4 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">ZyStart</h3>
                  <p className="text-sm text-zinc-500 mb-4 h-10">Para quem está começando e precisa de agilidade.</p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Menu Básico</li>
                    <li className="flex gap-2"><CheckCircle size={16} className="text-green-500" /> Respostas Rápidas</li>
                  </ul>
                  <div className={`w-full py-2 rounded-lg text-center text-sm font-bold transition-colors ${produtoEscolhido === 'ZyStart' ? 'bg-green-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {produtoEscolhido === 'ZyStart' ? 'Selecionado' : 'Selecionar'}
                  </div>
                </label>

                <label className={`relative group cursor-pointer border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 
                  ${produtoEscolhido === 'ZyControl' 
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 ring-1 ring-blue-500' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-500/50'}`}
                >
                  <input type="radio" value="ZyControl" {...register("produto_escolhido")} className="hidden" />
                  <div className="mb-4 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">ZyControl</h3>
                  <p className="text-sm text-zinc-500 mb-4 h-10">Controle total com fluxos lógicos definidos.</p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                    <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500" /> Árvore de Decisão</li>
                    <li className="flex gap-2"><CheckCircle size={16} className="text-blue-500" /> Painel de Gestão</li>
                  </ul>
                  <div className={`w-full py-2 rounded-lg text-center text-sm font-bold transition-colors ${produtoEscolhido === 'ZyControl' ? 'bg-blue-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {produtoEscolhido === 'ZyControl' ? 'Selecionado' : 'Selecionar'}
                  </div>
                </label>

                <label className={`relative group cursor-pointer border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 
                  ${produtoEscolhido === 'ZyBotAI' 
                    ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-900/10 ring-1 ring-purple-500' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-500/50'}`}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Popular
                  </div>
                  <input type="radio" value="ZyBotAI" {...register("produto_escolhido")} className="hidden" />
                  <div className="mb-4 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                    <Bot size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">ZyBotAI</h3>
                  <p className="text-sm text-zinc-500 mb-4 h-10">Inteligência Artificial que aprende sobre você.</p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                    <li className="flex gap-2"><CheckCircle size={16} className="text-purple-500" /> Treinamento em PDF</li>
                    <li className="flex gap-2"><CheckCircle size={16} className="text-purple-500" /> Linguagem Natural</li>
                  </ul>
                  <div className={`w-full py-2 rounded-lg text-center text-sm font-bold transition-colors ${produtoEscolhido === 'ZyBotAI' ? 'bg-purple-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {produtoEscolhido === 'ZyBotAI' ? 'Selecionado' : 'Selecionar'}
                  </div>
                </label>

                <label className={`relative group cursor-pointer border rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 
                  ${produtoEscolhido === 'ZyCore' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/10 ring-1 ring-orange-500' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-500/50'}`}
                >
                  <input type="radio" value="ZyCore" {...register("produto_escolhido")} className="hidden" />
                  <div className="mb-4 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                    <Cpu size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-1">ZyCore</h3>
                  <p className="text-sm text-zinc-500 mb-4 h-10">Soluções ultra customizadas e integrações.</p>
                  <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300 mb-6">
                    <li className="flex gap-2"><CheckCircle size={16} className="text-orange-500" /> Integração API</li>
                    <li className="flex gap-2"><CheckCircle size={16} className="text-orange-500" /> Sistema Próprio</li>
                  </ul>
                  <div className={`w-full py-2 rounded-lg text-center text-sm font-bold transition-colors ${produtoEscolhido === 'ZyCore' ? 'bg-orange-500 text-white' : 'bg-zinc-100 dark:bg-zinc-800'}`}>
                    {produtoEscolhido === 'ZyCore' ? 'Selecionado' : 'Selecionar'}
                  </div>
                </label>

              </div>

              <div className="flex gap-4 mt-8 justify-center max-w-lg mx-auto">
                <button type="button" onClick={() => setStep(1)} className="w-1/2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-xl">
                  Voltar
                </button>
                <button 
                  type="button" 
                  onClick={() => setStep(3)} 
                  disabled={!produtoEscolhido}
                  className="w-1/2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="max-w-lg mx-auto space-y-6">
              <h1 className="text-3xl font-bold text-center mb-2">Configurando o {produtoEscolhido}</h1>
              
              <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Upload size={16} /> Link do Catálogo ou Cardápio
                </label>
                <input 
                  {...register("link_catalogo")}
                  placeholder="Cole aqui o link do Google Drive, PDF ou site..."
                  className="w-full p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              {(produtoEscolhido === 'ZyStart' || produtoEscolhido === 'ZyControl') && (
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium mb-1">Frase de Saudação Inicial</label>
                    <input {...register("saudacao")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" placeholder="Ex: Olá, bem-vindo à Zytech! Como posso ajudar?" />
                  </div>
                </div>
              )}
              {produtoEscolhido === 'ZyStart' && (
                <div>
                   <label className="block text-sm font-medium mb-1">Quantas opções no Menu Principal?</label>
                   <input type="number" {...register("opcoes_menu")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" placeholder="Ex: 4" />
                </div>
              )}

              {produtoEscolhido === 'ZyControl' && (
                <div>
                   <label className="block text-sm font-medium mb-1">Explique a lógica de atendimento</label>
                   <textarea {...register("logica_extra")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 h-24" placeholder="Ex: Se cliente digitar 1, manda o cardápio. Se digitar 2, fala com atendente..." />
                </div>
              )}

              {produtoEscolhido === 'ZyBotAI' && (
                <div className="space-y-4">
                  <div className="bg-zinc-100 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="block text-sm font-bold mb-3">O que a IA deve fazer?</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" value="agendamento" {...register("checklist_ia")} className="rounded text-green-500 focus:ring-green-500" />
                        <span>Agendamentos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" value="vendas" {...register("checklist_ia")} className="rounded text-green-500 focus:ring-green-500" />
                        <span>Vendas e Pedidos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" value="duvidas" {...register("checklist_ia")} className="rounded text-green-500 focus:ring-green-500" />
                        <span>Tirar Dúvidas (FAQ)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Base de Conhecimento (Resumo)</label>
                    <textarea {...register("base_conhecimento")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 h-24" placeholder="Cole aqui textos importantes sobre a empresa que a IA deve saber..." />
                  </div>
                </div>
              )}

              {produtoEscolhido === 'ZyCore' && (
                <div className="space-y-4">
                   <div>
                    <label className="block text-sm font-medium mb-1">Personalidade do Bot</label>
                    <input {...register("persona")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700" placeholder="Ex: Agressivo, Formal, Engraçado..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Escopo Customizado</label>
                    <textarea {...register("escopo_custom")} className="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 h-24" placeholder="Descreva as integrações e funcionalidades únicas que você precisa..." />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={() => setStep(2)} className="w-1/3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold py-3 rounded-xl">
                  Voltar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-2/3 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                  {isLoading ? 'Enviando...' : 'Finalizar Solicitação 🚀'}
                </button>
              </div>
            </div>
          )}

        </form>
      </main>
    </div>
  );
}