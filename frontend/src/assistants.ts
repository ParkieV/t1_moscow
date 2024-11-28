import {MantineColorScheme} from '@mantine/core';

export interface Assistant {
  name: string;
  description: string;
  main_color: string;
  theme: MantineColorScheme;
}

export const mockAssistants: Assistant[] = [
  {
    name: 'Финансист',
    description: 'Ассистент для финансовых консультаций',
    main_color: '#FFD700',
    theme: 'dark'
  },
  {
    name: 'Медик',
    description: 'Ассистент для медицинских консультаций',
    main_color: '#8e1717',
    theme: 'light'
  },
  {
    name: 'Юрист',
    description: 'Ассистент для юридических консультаций',
    main_color: '#339538',
    theme: 'dark'
  },
  {
    name: 'Программист',
    description: 'Ассистент для программирования',
    main_color: '#4d9bcc',
    theme: 'dark'
  },
  {
    name: 'Маркетолог',
    description: 'Ассистент для маркетинга',
    main_color: '#ff7f50',
    theme: 'dark'
  },
]
