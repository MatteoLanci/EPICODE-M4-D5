<!--* 1. aggiungi un pulsante 'SALTA' su tutte le card. Al click, dovrebbe far scomparire la card. -->

2. Crea una pagina 'dettagli'. Cliccando su un terzo pulsante sulla card, l'utente deve essere portato ad una pagina html separata dove visualizzerai i dettagli del libro. Per farlo, usa gli URLSearchParams in questo modo:

   <!--* Il link alla pagina dettagli dovrebbe avere una struttura simile > /dettagli.html?id=1940026091 -->
   <!--* dove 1940026091 è l'asin del libro su cui l'utente ha cliccato. -->
   <!--* '?id=1940026091' questa parte si chiama 'search param'. -->

   Nella pagina dettagli, puoi recuperare l'asin usando:
   const params = new URLSearchParams(location.search);
   const id = params.get('id');

   <!--* Esegui quindi la fetch usando l'id:
   https://striveschool-api.herokuapp.com/books/INSERISCI ASIN QUI -->

<!--! EXTRA -->

3. Guarda questi video sugli argomenti di questa settimana, NOTA: sono in inglese, prendi questa opportunità come la possibilità di migliorare la lingua!

https://www.youtube.com/watch?v=ZcQyJ-gxke0
https://www.youtube.com/watch?v=aNDfsHQ5Gts
https://www.youtube.com/watch?v=R3tZ3FtTluQ
https://www.youtube.com/watch?v=K-Q-xyrA89M
https://www.youtube.com/watch?v=a941B7g3fv8
https://www.youtube.com/watch?v=EQem2gugonA
https://www.youtube.com/watch?v=a_8nrslImo4
https://www.youtube.com/watch?v=GfVMKkUk2Uo
https://www.youtube.com/watch?v=drK6mdA9d_M
