import {Button, Card, Text, TextInput, useToaster} from '@gravity-ui/uikit';
import {FC, useCallback} from 'react';
import {Field as BaseField, Form} from 'react-final-form';
import {useNavigate} from 'react-router-dom';
import {Field} from 'src/components/Field/Field';
import css from './AuthPage.module.scss';

import {useMutation} from '@tanstack/react-query';
import {fetchGetToken} from 'src/api/mutations';
import {useFetchUserMe} from 'src/api/routes';
import {updateTokens} from 'src/hooks/useAuth';

type FormValues = {
    username: string;
    password: string;
};

const required = (value: any) => (value ? undefined : 'обязательное поле');

export const AuthPage: FC = () => {
    const navigate = useNavigate();
    const {add} = useToaster();
    const {fetch} = useFetchUserMe();

    const mutationGetToken = useMutation({
        mutationFn: fetchGetToken,
        onSuccess: async (data) => {
            updateTokens(data);
            await fetch(data.access_token);
            add({
                name: 'auth-success',
                title: 'Авторизация прошла успешно',
                theme: 'success',
            });
            navigate('/');
        },
        onError: (error) => {
            console.error(error);
            add({
                name: 'auth-error',
                title: 'Ошибка авторизации',
                theme: 'danger',
            });
        },
    });

    const handleRegister = useCallback((values: FormValues) => {
        add({
            name: 'auth-warn',
            title: 'Загрузка',
            theme: 'info',
        });
        mutationGetToken.mutate({
            username: values.username,
            password: values.password,
        });
    }, []);

    return (
        <div className={css.AuthPage}>
            <Card className={css.AuthPage__card}>
                <Text variant="display-1" className={css.AuthPage__header}>
                    Войти
                </Text>
                <div>
                    <Form
                        onSubmit={handleRegister}
                        render={({handleSubmit, submitting, pristine, hasValidationErrors}) => (
                            <form onSubmit={handleSubmit} className={css.AuthPage__form}>
                                <Field label="Имя пользователя">
                                    <BaseField name="username" validate={required}>
                                        {({input, meta}) => (
                                            <div className={css.AuthPage__field}>
                                                <TextInput
                                                    className={css.AuthPage__input}
                                                    {...input}
                                                    placeholder="Имя пользователя"
                                                    type="text"
                                                    autoComplete="username"
                                                    errorMessage={meta.error}
                                                    validationState={
                                                        meta.touched && meta.error
                                                            ? 'invalid'
                                                            : undefined
                                                    }
                                                    hasClear
                                                />
                                            </div>
                                        )}
                                    </BaseField>
                                </Field>
                                <Field label="Пароль">
                                    <BaseField name="password" validate={required}>
                                        {({input, meta}) => (
                                            <div className={css.AuthPage__field}>
                                                <TextInput
                                                    className={css.AuthPage__input}
                                                    {...input}
                                                    placeholder="Пароль"
                                                    type="password"
                                                    autoComplete="current-password"
                                                    errorMessage={meta.error}
                                                    validationState={
                                                        meta.touched && meta.error
                                                            ? 'invalid'
                                                            : undefined
                                                    }
                                                    hasClear
                                                />
                                            </div>
                                        )}
                                    </BaseField>
                                </Field>
                                <Button
                                    className={css.AuthPage__submit}
                                    type="submit"
                                    disabled={submitting || pristine || hasValidationErrors}
                                >
                                    Подтвердить
                                </Button>
                            </form>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
};
