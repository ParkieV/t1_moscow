import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import {
  colorsTuple,
  createTheme,
  DEFAULT_THEME,
  MantineColorScheme,
  MantineProvider,
  mergeMantineTheme
} from "@mantine/core";
import './index.css'
import {App} from "./App.tsx";
import {create} from "zustand";

interface ThemeState {
  theme: MantineColorScheme;
  main_color: string;
  setTheme: (data: {theme: MantineColorScheme, main_color: string}) => void;
  setDefaultTheme: () => void;
}

export const useTheme = create<ThemeState>((setState, getState, store) => ({
  theme: 'dark',
  main_color: '#4f83b9',
  setTheme(data) {
    setState(data)
  },
  setDefaultTheme: () => {
    setState({
      theme: 'dark',
      main_color: '#4f83b9'
    })
  }
}))

const theme = createTheme({
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

const app = createRoot(document.getElementById('root')!)

app.render(
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme='light'>
        <App />
      </MantineProvider>
    </BrowserRouter>
  ,
)
