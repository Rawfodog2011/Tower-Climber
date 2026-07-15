# [SYSTEM] Tower Climber - Game Design Document (GDD)

Este documento detalha o estado arquitetural, mecânico e temático do projeto **Tower Climber**, consolidando todas as regras matemáticas, modelos de dados e decisões de design implementadas até o momento.

---

## 1. Visão Geral e Temática
**Temática:** Sci-Fi / Biomecânica / Cyberpunk Industrial.
O jogador assume o papel de um explorador tecnológico escalando um vasto Complexo Industrial (a "Torre"). O universo abandonou a fantasia medieval clássica, adotando uma estética de ficção científica onde magia é engenharia (Energia, EMPs, Sobrecarga de Hardware) e os inimigos são anomalias robóticas e biológicas.

**Core Loop (Ciclo Principal):**
1. **Escalada & Combate:** O jogador avança pelos andares do Complexo. O combate ocorre em turnos estritos (State Machine).
2. **Recompensas & Risco:** Derrotar inimigos gera Ouro, XP e a chance de Loot. A morte impõe uma penalidade (perda de recursos), obrigando o jogador a saber a hora de voltar à Safe Zone (Hub).
3. **Gerenciamento (Hub):** Na Safe Zone, o jogador aloca equipamentos, desmancha itens excedentes (Crafting/Forja), adquire Relíquias permanentes (Meta-Progressão) e realiza a manutenção da sua build antes de voltar à escalada.

---

## 2. Estrutura de Pastas e Arquitetura

O projeto adota uma separação rigorosa entre a **Interface de Usuário (React/UI)** e o **Motor de Regras (Core Engine)**, garantindo que a lógica matemática não dependa de componentes visuais.

```text
/src/
├── App.tsx                     # Ponto de entrada da UI, renderização isométrica e controllers principais
├── types.ts                    # Declaração das interfaces globais (Player, Item, Skill, etc.)
│
└── core/                       # Lógica de Negócios e Motor do Jogo
    ├── engine/                 
    │   ├── achievements.ts     # Validador de conquistas e metas
    │   ├── combat.ts           # State machine pura do combate em turnos
    │   ├── crafting.ts         # Regras de desmanche, forja e custos (Gold Sinks)
    │   ├── inventory.ts        # Regras de equipar/desequipar com validação de classe
    │   └── saveGame.ts         # Wrapper reativo para o LocalStorage
    │
    ├── entities/               # Dicionários de Dados (Bancos simulados)
    │   ├── classes.ts          # Árvore de classes Sci-Fi e atributos base
    │   ├── events.ts           # Encontros aleatórios (Random Events)
    │   ├── items.ts            # Armas, Armaduras e Acessórios com restrições
    │   ├── monsters.ts         # Tipos de anomalias (Parasitas, Drones, Mutantes) e Bosses
    │   ├── relics.ts           # Meta-progressão e upgrades permanentes
    │   └── skills.ts           # Habilidades (Dano, Cura, Buffs) e Custos de EP
    │
    └── math/                   # Balanceamento e Fórmulas Matemáticas
        ├── progression.ts      # Exponencialidade do requerimento de XP por Nível
        └── worldScaling.ts     # Escalonamento infinito de andares (Inimigos, Ouro, Drop Rate)
```

---

## 3. Modelos de Dados e Entidades (Tipagens)

### Sistema de Classes (Árvore Evolutiva)
O jogo possui uma progressão de classes ramificada (estilo *Twilight's EVE*), com power spikes nos níveis 10 e 40.

* **Nível 1 (Classe Base):**
  * `Tecno-Aprendiz`: Engenheiro novato focado em sobrevivência básica. Habilidade: *Reparo de Emergência* (Cura baseada em Tensão/T-ATK).
* **Nível 10 (Evoluções Primárias):**
  * `Mecatrônico`: Focado em blindagem pesada e dano cinético (Sobrecarga de Hardware). Evolui do Tecno-Aprendiz.
  * `Eletromante`: Focado em manipular energia e curtos-circuitos, alto T-ATK e EP, baixo HP (Pulso Eletromagnético). Evolui do Tecno-Aprendiz.
  * `Operador de Drones`: Focado em agilidade e evasão, velocidade extrema (Mira Laser Calibrada). Evolui do Tecno-Aprendiz.
* **Nível 40 (Power Spike / Evoluções Secundárias):**
  * Evoluções de *Mecatrônico*: `Juggernaut Industrial` (Defesa Absoluta) ou `Ciborgue de Combate` (Dano Suicida).
  * Evoluções de *Eletromante*: `Arquiteto de Sistemas` (Poder Orbital) ou `Tecnomante` (Drenagem de Baterias).
  * Evoluções de *Operador de Drones*: `Atirador Óptico` (Dano à distância penetrante) ou `Fantasma de Silício` (Furtividade termóptica).

**Nomenclatura UI:**
* **EP:** Energy Points (antigo MP).
* **T-ATK:** Tensão / Ataque Tecnológico (antigo Ataque Mágico).

### Inimigos e Bosses Biomecânicos
* **Módulos Comuns:** Parasita Ácido, Drone Defeituoso, Soldado Reptiliano, Aberração Genética, Mutante Biomecânico.
* **Bosses (Múltiplos de 10):** No andar 10, 20, 30..., o jogador enfrenta super-máquinas. Nomes circulares definidos matematicamente (ex: *Soberano da Ninhada*, *Guardião Cibernético*, *Destruidor de Sistemas*, *Leviatã Biomecânico*).

### Inventário e Restrição de Equipamentos
As armas e armaduras verificam a árvore de herança de classe (`parentClassId`). 
Exemplo matemático: Uma *Espada de Plasma Pesada* exige a classe `mecatronico`. A árvore lógica de `canClassEquipItem` valida que o `Juggernaut Industrial` também pode equipá-la, pois descende do Mecatrônico. 

---

## 4. Sistemas Mecânicos e Motores Lógicos

### Combate em Turnos (State Machine)
* **Status:** O estado do combate é um snapshot imutável (`CombatState`) que contém o HP/EP dinâmico, cooldowns de skills e os logs do terminal de registro.
* **Mitigação de Dano:** O dano recebido nunca cai abaixo de 1. O motor calcula o dano aplicando a subtração da defesa inimiga, garantindo peso matemático nos atributos base.
* **Fúria (Enrage):** Bosses entram em "Enrage" (Fúria) ao cair abaixo de um certo limite de HP (ex: < 30%) ou após um número longo de turnos. Durante a Fúria, o Boss pisca em vermelho na UI e recebe multiplicadores massivos em velocidade e dano.
* **Fuga de Exaustão:** Se um combate ultrapassar um limite absoluto de turnos estipulado pelo engine, os combatentes "fogem exaustos", evitando soft-locks para builds imortais (tank vs tank).

### Escalonamento Infinito (World Scaling)
* **Inimigos:** 
  * HP: Exponencial (`andar^1.2`)
  * ATK/DEF: Exponencial (`andar^1.1`)
  * XP Reward: Exponencial (`andar^1.5`)
  * Ouro Reward: Exponencial (`andar^1.4`)
* **Loot e Progressão:** A chance de drop base inicia em 20% e sobe `0.005` por andar, tendo um cap absoluto de 50%. Bosses têm sempre 100% de drop rate e garantem itens `Rare` ou `Epic`.

### Sistema de Forja (Crafting / Pity System)
A forja funciona como um mecanismo de "Bad Luck Protection" (Sistema Pity) e ralo de recursos (Gold Sink):
* O desmanche de itens rende "Fragmentos". A conversão é regida pela taxa `3:1`. O jogador precisa sacrificar 3 itens para obter a quantidade de material bruto necessária para forjar 1 item aleatório de mesma raridade garantida para sua classe.
* Ao craftar, é exigida uma taxa adicional de ouro, validando a economia anti-inflacionária.

### Sistema de Relíquias (Meta-Progressão)
Atualizações permanentes que o jogador pode adquirir usando "Estilhaços de Alma" ou Ouro. Uma das mecânicas primordiais englobadas aqui é a mitigação passiva da **Penalidade de Morte**, permitindo ao jogador manter uma margem segura de ouro retido ao ser derrotado.

### Encontros Aleatórios
Possuem um gerenciador de cache/histórico integrado. O randomizador impede o "repeteco" (não repete os últimos 3 eventos passados). Ações variam desde Buffs temporários de combate, puzzles estáticos de reconexão de circuitos a perdas de HP por armadilhas biológicas.

---

## 5. Persistência de Dados (Save State)
O sistema salva e carrega dados através do `localStorage`. 
Para mitigar abusos (*save scumming*), o React utiliza o hook de ciclo de vida (`useEffect`) para gravar uma cópia autêntica do inventário, classe, xp e moedas a cada alteração sensível na `store` local. Transições de UI carregam diretamente da máquina de estado global no mount para garantir consistência. Adicionalmente, dados obsoletos (*legacy saved state*), como as antigas classes de fantasia medieval, são sanitizados no carregamento (ex: `novato` -> `tecno_aprendiz`) e chaves do banco de habilidades são re-injetadas para evitar crashes com skills que não existem mais.

---

## 6. Interface, Visual e UX
A estética adotou um estilo Cyberpunk / Holográfico com fortes inspirações arquiteturais:
* **Arena Isométrica 2.5D:** O palco de combate possui distorções 3D feitas unicamente com transformações CSS (`transform: rotateX(60deg) rotateZ(45deg)`), criando uma grade cibernética no chão.
* **Monstros Alienígenas/Robóticos:** Integrado perfeitamente com a *API Robohash (Set 2)*, gerando abominações robóticas e biológicas em alta qualidade e variação procedural com base na *Seed* (nome) do monstro, garantindo que o mesmo monstro sempre se pareça igual, mas monstros diferentes tenham formatos alienígenas caóticos.
* **Avatar do Jogador:** Usa o gerador *Dicebear (Pixel-Art)*, refletindo o ID numérico da Classe, passando a sensação de um Operador de Sistema pixelizado frente aos monstros renderizados do Robohash.
* **Terminal de Registro:** Console de leitura no canto da tela de combate que imprime as interações de hit e skill do motor de dados em tempo real. Possui altura fixa e auto-scroll fixado ao fundo da lista (`scrollIntoView`), assegurando total domínio logístico do combate pelo jogador.
* **Feedback Cinético:** 
  * Pop-ups de dano flutuantes (`animate-float-up`).
  * Hit Flash branco misturado com animações de tremer (shake) sempre que uma entidade (Monstro ou Jogador) recebe dano.
  * Bosses "Enraged" ganham uma aura de drop-shadow pulsante, alterando a cor térmica da arena.

## 7. Status Tecnológicos (Efeitos Passivos)
O combate suporta modificadores de estado (Status) por tempo limitado (turnos), sendo:
* **Sobreaquecimento (Overheat):** O alvo recebe multiplicador de x1.3 (30%) de dano final de todas as fontes.
* **Corrosão (Corrosion):** A armadura do alvo é derretida em 25% (0.75x DEF) e sofre Dano ao longo do Tempo (DoT) no início de todo turno.
* **Curto-Circuito (Shock):** O sistema sofre micro-falhas, concedendo 30% de chance do alvo pular a sua fase de ataque e errar o golpe. Além disso, jogadores ganham bônus massivo de sinergia ao atacarem alvos com Choque (+50% Dano Crítico/Base).

## 8. Progressão Biomecânica (Adaptação Passiva)
O traje e o hardware do jogador evoluem dinamicamente conforme os estímulos recebidos no ambiente de batalha, garantindo atributos permanentes:
* **Blindagem Reativa:** Adquire XP a cada 1 ponto de Dano recebido. O nível concede **DEF** bônus.
* **Overclock de Combate:** Adquire XP a cada ataque básico executado. Concede **ATK** e **SPD**.
* **Dissipação de Calor:** Adquire XP por usar habilidades, consumindo EP. Concede **Max EP (Bateria)** extra.
* A persistência é salva silenciosamente e calculada O(1) no encerramento (Vitória ou Derrota) evitando re-renders drásticos.

## 9. Puzzles de Interação Criptografados
Ao explorar a torre, o jogador pode encontrar Terminais Instáveis. O sistema gera uma seed temporal com `Vibração (Hz)` e `Temperatura (ºC)`.
A dedução se dá na leitura do manual de diagnóstico na tela, escolhendo o desvio correto de energia.
O sistema provê Risco (Perda de Ouro e Dano) contra Recompensa (Loot de Forja raro + Conquistas).

## 10. Qualidade de Vida (QoL) - Visibilidade de Status
O inventário e painel de equipamentos ativo exibem não apenas o nome e raridade dos itens, mas também desdobram as tuplas de `statModifiers` (ATK, DEF, HP, EP, SPD) de forma visual.
As descrições dos itens ("Lore" ou utilidade) estão acessíveis através de tooltips flutuantes (HTML `title`) nas interfaces de listagem, facilitando o planejamento tático ao parear itens e sinergias de combate.

## 11. Sistema de Equipamentos Expandido (Multi-Slot)
O jogador possui múltiplos slots de equipamento para suportar uma variação maior de status e complexidade nas construções. Os slots disponíveis são:
* `weapon` (Arma)
* `helmet` (Capacete)
* `armor` (Armadura)
* `pants` (Calça)
* `boots` (Botas)
* `bracers` (Braçadeira)
* `accessory1`, `accessory2`, `accessory3` (Até 3 Acessórios simultâneos)
O motor garante que, se um tipo de acessório for equipado e todos os slots não estiverem preenchidos, o sistema preencherá o próximo slot vazio automaticamente antes de sobrescrever.

## 12. Farm Contínuo (QoL)
Após cada batalha, o jogador não precisa retornar obrigatoriamente à tela principal (Hub). 
Na tela de Vitória/Derrota, o usuário pode escolher as opções de "Lutar Novamente" (farmar itens e Ouro no mesmo andar) ou "Avançar" (ir para o próximo andar, se venceu).
Essa modificação garante que o fluxo do usuário (*Flow State*) não seja cortado abruptamente em momentos de moagem pesada (*grinding*).

## 13. Drop Rate Dinâmico (Floor Scaling)
Todos os monstros podem dropar todos os itens disponíveis. No entanto, o motor de drop agora utiliza um peso ponderado que varia a chance com base no "tier" do item (seu `requiredLevel` da classe alvo) contra o Andar (`Floor`) atual.
- Itens de nível baixo (Aprendiz) são muito mais comuns no início. Conforme a torre avança para andares intermediários (30-50), itens de nível 10 assumem os pesos maiores, e as chances de itens Iniciais caem progressivamente.
- Nunca há 0% de chance. Um monstro do andar 1 tem uma micro-probabilidade matemática (`weight = 1`) de dropar um loot destinado a evoluções de nível 40, mantendo o fator surpresa sempre ativo.

## 14. Matemática de Combate e Nivelamento (Andar vs Nível)
O balanceamento do jogo foi ajustado para garantir que um jogador de Nível X enfrente um combate de dificuldade "50/50" contra monstros de Andar X.
- **Monstros do Andar X** agora replicam as estatísticas aproximadas de um jogador ideal no Nível X (considerando curvas de status e os power spikes de classe nos níveis 10 e 40).
- **Fórmula de Dano Diferencial**: O dano aplicado em combate tem uma penalidade ou bônus com base na diferença de nível (`Atacante Lvl - Defensor Lvl`). 
- **Consequência Prática**: Jogadores de Nível 10 lutando no Andar 7 destruirão os monstros facilmente (farm 100% de vitória), mas terão vitórias mais garantidas contra os monstros do seu andar (50%) apenas quando suas builds de itens estiverem acima da média.

## 15. Atualização Corporativa e de Setores (Set Bonuses & Hazards)
### 15.1. Sistema de Fabricantes e Conjuntos (Set Bonuses)
Itens (raridade `rare` ou superior) possuem 50% de chance de receberem o patrocínio de uma megacorporação. O jogador recebe modificadores de status massivos caso concentre equipamentos de um mesmo fabricante em seus 9 slots. O bônus máximo visual requer o alinhamento total de 3 peças:
* **Kinetix Heavy Industries:** (+10% HP / +10% DEF Tota). Foco em sobrevivência absoluta.
* **AeroDynamics:** (+15% SPD Tota). Foco puro em iniciativa e evasão passiva (turnos garantidos).
* **OmniCorp:** (+10% T-ATK / +10% EP). Aumenta significativamente a energia disponível para skills e o dano de perfuração.

### 15.2. Setores Dinâmicos da Torre (Hazards)
O ambiente da torre agora é fragmentado a cada 10 andares em biomas instáveis, impactando não só o visual isomêtrico (renderizando a cor da malha via manipulação DOM) como diretamente a máquina de estados de combate em tempo real:
* **Setor 1 (Andar 1-10) - Refinaria Tóxica:** Atmosfera instável. Efeitos de Status DoT como "Corrosão" dão Dano duplo no final/início do turno e brilham em verde limão.
* **Setor 2 (Andar 11-20) - Data-Core Congelado:** Temperaturas glaciais travam pistões. O uso de Habilidades de Classe custa 20% a mais do atributo **EP** global.
* **Setor 3 (Andar 21-30) - Fornalha de Plasma:** Calor abrasivo do reator nuclear de fusão irradia ondas de plasma. Causa dano contínuo (2% HP) em todos os atores (player e monstro) incondicionalmente, estendendo Status de "Sobreaquecimento" por turnos bônus.

*(O ciclo de Setores se repete matematicamente a cada 3 blocos escalando ao infinito).*

## 16. Anomalias de Combate (Combat Anomaly)
O ambiente da torre é altamente volátil. Cada batalha possui 40% de chance de desencadear uma **Anomalia de Combate**, alterando as regras base do confronto.
- **Player Buffs**: Ex: *Protocolo Overdrive* (+20% Dano, mas drena 5% HP por turno), *Hiper-Resfriamento* (imunidade a Sobreaquecimento).
- **Monster Buffs**: Ex: *Tempestade Magnética* (+30% HP para os monstros e 2x Ouro no Drop).
- **Hazards**: Ex: *Campo EMP* (Ataques básicos causam -50% de dano, mas Habilidades custam 0 EP), *Vazamento de Radiação* (Aplica status de Corrosão em ambos os lados a cada turno).
Isso adiciona uma camada extra de tática, forçando o jogador a adaptar suas decisões dependendo da anomalia ativa. O aviso de anomalia aparece cintilante na interface antes do primeiro turno.

## 17. Central de Contratos Corporativos
O Acampamento Base (Hub) possui um terminal de Freelancers e Mercenários corporativos. O jogador pode manter até 5 contratos ativos simultaneamente.
- **Contratos de Caça (Hunt)**: Exige a eliminação de N monstros de um tipo específico (rastreado silenciosamente pelo motor no fim do combate).
- **Contratos de Mapeamento (Reach Floor)**: Exige que o jogador chegue até um andar especificado, simulando coleta de dados topográficos.
- **Contratos de Coleta (Collect Materials)**: Exige acumular uma certa quantidade de materiais de forja.
- Completar os contratos fornece injeções valiosas de **Ouro** e **Materiais** (Comum/Raro/Épico), provendo uma progressão menos dependente apenas do *grind* aleatório de monstros e incentivando certos comportamentos.

## 18. Arquivo de Ameaças (Bestiário)
Todo monstro derrotado é indexado e tem seus dados extraídos para o **Arquivo de Ameaças**.
- O painel exibe o avatar da entidade (usando a seed do *Robohash* gerada matematicamente para aquele modelo de monstro).
- Rastrea o número total de Abates (Kills).
- Registra as localizações de avistamento (Andar Mínimo e Andar Máximo) onde o monstro habita na torre.
- Adiciona um fator "colecionista", onde jogadores buscam encontrar todas as variações dos monstros nos infinitos andares gerados proceduralmente.
