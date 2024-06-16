import {FC} from 'react';
import {Text} from '@gravity-ui/uikit';

import {RequestItemResolved, useResolvedRequests} from 'src/resolvers/useResolvedRequests';
import {MobileTableField} from 'src/components/MobileTableField/MobileTableField';

import {useFetchRequests} from 'src/api/routes';
import css from './MainPageMobile.module.scss';

export const MainPageMobile: FC = () => {
    const requests = useFetchRequests({
        limit: 100,
        offset: 0,
    });

    if (!requests) {
        return <>Loading</>;
    }

    const resolvedRequests = useResolvedRequests(requests);

    return (
        <div className={css.MainPageMobile}>
            <header className={css.MainPageMobile__header}>
                <Text variant="display-1">Все заявки</Text>
                <div className={css.MainPageMobile__list}>
                    {resolvedRequests.map((request: RequestItemResolved, index: number) => (
                        <MobileTableField key={index} data={request} />
                    ))}
                </div>
            </header>
        </div>
    );
}