# Chess.com Team Match ELO Analysis

This Tampermonkey script enhances the team match experience on [Chess.com](https://www.chess.com) by providing detailed ELO analysis for each board pairing. It calculates the ELO difference between opposing players, visually highlights the advantage for each team, and summarizes the overall team advantages in a stats section. The script supports localization, currently offering English and Spanish languages, and is designed for easy extension to support additional languages.

## Features

- **ELO Difference Display**: Shows the ELO rating difference between paired players directly on the match page.
- **Visual Highlights**: Colors the score cells to indicate which player/team has an ELO advantage, with opacity reflecting the magnitude of the advantage.
- **Team Advantage Summary**: Adds a stats section summarizing the number of boards where each team has an ELO advantage.
- **Localization Support**: Automatically detects the browser's preferred language and displays text accordingly (currently supports English and Spanish).
- **Easy Localization Extension**: Centralized translation dictionary for simple addition of new languages.

## Installation

1. Install Tampermonkey in your browser:
    - [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
    - [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
    - [Tampermonkey for Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)
2. Click on the script file (chessteammatches.user.js) to view it, then click the "Raw" button to open the raw script file.
4. Tampermonkey should automatically recognize the script and display an installation window. 
5. Click on "Install" to proceed with the script installation.

After installation, the script will be active and functioning in your browser. With Tampermonkey, you can easily manage, disable, or remove installed scripts by selecting the "Dashboard" option from the Tampermonkey icon in your browser toolbar.

## Usage

- **Navigate to a Team Match Page**: Go to any team match page on Chess.com (e.g., `https://www.chess.com/club/matches/live/*`).
- **Automatic Analysis**: The script will automatically run, analyzing ELO ratings and updating the page content.
- **View ELO Differences**: ELO differences are displayed next to each board number.
- **Observe Visual Highlights**:
  - Green shading indicates an advantage for the player/team.
  - Red shading indicates a disadvantage.
  - The intensity of the color reflects the size of the ELO difference.
- **Check Team Advantages**: Scroll to the stats section to see a summary of the number of boards where each team has an advantage.

## Localization

The script supports localization to display text in the user's preferred language. It currently supports:

- **English** (default)
- **Spanish**

### Adding New Languages

We welcome contributions to add support for more languages. To add a new language:

1. **Edit the Translation Dictionary**: Locate the `translations` object at the top of the script.
2. **Add Your Language**: Insert a new entry with your language code and translated strings.

**Example:**

```javascript
const translations = {
    en: {
        advantage: "Advantage {team}",
        boards: "{boards} Boards"
    },
    es: {
        advantage: "Ventaja {team}",
        boards: "{boards} Tableros"
    },
    fr: {
        advantage: "Avantage {team}",
        boards: "{boards} Plateaux"
    }
    // Add more languages here
};
```

3. **Match Language Code**: Ensure the language code matches the beginning of `navigator.language` for proper detection.

4. **Test Your Changes**: Verify that the script displays the correct text when the browser language is set to your added language.

## Contributing

Contributions are encouraged! Whether it's fixing bugs, adding new features, or enhancing localization, your help is appreciated.

- **Fork the Repository**: Create a fork of this repository.
- **Create a Branch**: Make a new branch for your changes.
- **Commit Your Changes**: Commit your modifications with clear messages.
- **Submit a Pull Request**: Open a pull request to merge your changes into the main branch.

## License

This project is licensed under the [MIT License](LICENSE).

## Disclaimer

This script is a third-party enhancement and is not affiliated with or endorsed by Chess.com. Use it responsibly and at your own risk.

## Contact

For questions, suggestions, or support, please open an issue on the [GitHub repository](https://github.com/jajandio/teammatches/issues).

---
