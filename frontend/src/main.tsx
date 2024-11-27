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
      "#e8f6ff",
      "#d9e8f7",
      "#b6cde5",
      "#90b1d4",
      "#7099c5",
      "#5b8abc",
      "#4f83b9",
      "#3e71a4",
      "#336494",
      "#215785"
    ],
    text: colorsTuple(Array(10).fill('var(--mantine-color-text)'))
  },
})

const theme = mergeMantineTheme(DEFAULT_THEME, myTheme)

const app = createRoot(document.getElementById('root')!)

app.render(
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme='light'>
        <App />
      </MantineProvider>
    </BrowserRouter>
  ,
)
