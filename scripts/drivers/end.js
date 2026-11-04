/* Show the final screen: two camps became settlements, two were lost. */
S.camps.forEach(c=>c.endT=18);
S.camps[0].state=S.camps[1].state="won";
S.camps[2].state=S.camps[3].state="lost"; S.camps[2].why="hunger"; S.camps[3].why="evicted";
S.t=21; S.phase="over"; render(); show(endModal);
