import {Button, Card, TextInput, Text} from '@gravity-ui/uikit';
import {FC} from 'react';
import {Field} from 'src/components/Field/Field';
import {Field as BaseField, Form} from 'react-final-form'
import { useCallback } from 'react';
import css from './AuthPage.module.scss';

interface FormValues {
    fullName: string;
    password: string;
}

const required = (value: any) => (value ? undefined : 'обязательное поле');

export const AuthPage: FC = () => {
    const handleRegister = useCallback((values: FormValues) => {
        console.log(values); // {username: 'username', password: 'password'}
    }, []);

    return (
        <div className={css.AuthPage}>
            <Card className={css.AuthPage__card}>
                <Text variant="display-1" className={css.AuthPage__header}>Войти</Text>
                <div>
                    <Form
                        onSubmit={handleRegister}
                        render={({ handleSubmit, submitting, pristine, hasValidationErrors }) => (
                            <form onSubmit={handleSubmit} className={css.AuthPage__form}>
                                <Field label="Имя пользователя">
                                    <BaseField name="username" validate={required}>
                                        {({input, meta}) => (
                                            <div className={css.AuthPage__field}>
                                                <TextInput 
                                                    {...input}
                                                    placeholder="Имя пользователя"
                                                    type="text"
                                                    errorMessage={meta.touched && meta.error ? meta.error : ''}
                                                    validationState={meta.touched && meta.error ? 'invalid' : undefined}
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
                                                    {...input}
                                                    placeholder="Пароль"
                                                    type="password"
                                                    errorMessage={meta.touched && meta.error ? meta.error : ''}
                                                    validationState={meta.touched && meta.error ? 'invalid' : undefined}
                                                />
                                            </div>
                                        )}
                                    </BaseField>
                                </Field>
                                <Button type="submit" disabled={submitting || pristine || hasValidationErrors}>Подтвердить</Button>
                            </form>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
}
