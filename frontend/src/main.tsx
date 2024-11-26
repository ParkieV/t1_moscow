import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import {colorsTuple, createTheme, DEFAULT_THEME, MantineProvider, mergeMantineTheme} from "@mantine/core";
import './index.css'
import {App} from "./App.tsx";

const myTheme = createTheme({
  primaryColor: 'blue',
  colors: {
    blue: [
      "#feecff",
      "#f3d7fa",
      "#e2adef",
      "#d07fe4",
      "#c259db",
      "#b841d6",
      "#b434d5",
      "#9e26bd",
      "#8d20a9",
      "#7b1694"
    ],
    text: colorsTuple(Array(10).fill('var(--mantine-color-text)'))
  },
})

const theme = mergeMantineTheme(DEFAULT_THEME, myTheme)

const app = createRoot(document.getElementById('root')!)

app.render(
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <App />
      </MantineProvider>
    </BrowserRouter>
  ,
)