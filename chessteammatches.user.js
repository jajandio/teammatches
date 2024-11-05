// ==UserScript==
// @name         Chess.com Team Match ELO Analysis with Dynamic Content Support
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Add ELO analysis for team matches on chess.com, supporting dynamic page loads
// @match        https://www.chess.com/club/matches/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded.");

    function runScript() {
        console.log("Running ELO analysis script.");

        // Extract team names
        const teamNamesDiv = document.querySelector('.clubs-team-match-teams');
        let team1Name = "Team 1";
        let team2Name = "Team 2";
        if (teamNamesDiv) {
            const teamNames = teamNamesDiv.innerText.split(" vs ");
            if (teamNames.length === 2) {
                team1Name = teamNames[0].trim();
                team2Name = teamNames[1].trim();
                console.log(`Team names identified: ${team1Name} vs ${team2Name}`);
            } else {
                console.log("Could not parse team names.");
            }
        } else {
            console.log("Team names div not found.");
        }

        // Select all pairing rows
        const rows = document.querySelectorAll('.table-component.clubs-team-match-view tr');
        if (rows.length === 0) {
            console.log("No rows found. Check if the selector '.table-component.clubs-team-match-view tr' is correct.");
            return;
        }
        console.log(`Found ${rows.length} pairing rows.`);

        let team1Advantage = 0;
        let team2Advantage = 0;

        rows.forEach((row, index) => {
            console.log(`Processing row ${index + 1}`);

            const players = row.querySelectorAll('.clubs-team-match-user-details');
            const boardNumberCell = row.querySelector('.clubs-team-match-place-number');
            const scoreCells = row.querySelectorAll('.clubs-team-match-score');
            
            if (players.length === 2 && boardNumberCell && scoreCells.length === 2) {
                console.log("Found two players, board number cell, and score cells in this row.");

                // Extract ELO ratings from both players
                const team1EloText = players[0].querySelector('.clubs-team-match-user-rating');
                const team2EloText = players[1].querySelector('.clubs-team-match-user-rating');

                if (team1EloText && team2EloText) {
                    const team1Elo = parseInt(team1EloText.innerText.replace(/[()]/g, ''));
                    const team2Elo = parseInt(team2EloText.innerText.replace(/[()]/g, ''));
                    console.log(`${team1Name} ELO: ${team1Elo}, ${team2Name} ELO: ${team2Elo}`);

                    // Calculate ELO difference
                    const eloDifference = team1Elo - team2Elo;
                    const absoluteDifference = Math.abs(eloDifference);

                    // Calculate opacity based on ELO difference, capped at 150 points
                    const opacity = Math.min(absoluteDifference / 150, 1).toFixed(2);

                    // Determine color based on ELO difference
                    if (eloDifference > 0) {
                        // Team 1 has the advantage
                        scoreCells[0].style.backgroundColor = `rgba(129, 182, 76, ${opacity})`; // Chess.com green with opacity
                        scoreCells[1].style.backgroundColor = `rgba(224, 40, 40, ${opacity})`; // Chess.com red with opacity
                        team1Advantage++;
                    } else if (eloDifference < 0) {
                        // Team 2 has the advantage
                        scoreCells[0].style.backgroundColor = `rgba(224, 40, 40, ${opacity})`; // Chess.com red with opacity
                        scoreCells[1].style.backgroundColor = `rgba(129, 182, 76, ${opacity})`; // Chess.com green with opacity
                        team2Advantage++;
                    }

                    // Append ELO difference below the board number
                    const eloDiffDisplay = document.createElement('div');
                    eloDiffDisplay.innerText = `${eloDifference}`;
                    eloDiffDisplay.style.fontWeight = 'bold';
                    eloDiffDisplay.style.fontSize = '0.9em';
                    boardNumberCell.appendChild(eloDiffDisplay);
                } else {
                    console.log("ELO ratings not found for one or both players.");
                }
            } else {
                console.log("Did not find exactly two players, board number cell, or score cells in this row.");
            }
        });

        // Display results at the end of the .clubs-team-match-details-stats section
        const statsSection = document.querySelector('.clubs-team-match-details-stats');
        if (statsSection) {
            console.log("Found the stats section, adding the results.");

            // Create a single row for each team's advantage display
            const team1StatsRow = document.createElement('div');
            team1StatsRow.className = 'clubs-team-match-details-stats-row';
            team1StatsRow.innerHTML = `
                Advantage ${team1Name}
                <aside class="clubs-team-match-aside">${team1Advantage} Boards</aside>
            `;

            const team2StatsRow = document.createElement('div');
            team2StatsRow.className = 'clubs-team-match-details-stats-row';
            team2StatsRow.innerHTML = `
                Advantage ${team2Name}
                <aside class="clubs-team-match-aside">${team2Advantage} Boards</aside>
            `;

            // Append the new rows to the stats section
            statsSection.appendChild(team1StatsRow);
            statsSection.appendChild(team2StatsRow);
        } else {
            console.log("Stats section not found. Check if the selector '.clubs-team-match-details-stats' is correct.");
        }
    }

    // MutationObserver to detect when the match page content changes
    const observer = new MutationObserver((mutations, observerInstance) => {
        const teamMatchView = document.querySelector('.table-component.clubs-team-match-view');
        if (teamMatchView) {
            console.log("Detected match view loaded, executing script.");
            observerInstance.disconnect(); // Stop observing once the content is loaded
            runScript(); // Run the main script logic
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
