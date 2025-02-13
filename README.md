# Projet Disneyland Paris - Application Mobile Frontend📱

Welcome to your Disneyland Paris mobile app built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev/). This app displays an interactive map of Disneyland Paris and uses the ThemePark API to show a list of attractions, their wait times, and their status (open/closed). It also offers notifications based on the selected wait times.

## Main Features

- **Interactive Map**: Display an interactive map of Disneyland Paris.
- **Real-time Wait Times**: Visualize wait times and attraction statuses in real time.
- **Positioning**: Display the position of attractions and the user on the map.
- **Notifications**: Get notified based on the selected wait times.

## Prerequisites

Before running the project, make sure you have the following installed:

<!-- - **Node.js**: [Download and install Node.js](https://nodejs.org/) -->

- **Expo CLI** (globally installed):
  ```bash
  npm install -g expo-cli
  ```
- **API Key for GoogleMap**

## Get started

1. Clone the repository:

2. Install dependencies

   ```bash
   npm i
   ```

3. Create a config.js file at the root of the project

4. Create a config.js file at the root of the project and add your Google Maps API key. Here is an example:

   ```bash
   export const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY";
   ```

5. Start the frontend

   ```bash
    npm start
   ```

## Important Note

Don't forget to add the **config.js** file to the **.gitignore** to avoid exposing sensitive information such as your API key.

```bash
echo "config.js" >> .gitignore
```

### For the proper functioning of the application, start the Backend before the Frontend
