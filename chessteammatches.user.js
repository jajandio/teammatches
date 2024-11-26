// ==UserScript==
// @name         Chess.com Team Match ELO Analysis
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Add ELO analysis for team matches on chess.com
// @match        https://www.chess.com/club/matches/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Localization dictionary
    const translations = {
        en: {
            advantage: "Advantage {team}: {boards} Boards"
        },
        es: {
            advantage: "Ventaja {team}: {boards} Tableros"
        }
    };

    // Determine browser language and select appropriate translations
    const lang = navigator.language.startsWith('es') ? 'es' : 'en';
    const t = translations[lang];

    function runScript() {
        // Extract team names
        const teamNamesDiv = document.querySelector('.clubs-team-match-teams');
        let team1Name = "Team 1";
        let team2Name = "Team 2";
        if (teamNamesDiv) {
            const teamNames = teamNamesDiv.innerText.split(" vs ");
            if (teamNames.length === 2) {
                team1Name = teamNames[0].trim();
                team2Name = teamNames[1].trim();
            }
        }

        // Select all pairing rows
        const rows = document.querySelectorAll('.table-component.clubs-team-match-view tr');
        if (rows.length === 0) {
            console.error("No pairing rows found. Check if the selector '.table-component.clubs-team-match-view tr' is correct.");
            return;
        }

        let team1Advantage = 0;
        let team2Advantage = 0;

        rows.forEach((row) => {
            const players = row.querySelectorAll('.clubs-team-match-user-details');
            const boardNumberCell = row.querySelector('.clubs-team-match-place-number');
            const scoreCells = row.querySelectorAll('.clubs-team-match-score');

            if (players.length === 2 && boardNumberCell && scoreCells.length === 2) {
                const team1EloText = players[0].querySelector('.clubs-team-match-user-rating');
                const team2EloText = players[1].querySelector('.clubs-team-match-user-rating');

                if (team1EloText && team2EloText) {
                    const team1Elo = parseInt(team1EloText.innerText.replace(/[()]/g, ''));
                    const team2Elo = parseInt(team2EloText.innerText.replace(/[()]/g, ''));

                    const eloDifference = team1Elo - team2Elo;
                    const absoluteDifference = Math.abs(eloDifference);
                    const opacity = Math.min(absoluteDifference / 150, 1).toFixed(2);

                    if (eloDifference > 0) {
                        // Team 1 has the advantage
                        scoreCells[0].style.backgroundColor = `rgba(129, 182, 76, ${opacity})`;
                        scoreCells[1].style.backgroundColor = `rgba(224, 40, 40, ${opacity})`;
                        team1Advantage++;
                    } else if (eloDifference < 0) {
                        // Team 2 has the advantage
                        scoreCells[0].style.backgroundColor = `rgba(224, 40, 40, ${opacity})`;
                        scoreCells[1].style.backgroundColor = `rgba(129, 182, 76, ${opacity})`;
                        team2Advantage++;
                    }

                    const eloDiffDisplay = document.createElement('div');
                    eloDiffDisplay.innerText = `${eloDifference}`;
                    eloDiffDisplay.style.fontWeight = 'bold';
                    eloDiffDisplay.style.fontSize = '0.9em';
                    boardNumberCell.appendChild(eloDiffDisplay);
                }
            }
        });

        // Display results in the stats section
        const statsSection = document.querySelector('.clubs-team-match-details-stats');
        if (statsSection) {
            const team1StatsRow = document.createElement('div');
            team1StatsRow.className = 'clubs-team-match-details-stats-row';
            team1StatsRow.innerHTML = `
                ${t.advantage.replace('{team}', team1Name).replace('{boards}', team1Advantage)}
            `;

            const team2StatsRow = document.createElement('div');
            team2StatsRow.className = 'clubs-team-match-details-stats-row';
            team2StatsRow.innerHTML = `
                ${t.advantage.replace('{team}', team2Name).replace('{boards}', team2Advantage)}
            `;

            statsSection.appendChild(team1StatsRow);
            statsSection.appendChild(team2StatsRow);
        } else {
            console.error("Stats section not found. Check if the selector '.clubs-team-match-details-stats' is correct.");
        }
    }

    const observer = new MutationObserver((mutations, observerInstance) => {
        const teamMatchView = document.querySelector('.table-component.clubs-team-match-view');
        if (teamMatchView) {
            observerInstance.disconnect();
            runScript();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
