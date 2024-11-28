import {Button, Checkbox, Group, Paper, PaperProps, PasswordInput, Stack, Text, TextInput,} from '@mantine/core';
import {useForm} from '@mantine/form';
import {upperFirst, useToggle} from '@mantine/hooks';
import {useCurrentUser} from "../zustand/user.ts";
import {Navigate} from "react-router";
import {useEffect} from "react";

export function AuthenticationForm(props: PaperProps) {
  const [type] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      terms: true,
    },

    validate: {
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const {user, login} = useCurrentUser();
  useEffect(() => {
  }, []);
  console.log(user)
  if (user) return <Navigate to='/'/>
  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Window of knowledge, {type} with
      </Text>
      <form onSubmit={form.onSubmit(({username, password}) => {
        console.log('log')
        login({username, password})
      })}>
        <Stack>

            <TextInput
              label="Username"
              placeholder="Your name"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              radius="md"
            />



          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
