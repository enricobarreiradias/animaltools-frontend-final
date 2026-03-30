# Manual do Utilizador - AnimalTools

Bem-vindo ao **AnimalTools**! Esta plataforma foi desenvolvida para facilitar e digitalizar o processo de avaliação odontológica em bovinos. Com um sistema intuitivo, poderá registar dados com precisão, acompanhar a saúde do rebanho e gerar relatórios completos.

---

## 1. Dashboard (Painel Principal)

O **Dashboard** é o seu ecrã inicial logo após iniciar sessão. Ele serve como um centro de comando.

**O que vai encontrar aqui:**

- **Progresso das Avaliações:** Um pequeno gráfico para mostrar a relação entre os animais que estão no sistema versus os que já foram avaliados.
- **Alertas:** Informações rápidas sobre animais que necessitam de atenção.
- **Ação Rápida:** A secção "Ações Rápidas" permite o acesso imediato a todas as funcionalidades do sistema, como Avaliações, Histórico e Relatórios.

**Como utilizar:**
Sempre que quiser voltar à visão geral, basta clicar em "Dashboard" no menu lateral.

---

## 2. Avaliações Dentárias (Mesa de Avaliação)

A Mesa de Avaliação é o coração do AnimalTools. Aqui, pode registar o estado de saúde bucal de cada animal.

**Como realizar uma avaliação:**

1. Na barra lateral, vá até à página intitulada **Mesa de Avaliação**.
2. Escolha qualquer animal que está com avaliação pendente para começar a avaliar.
3. Clique no botão **Avaliar** (que está na coluna "Ação").
4. **Arcada Dentária:** Verá um desenho representativo dos dentes do animal (odontograma). Clique num dente específico para registar o seu estado:
   - **PARÂMETROS CLÍNICOS:** DESGASTE DA COROA, DESGASTE LINGUAL, EXPOSIÇÃO DA CÂMARA PULPAR, FRATURA, CÁLCULO DENTÁRIO, PULPITE, RANHURA, BORDO VITRIFICADO, CÁRIE, ALTERAÇÃO DE COR, PERIODONTITE, GENGIVITE, GENGIVITE NECROSANTE, PERIODONTITE NECROSANTE, EDEMA GENGIVAL, RECESSÃO GENGIVAL e PERICORONARITE.
   - **Informações Adicionais:** Utilize os campos de observação para detalhes e/ou informações adicionais.
   - **Muda Rápida:** Se estiver a avaliar animais jovens e quiser agilizar o processo, utilize a ferramenta "Muda Rápida". Esta opção permite preencher automaticamente o estado de vários dentes de uma só vez, com base no padrão de crescimento esperado para a idade.
5. **Finalizar Laudo:** Após preencher os dados, clique em "Finalizar Laudo", no canto superior direito da página. A avaliação será enviada para o servidor, o animal sairá da lista de pendências e aparecerá no histórico.

---

## 3. Histórico

Precisa de consultar a avaliação de um animal do passado? O menu **Histórico** é o local certo.

- **Pesquisa:** Utilize a barra de pesquisa para encontrar um animal pelo seu número de identificação.
- **Visualização:** Se a avaliação tiver sido feita por si, poderá editá-la o quanto quiser. Caso aquela avaliação seja de outro avaliador, terá duas opções (na coluna "Ações", aceda ao botão "Opções de Visualização", ao lado do botão "Editar"):
  1. **Visualização do Odontograma:** Ao escolher esta opção, será redirecionado para o odontograma completo daquela avaliação, mas num modo de visualização. Ou seja, se não foi o autor da avaliação, apenas a poderá ver, sem permissão de edição.
  2. **Relatório PDF:** Ao escolher esta opção, será redirecionado para um PDF contendo TODAS as informações específicas do animal e a avaliação em detalhes, sendo possível ver através de caixas quais os dentes que têm quais enfermidades.

---

## 4. Relatórios e Exportação de Dados

O AnimalTools não serve apenas para guardar dados, mas também para os analisar. Vá ao menu **Relatórios** para extrair valor das suas avaliações.

- **Relatórios em PDF:** Ao clicar em "Configurar PDF" no canto superior direito, será redirecionado para uma janela flutuante onde poderá configurar todos os campos a incluir nesse relatório geral, incluindo personalização: Nome + Logo do Cliente. Para descarregar para o seu computador, basta clicar no botão "Baixar PDF".
- **Dados para Pesquisa (Excel/XLSX):** Se for um pesquisador, ou se quiser fazer uma análise de dados avançada, clique no botão "Relatório Pesquisa" (exportação para Excel). O sistema irá descarregar um ficheiro `.xlsx` organizado com TODAS as informações de TODOS os animais.

---

## 5. Auditoria (Para Administradores)

A segurança e integridade dos dados são fundamentais.

- No menu **Auditoria**, os administradores podem ver um registo completo de "Quem fez o quê e quando".
- O sistema regista a criação de animais, avaliações alteradas e logins no sistema, garantindo total transparência.

---

## 6. Gestão de Equipe (Para Administradores)

Se tem uma equipa de veterinários ou ajudantes, pode dar-lhes acesso ao sistema.

- Vá a **Equipe**.
- Aqui pode criar novas contas, redefinir palavras-passe e definir as permissões de cada utilizador.
