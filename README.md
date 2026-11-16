\# The War in Heaven



Jogo de combate 2D para navegador: uma sala, um inimigo, e a defesa certa na hora certa.

Versão 1 de um projeto de portfólio, feito durante o curso de Tecnologia em Jogos Digitais (UNINTER).



\*\*Jogue agora:\*\* https://clementeramom777.github.io/the\_war\_in\_heaven/



\## Controles



| Tecla | Ação |

| --- | --- |

| A / D | Andar |

| Espaço | Pular |

| J | Atacar |

| K | Aparar com o escudo |

| R | Reiniciar (na tela de vitória ou derrota) |



\## Como funciona



\- O inimigo se aproxima e fica \*\*amarelo\*\* antes de atacar: é o aviso do golpe.

\- Dá para escapar recuando, pulando ou \*\*aparando\*\* com K no momento certo.

\- Aparar no tempo certo não custa vida e deixa o inimigo atordoado por um instante.

\- Cada um começa com 100 de vida. Quem zerar primeiro perde.



\## Como rodar localmente



O jogo usa módulos JavaScript, que o navegador não carrega direto do disco. É preciso um servidor local:



&#x20;   python -m http.server 8000



Depois, abra http://localhost:8000 no navegador.



Para rodar os testes (Node 18 ou mais novo, sem instalar nada):



&#x20;   node --test



\## Estrutura



&#x20;   index.html

