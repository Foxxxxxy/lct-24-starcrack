import {Icon, Label, Text, TextInput} from '@gravity-ui/uikit';
import {FC, useCallback, useRef, useState} from 'react';

import {Plus} from '@gravity-ui/icons';
import cx from 'classnames';
import {useOutsideClick} from 'src/hooks/useOutsideClick';
import css from './Suggest.module.scss';

export type SuggestItem = {
    label?: string;
    info?: string;
    customInfo?: Record<string, any>;
};

type SuggestProps = {
    placeholder?: string;
    items?: SuggestItem[];
    isLoading?: boolean;
    actionText?: string;
    value: string;
    onChange: (value: string) => void;
    onAction?: () => void;
    onSelect?: (item: SuggestItem) => void;
};

export const Suggest: FC<SuggestProps> = (props) => {
    const {placeholder, items, actionText, value, onChange, onAction, onSelect} = props;
    const [isFocused, setIsFocused] = useState(false);

    const handleClickOutside = () => {
        setIsFocused(false);
    };

    const suggestRef = useRef(null);

    useOutsideClick(suggestRef, handleClickOutside);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const handleSelect = useCallback(
        (item: SuggestItem) => {
            onChange(item.label || '');
            setIsFocused(false);
            if (onSelect) {
                onSelect(item);
            }
        },
        [onChange, setIsFocused],
    );

    return (
        <div className={css.Suggest} ref={suggestRef}>
            <TextInput
                onChange={(el) => onChange(el.target.value)}
                onFocus={handleFocus}
                className={css.Suggest__input}
                placeholder={placeholder}
                value={value}
            />
            {isFocused ? (
                <div className={`${css.SuggestSelect}`}>
                    {items && items.length ? (
                        items.map((item, idx) => {
                            return (
                                <div
                                    key={idx}
                                    className={css.SuggestSelect__item}
                                    onClick={() => handleSelect(item)}
                                >
                                    <Text>{item.label}</Text>
                                    <Text variant="body-1" color="secondary">
                                        {item.info}
                                    </Text>
                                </div>
                            );
                        })
                    ) : (
                        <div className={cx(css.SuggestSelect__item, css.SuggestSelect__action)}>
                            {actionText ? (
                                <div className={css.SuggestSelect__item}>
                                    <Label
                                        theme="unknown"
                                        onClick={onAction}
                                        icon={<Icon size={8} data={Plus} />}
                                    >
                                        {actionText}
                                    </Label>
                                </div>
                            ) : (
                                <div className={css.SuggestSelect__item}>
                                    <Text>К сожалению, таких данных нет</Text>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};
