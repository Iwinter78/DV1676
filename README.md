# README
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Iwinter78/DV1676/badges/quality-score.png?b=main&s=dd5f89243c5c23c76581baa5111fa95c1988200a)](https://scrutinizer-ci.com/g/Iwinter78/DV1676/?branch=main)

[![Build Status](https://scrutinizer-ci.com/g/Iwinter78/DV1676/badges/build.png?b=main&s=0cae53a69b22388695801fc9c4d12f862708edfa)](https://scrutinizer-ci.com/g/Iwinter78/DV1676/build-status/main)

## Hur man använder

### Förberedelser

Se till att du har följande installerat på din dator:

- **Node.js** och **npm**:
  - Installera från [Node.js officiella hemsida](https://nodejs.org/en/download/package-manager).

#### Skapa .env fil:
När repot är klonat skappa din `.env` fil

   ```env
   MYSQL_ROOT_PASSWORD=root
   MYSQL_DATABASE=magicbike
   MYSQL_USER=admin
   MYSQL_PASSWORD=123123

   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   ```

Så här skapar du `GITHUB_CLIENT_ID` och `GITHUB_CLIENT_SECRET`:
1. Logga in på din GitHub-profil.
2. Gå till **Settings** (Inställningar) på din profil.
3. Navigera till **Developer Settings**.
4. Klicka på **OAuth Apps** i menyn.
5. Klicka på **New OAuth App**.
6. Fyll i de obligatoriska fälten i formuläret.
7. Se till så fälten **Authorization callback URL** slutar med ***/callback***
8. När allt är ifyllt och korrekt, slutför genom att skapa appen.
Efter detta kommer du att få tillgång till din `GITHUB_CLIENT_ID` och `GITHUB_CLIENT_SECRET`.

#### Om du vill köra lokalt

- Installera **MariaDB** på din dator.

#### Om du vill köra med Docker

- Installera **Docker**.

### Bygga applikationen

#### Lokalt

1. Klona repot:
   ```bash
   git clone git@github.com:Iwinter78/DV1676.git

2. Gå till den klonade katalogen:
   ```bash
    cd DV1676

3. Installera nödvändiga beroenden:
   ```bash
    npm install

4. Ställ in databasen:
- Navigera till databaskatalogen:
    ```bash
    cd db
- Starta MariaDB:
    ```bash
    mariadb -uroot -p
Om du använder WSL, kör istället:
    `sudo mariadb`
- Sätt upp databasen:
    ```sql
    source setup.sql;
- Avsluta MariaDB:
    ```sql
    exit;
- Gå tillbaka till huvudkatalogen:
    ```bash
    cd ..

#### Med Docker
1. Bygg och starta applikationen med:
    ```bash
    docker compose -d up

### Kör applikationen

#### Lokalt
För att snabbt komma igång, kör följande kommando för att installera concurrently som utvecklingsberoende:

 `npm install concurrently --save-dev`

Starta sedan applikationen med:
    `npm start`

Om du istället vill starta applikationen manuellt, följ dessa steg:

1.Kör `node index.` för att starta den första delen av applikationen
2. Öppna en ny terminalflik och navigera till `restapi`-mappen med `cd restapi`.
3. Kör sedan `node index.js` för att starta den andra delen av applikationen.


#### Med Docker
Applikationen startades automatiskt när den byggdes.

## License

The content of this project is licensed under the [MIT License](./LICENSE)