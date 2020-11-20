#Kunskapkontroll 2

En "väder app" som hämtar alla städers väder situation.
Inte snyggaste i världen men funkar som den ska.

Hur denna app fungerar: 
Den har en auto detection som du måste godkänna först i din browser/mobil för få din Latitude och Longitude.
När du har accepterat den så kommer du få dessa information: 
  *Väder i just den stad du exakt är i ( molningt + ikon)
  *Vindhastighet
  *Vädertemp
  *Fuktighet

Sedan kan du söka en ny stad och då kommer du få samma som förra men denna gång får du en extra rad med information:
*Jämförelse mellan Stad du sökte och Malmö (uppgiften var att jämföra det stad du sökte och Malmö) (kolla också vad händer om du söker på Malmö).

Tyvärr är alla Svenska stad skrivna i o/a eller på engelska (tex sök på Göteborg).

Vill ni veta mer hur hantering i kodväg fungerar får ni gå in till main.js och kolla kommentar.

Error hantering är tyvärr också på engelska. Jag kunde omvandla texten från engelska till svenska men ville behålla ifall API uppdateras med svensk stöd.


Saker jag använde:
Async/await
Math.abs

